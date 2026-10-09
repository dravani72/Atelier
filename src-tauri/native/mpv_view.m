#import <AppKit/AppKit.h>
#import <OpenGL/gl3.h>
#include <dlfcn.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <mpv/client.h>
#include <mpv/render_gl.h>

// All entry points and rendering run on the Cocoa main thread. libmpv owns decoding.
@interface AtelierMPVView : NSOpenGLView
@property(nonatomic) mpv_handle *player;
@property(nonatomic) mpv_render_context *render;
@property(nonatomic,strong) NSTimer *timer;
@property(nonatomic,strong) NSData *profile;
@property(nonatomic,copy) NSString *error;
@property(nonatomic) NSUInteger frames;
@property(nonatomic) BOOL dirty;
@property(nonatomic,copy) NSString *path;
@property(nonatomic) GLint targetFBO;
@property(nonatomic) GLuint videoFBO;
@property(nonatomic) GLuint videoTexture;
@property(nonatomic) NSSize videoSize;
@property(nonatomic,strong) NSArray *sampleRGB;
@property(nonatomic,strong) NSMutableDictionary *properties;
@end
static AtelierMPVView *active;
// A dedicated child surface avoids mixing an NSOpenGL drawable with WKWebView's
// layer tree. It stays in the video viewport and never takes keyboard focus.
@interface AtelierVideoWindow : NSWindow
@end
@implementation AtelierVideoWindow
- (BOOL)canBecomeKeyWindow { return NO; }
- (BOOL)canBecomeMainWindow { return NO; }
@end
static AtelierVideoWindow *surface;
static NSRect screen_rect(NSWindow *parent,double x,double y,double w,double h) {
    NSView *content=parent.contentView;
    NSRect local=NSMakeRect(x,content.isFlipped?y:content.bounds.size.height-y-h,w,h);
    return [parent convertRectToScreen:[content convertRect:local toView:nil]];
}
char *atelier_mpv_status(void);
static void *get_proc(void *ctx, const char *name) { return dlsym(RTLD_DEFAULT, name); }
// The libmpv GL API requires standard state on entry; AppKit's drawing pass
// and our texture/FBO allocation are allowed to change that state.
static void reset_gl_state(void) {
    glDisable(GL_BLEND);glDisable(GL_SCISSOR_TEST);glDisable(GL_DEPTH_TEST);
    glDisable(GL_STENCIL_TEST);glDisable(GL_CULL_FACE);glDisable(GL_FRAMEBUFFER_SRGB);
    glColorMask(GL_TRUE,GL_TRUE,GL_TRUE,GL_TRUE);glDepthMask(GL_TRUE);
    glUseProgram(0);glBindVertexArray(0);glBindBuffer(GL_ARRAY_BUFFER,0);
    glActiveTexture(GL_TEXTURE0);glBindTexture(GL_TEXTURE_2D,0);glBindSampler(0,0);
    glBindBuffer(GL_PIXEL_PACK_BUFFER,0);glBindBuffer(GL_PIXEL_UNPACK_BUFFER,0);
    glPixelStorei(GL_PACK_ROW_LENGTH,0);glPixelStorei(GL_UNPACK_ROW_LENGTH,0);
    glPixelStorei(GL_PACK_ALIGNMENT,4);glPixelStorei(GL_UNPACK_ALIGNMENT,4);
    glBindFramebuffer(GL_FRAMEBUFFER,0);
}
@implementation AtelierMPVView
- (BOOL)acceptsFirstResponder { return NO; }
- (BOOL)isOpaque { return YES; }
- (void)reshape { [super reshape]; [self.openGLContext update]; self.dirty=YES; }
- (void)refreshProfile {
    NSData *data=self.window.screen.colorSpace.ICCProfileData;
    if (data && ![data isEqual:self.profile]) {
        self.profile=data;self.dirty=YES;
        mpv_byte_array bytes={(void *)data.bytes,data.length};
        mpv_render_param p={MPV_RENDER_PARAM_ICC_PROFILE,&bytes};
        if (mpv_render_context_set_parameter(self.render,p)<0) self.error=@"Display ICC profile could not be applied";
    }
}
- (void)tick {
    if (!self.player) return;
    if (!self.render) { [self setNeedsDisplay:YES];[self displayIfNeeded];return; }
    [self.openGLContext makeCurrentContext];
    [self refreshProfile];
    for (;;) {
        mpv_event *event=mpv_wait_event(self.player,0);
        if (event->event_id==MPV_EVENT_NONE) break;
        if (event->event_id==MPV_EVENT_PROPERTY_CHANGE) {
            mpv_event_property *p=event->data;NSString *name=[NSString stringWithUTF8String:p->name];
            if(!p->data)continue;
            if(p->format==MPV_FORMAT_DOUBLE)self.properties[name]=@(*(double *)p->data);
            else if(p->format==MPV_FORMAT_FLAG)self.properties[name]=@(*(int *)p->data);
            else if(p->format==MPV_FORMAT_STRING){char *v=*(char **)p->data;self.properties[name]=v?[NSString stringWithUTF8String:v]:@"";}
        }
        if(event->event_id==MPV_EVENT_COMMAND_REPLY && event->error<0)self.error=[NSString stringWithUTF8String:mpv_error_string(event->error)];
        if (event->event_id==MPV_EVENT_END_FILE) { mpv_event_end_file *end=event->data; if(end->error<0)self.error=[NSString stringWithUTF8String:mpv_error_string(end->error)]; }
    }
    uint64_t updates=mpv_render_context_update(self.render);
    if (!(updates&MPV_RENDER_UPDATE_FRAME) && !self.dirty) return;
    [self setNeedsDisplay:YES];
    [self displayIfNeeded];
}
- (void)drawRect:(NSRect)dirtyRect {
    if(!self.player)return;
    [self.openGLContext makeCurrentContext];
    // AppKit's layer owns the drawable FBO. Zero is not necessarily the
    // surface being composited, and libmpv initialization can change binding.
    GLint target=0;glGetIntegerv(GL_DRAW_FRAMEBUFFER_BINDING,&target);
    if(target)self.targetFBO=target;
    target=self.targetFBO;
    if(!self.render){
        reset_gl_state();
        mpv_opengl_init_params gl={get_proc,NULL};
        mpv_render_param init[]={{MPV_RENDER_PARAM_API_TYPE,MPV_RENDER_API_TYPE_OPENGL},{MPV_RENDER_PARAM_OPENGL_INIT_PARAMS,&gl},{0,NULL}};
        mpv_render_context *context=NULL;int result=mpv_render_context_create(&context,self.player,init);
        if(result<0){self.error=[NSString stringWithUTF8String:mpv_error_string(result)];return;}
        self.render=context;[self refreshProfile];
        const char *args[]={"loadfile",self.path.UTF8String,NULL};
        result=mpv_command_async(self.player,1,args);
        if(result<0)self.error=[NSString stringWithUTF8String:mpv_error_string(result)];
    }
    self.dirty=NO;
    NSRect r=[self convertRectToBacking:self.bounds];
    if(r.size.width<1||r.size.height<1)return;
    if(!self.videoFBO)glGenFramebuffers(1,&_videoFBO);
    if(!self.videoTexture)glGenTextures(1,&_videoTexture);
    glBindTexture(GL_TEXTURE_2D,self.videoTexture);
    if(!NSEqualSizes(self.videoSize,r.size)){
        glTexImage2D(GL_TEXTURE_2D,0,GL_RGBA8,(int)r.size.width,(int)r.size.height,0,GL_RGBA,GL_UNSIGNED_BYTE,NULL);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);
        glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
        self.videoSize=r.size;
    }
    glBindFramebuffer(GL_FRAMEBUFFER,self.videoFBO);
    glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0,GL_TEXTURE_2D,self.videoTexture,0);
    glDrawBuffer(GL_COLOR_ATTACHMENT0);glReadBuffer(GL_COLOR_ATTACHMENT0);
    if(glCheckFramebufferStatus(GL_FRAMEBUFFER)!=GL_FRAMEBUFFER_COMPLETE){self.error=@"Video framebuffer is incomplete";return;}
    mpv_opengl_fbo fbo={(int)self.videoFBO,(int)r.size.width,(int)r.size.height,GL_RGBA8};
    int flip=1,block=0;
    mpv_render_param params[]={{MPV_RENDER_PARAM_OPENGL_FBO,&fbo},{MPV_RENDER_PARAM_FLIP_Y,&flip},{MPV_RENDER_PARAM_BLOCK_FOR_TARGET_TIME,&block},{0,NULL}};
    reset_gl_state();
    int result=mpv_render_context_render(self.render,params);
    if(result<0){self.error=[NSString stringWithUTF8String:mpv_error_string(result)];return;}
    self.frames++;
    const char *smoke=getenv("ATELIER_MPV_SMOKE_LOG");
    if(smoke && self.frames>10) {
        double time=[self.properties[@"time-pos"] doubleValue];
        glBindFramebuffer(GL_READ_FRAMEBUFFER,self.videoFBO);glReadBuffer(GL_COLOR_ATTACHMENT0);
        unsigned char pixel[4]={0};glReadPixels((int)r.size.width/2,(int)r.size.height/2,1,1,GL_RGBA,GL_UNSIGNED_BYTE,pixel);
        self.sampleRGB=@[@(pixel[0]),@(pixel[1]),@(pixel[2])];
        if(time>0.15 && (pixel[0]+pixel[1]+pixel[2])>30 && self.profile.length>0) {
            char *json=atelier_mpv_status();FILE *f=fopen(smoke,"w");if(f){fputs(json,f);fclose(f);}free(json);
        }
    }
    glBindFramebuffer(GL_READ_FRAMEBUFFER,self.videoFBO);glReadBuffer(GL_COLOR_ATTACHMENT0);
    glBindFramebuffer(GL_DRAW_FRAMEBUFFER,target);glDrawBuffer(target?GL_COLOR_ATTACHMENT0:GL_BACK);
    glBlitFramebuffer(0,0,(int)r.size.width,(int)r.size.height,0,0,(int)r.size.width,(int)r.size.height,GL_COLOR_BUFFER_BIT,GL_NEAREST);
    glBindFramebuffer(GL_FRAMEBUFFER,target);
    [self.openGLContext flushBuffer];mpv_render_context_report_swap(self.render);
}
@end
void atelier_mpv_close(void) {
    if(active){
    [active.timer invalidate];active.timer=nil;
    [active.openGLContext makeCurrentContext];
    if(active.render)mpv_render_context_free(active.render);
    active.render=NULL;
    if(active.videoFBO){GLuint fbo=active.videoFBO;glDeleteFramebuffers(1,&fbo);}
    if(active.videoTexture){GLuint texture=active.videoTexture;glDeleteTextures(1,&texture);}
    if(active.player)mpv_terminate_destroy(active.player);
    active.player=NULL;
    [active removeFromSuperview];[active clearGLContext];active=nil;
    }
    [surface.parentWindow removeChildWindow:surface];
    [surface orderOut:nil];[surface close];surface=nil;
}
int atelier_mpv_open(void *window_ptr,const char *path,double x,double y,double w,double h) {
    atelier_mpv_close();
    NSWindow *window=(__bridge NSWindow *)window_ptr;
    NSOpenGLPixelFormatAttribute attrs[]={NSOpenGLPFAOpenGLProfile,NSOpenGLProfileVersion3_2Core,NSOpenGLPFADoubleBuffer,NSOpenGLPFAColorSize,24,NSOpenGLPFAAlphaSize,8,0};
    NSOpenGLPixelFormat *format=[[NSOpenGLPixelFormat alloc]initWithAttributes:attrs];
    if(!format)return -102;
    surface=[[AtelierVideoWindow alloc]initWithContentRect:screen_rect(window,x,y,w,h) styleMask:NSWindowStyleMaskBorderless backing:NSBackingStoreBuffered defer:NO];
    surface.releasedWhenClosed=NO;surface.opaque=YES;surface.backgroundColor=NSColor.blackColor;
    surface.hasShadow=NO;surface.ignoresMouseEvents=YES;surface.level=window.level;
    surface.collectionBehavior=NSWindowCollectionBehaviorFullScreenAuxiliary;
    active=[[AtelierMPVView alloc]initWithFrame:NSMakeRect(0,0,w,h) pixelFormat:format];
    if(!surface || !active || !active.openGLContext){atelier_mpv_close();return -100;}
    active.wantsLayer=YES;
    active.wantsBestResolutionOpenGLSurface=YES;
    active.autoresizingMask=NSViewWidthSizable|NSViewHeightSizable;
    surface.contentView=active;
    [active.openGLContext makeCurrentContext];
    GLint opaque=1;[active.openGLContext setValues:&opaque forParameter:NSOpenGLContextParameterSurfaceOpacity];
    GLint interval=1;[active.openGLContext setValues:&interval forParameter:NSOpenGLContextParameterSwapInterval];
    active.player=mpv_create();if(!active.player){atelier_mpv_close();return -101;}
    const char *options[][2]={{"config","no"},{"terminal","no"},{"vo","libmpv"},{"hwdec","videotoolbox-copy"},{"icc-profile-auto","yes"},{"keep-open","yes"},{"input-default-bindings","no"},{"input-vo-keyboard","no"},{"audio-display","no"},{"access-references","no"},{"ytdl","no"},{"osc","no"},{"target-colorspace-hint","no"}};
    for(size_t i=0;i<sizeof(options)/sizeof(options[0]);i++)mpv_set_option_string(active.player,options[i][0],options[i][1]);
    int result=mpv_initialize(active.player);if(result<0){atelier_mpv_close();return result;}
    active.dirty=YES;active.error=@"";active.properties=[NSMutableDictionary dictionary];active.path=[NSString stringWithUTF8String:path];
    mpv_observe_property(active.player,100,"time-pos",MPV_FORMAT_DOUBLE);
    mpv_observe_property(active.player,101,"duration",MPV_FORMAT_DOUBLE);
    mpv_observe_property(active.player,102,"pause",MPV_FORMAT_FLAG);
    const char *properties[]={"video-codec","hwdec-current","video-params/primaries","video-params/gamma","video-params/colormatrix","video-params/colorlevels","width","height"};
    for(size_t i=0;i<sizeof(properties)/sizeof(properties[0]);i++)mpv_observe_property(active.player,110+i,properties[i],MPV_FORMAT_STRING);
    [window addChildWindow:surface ordered:NSWindowAbove];
    [surface orderFront:nil];
    [active setNeedsDisplay:YES];
    active.timer=[NSTimer timerWithTimeInterval:1.0/60 target:active selector:@selector(tick) userInfo:nil repeats:YES];
    [[NSRunLoop mainRunLoop]addTimer:active.timer forMode:NSRunLoopCommonModes];
    return 0;
}
int atelier_mpv_rect(double x,double y,double w,double h) {
    if(!active)return -1;
    [surface setFrame:screen_rect(surface.parentWindow,x,y,w,h) display:YES];
    [active.openGLContext update];active.dirty=YES;return 0;
}
int atelier_mpv_control(const char *command,double value) {
    if(!active)return -1;
    if(!strcmp(command,"pause")){int pause=value!=0;return mpv_set_property_async(active.player,2,"pause",MPV_FORMAT_FLAG,&pause);}
    if(!strcmp(command,"seek")){char time[64];snprintf(time,sizeof(time),"%.6f",value);const char *args[]={"seek",time,"absolute+exact",NULL};return mpv_command_async(active.player,3,args);}
    if(!strcmp(command,"frame")){const char *args[]={value<0?"frame-back-step":"frame-step",NULL};return mpv_command_async(active.player,4,args);}
    if(!strcmp(command,"volume")||!strcmp(command,"speed"))return mpv_set_property_async(active.player,5,command,MPV_FORMAT_DOUBLE,&value);
    return -2;
}
static NSString *strprop(const char *name){return active.properties[[NSString stringWithUTF8String:name]]?:@"";}
char *atelier_mpv_status(void) {
    if(!active)return strdup("{}");
    double time=[active.properties[@"time-pos"] doubleValue],duration=[active.properties[@"duration"] doubleValue];int pause=[active.properties[@"pause"] intValue];
    NSDictionary *data=@{@"time":@(time),@"duration":@(duration),@"pause":@(pause),@"frames":@(active.frames),@"displayProfile":active.window.screen.colorSpace.localizedName?:@"",@"videoFBO":@(active.videoFBO),@"targetFBO":@(active.targetFBO),@"sampleRGB":active.sampleRGB?:@[],@"surfaceWindow":@(surface.windowNumber),@"surfaceVisible":@(surface.visible),@"icc":@(active.profile.length>0),@"error":active.error?:@"",@"codec":strprop("video-codec"),@"hwdec":strprop("hwdec-current"),@"primaries":strprop("video-params/primaries"),@"gamma":strprop("video-params/gamma"),@"matrix":strprop("video-params/colormatrix"),@"range":strprop("video-params/colorlevels"),@"width":strprop("width"),@"height":strprop("height")};
    NSData *json=[NSJSONSerialization dataWithJSONObject:data options:0 error:nil];return strndup(json.bytes,json.length);
}
void atelier_mpv_free(char *ptr){free(ptr);}
