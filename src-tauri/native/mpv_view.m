#import <AppKit/AppKit.h>
#import <CoreGraphics/CoreGraphics.h>
#include <stdlib.h>
#include <math.h>
#include <stdio.h>
#include <string.h>
#include <mpv/client.h>
#include <mpv/render.h>

// All entry points and rendering run on the Cocoa main thread. libmpv owns decoding.
@interface AtelierMPVView : NSImageView
@property(nonatomic) mpv_handle *player;
@property(nonatomic) mpv_render_context *render;
@property(nonatomic,strong) NSTimer *timer;
@property(nonatomic,copy) NSString *error;
@property(nonatomic) NSUInteger frames;
@property(nonatomic) BOOL dirty;
@property(nonatomic) unsigned char *pixels;
@property(nonatomic) size_t stride;
@property(nonatomic) NSSize videoSize;
@property(nonatomic,strong) NSArray *sampleRGB;
@property(nonatomic,strong) NSMutableDictionary *properties;
@end
static AtelierMPVView *active;
// A dedicated child surface keeps native video above WKWebView's layer tree. It stays in the video viewport and never takes keyboard focus.
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
@implementation AtelierMPVView
- (BOOL)acceptsFirstResponder { return NO; }
- (BOOL)isOpaque { return YES; }
- (void)tick {
    if (!self.player) return;
    if (!self.render) return;
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
        if(event->event_id==MPV_EVENT_LOG_MESSAGE){
            mpv_event_log_message *message=event->data;
            fprintf(stderr,"libmpv [%s] %s",message->prefix,message->text);
            if(message->log_level<=MPV_LOG_LEVEL_ERROR)self.error=[NSString stringWithUTF8String:message->text];
        }
        if(event->event_id==MPV_EVENT_COMMAND_REPLY && event->error<0)self.error=[NSString stringWithUTF8String:mpv_error_string(event->error)];
        if (event->event_id==MPV_EVENT_END_FILE) { mpv_event_end_file *end=event->data; if(end->error<0)self.error=[NSString stringWithUTF8String:mpv_error_string(end->error)]; }
    }
    uint64_t updates=mpv_render_context_update(self.render);
    if (!(updates&MPV_RENDER_UPDATE_FRAME) && !self.dirty) return;
    self.dirty=NO;
    NSRect backing=[self convertRectToBacking:self.bounds];
    // Bound software conversion work. Cocoa scales the SDR preview to the
    // viewport; the original media and decoder resolution stay unchanged.
    double scale=fmin(1.0,fmin(1280.0/fmax(1,backing.size.width),720.0/fmax(1,backing.size.height)));
    int size[2]={(int)fmax(1,backing.size.width*scale),(int)fmax(1,backing.size.height*scale)};
    NSSize output=NSMakeSize(size[0],size[1]);
    if(!NSEqualSizes(self.videoSize,output)) {
        free(self.pixels);self.pixels=NULL;
        self.stride=((size_t)size[0]*4+63)&~(size_t)63;
        void *buffer=NULL;
        if(posix_memalign(&buffer,64,self.stride*(size_t)size[1])){self.error=@"Video preview allocation failed";return;}
        self.pixels=buffer;self.videoSize=output;
    }
    size_t stride=self.stride;int block=0;
    mpv_render_param params[]={{MPV_RENDER_PARAM_SW_SIZE,size},{MPV_RENDER_PARAM_SW_FORMAT,"rgb0"},{MPV_RENDER_PARAM_SW_STRIDE,&stride},{MPV_RENDER_PARAM_SW_POINTER,self.pixels},{MPV_RENDER_PARAM_BLOCK_FOR_TARGET_TIME,&block},{0,NULL}};
    int result=mpv_render_context_render(self.render,params);
    if(result<0){self.error=[NSString stringWithUTF8String:mpv_error_string(result)];return;}
    // Give the compositor immutable pixels, so the next decoded frame cannot
    // overwrite an image that AppKit is still displaying. rgb0's spare byte is
    // deliberately ignored rather than interpreted as alpha.
    CFDataRef data=CFDataCreate(kCFAllocatorDefault,self.pixels,stride*(size_t)size[1]);
    CGDataProviderRef provider=data?CGDataProviderCreateWithCFData(data):NULL;
    CGColorSpaceRef color=CGColorSpaceCreateWithName(kCGColorSpaceSRGB);
    CGImageRef image=provider?CGImageCreate(size[0],size[1],8,32,stride,color,kCGImageAlphaNoneSkipLast|kCGBitmapByteOrder32Big,provider,NULL,true,kCGRenderingIntentDefault):NULL;
    if(image)self.image=[[NSImage alloc]initWithCGImage:image size:self.bounds.size];
    else self.error=@"Video preview image could not be created";
    if(image)CGImageRelease(image);
    CGColorSpaceRelease(color);if(provider)CGDataProviderRelease(provider);if(data)CFRelease(data);
    [self setNeedsDisplay:YES];[self displayIfNeeded];
    mpv_render_context_report_swap(self.render);self.frames++;
    const char *smoke=getenv("ATELIER_MPV_SMOKE_LOG");
    if(smoke && self.frames>10) {
        unsigned char *pixel=self.pixels+stride*(size[1]/2)+4*(size[0]/2);
        self.sampleRGB=@[@(pixel[0]),@(pixel[1]),@(pixel[2])];
        if([self.properties[@"time-pos"] doubleValue]>0.15) {
            char *json=atelier_mpv_status();FILE *f=fopen(smoke,"w");if(f){fputs(json,f);fclose(f);}free(json);
        }
    }
}
@end
void atelier_mpv_close(void) {
    if(active){
    [active.timer invalidate];active.timer=nil;
    if(active.render)mpv_render_context_free(active.render);
    active.render=NULL;
    free(active.pixels);active.pixels=NULL;
    if(active.player)mpv_terminate_destroy(active.player);
    active.player=NULL;
    [active removeFromSuperview];active=nil;
    }
    [surface.parentWindow removeChildWindow:surface];
    [surface orderOut:nil];[surface close];surface=nil;
}
int atelier_mpv_open(void *window_ptr,const char *path,double x,double y,double w,double h) {
    atelier_mpv_close();
    NSWindow *window=(__bridge NSWindow *)window_ptr;
    surface=[[AtelierVideoWindow alloc]initWithContentRect:screen_rect(window,x,y,w,h) styleMask:NSWindowStyleMaskBorderless backing:NSBackingStoreBuffered defer:NO];
    surface.releasedWhenClosed=NO;surface.opaque=YES;surface.backgroundColor=NSColor.blackColor;
    surface.hasShadow=NO;surface.ignoresMouseEvents=YES;surface.level=window.level;
    surface.collectionBehavior=NSWindowCollectionBehaviorFullScreenAuxiliary;
    active=[[AtelierMPVView alloc]initWithFrame:NSMakeRect(0,0,w,h)];
    if(!surface || !active){atelier_mpv_close();return -100;}
    active.wantsLayer=YES;
    active.autoresizingMask=NSViewWidthSizable|NSViewHeightSizable;
    surface.contentView=active;
    active.player=mpv_create();if(!active.player){atelier_mpv_close();return -101;}
    const char *options[][2]={{"config","no"},{"terminal","no"},{"vo","libmpv"},{"hwdec","no"},{"video-timing-offset","0"},{"sw-fast","yes"},{"keep-open","yes"},{"input-default-bindings","no"},{"input-vo-keyboard","no"},{"audio-display","no"},{"access-references","no"},{"ytdl","no"},{"osc","no"},{"target-colorspace-hint","no"}};
    for(size_t i=0;i<sizeof(options)/sizeof(options[0]);i++)mpv_set_option_string(active.player,options[i][0],options[i][1]);
    int result=mpv_initialize(active.player);if(result<0){atelier_mpv_close();return result;}
    mpv_request_log_messages(active.player,"warn");
    mpv_render_param init[]={{MPV_RENDER_PARAM_API_TYPE,MPV_RENDER_API_TYPE_SW},{0,NULL}};
    mpv_render_context *context=NULL;result=mpv_render_context_create(&context,active.player,init);
    if(result<0){atelier_mpv_close();return result;}active.render=context;
    active.dirty=YES;active.error=@"";active.properties=[NSMutableDictionary dictionary];active.imageScaling=NSImageScaleAxesIndependently;
    mpv_observe_property(active.player,100,"time-pos",MPV_FORMAT_DOUBLE);
    mpv_observe_property(active.player,101,"duration",MPV_FORMAT_DOUBLE);
    mpv_observe_property(active.player,102,"pause",MPV_FORMAT_FLAG);
    const char *properties[]={"video-codec","hwdec-current","video-params/primaries","video-params/gamma","video-params/colormatrix","video-params/colorlevels","width","height"};
    for(size_t i=0;i<sizeof(properties)/sizeof(properties[0]);i++)mpv_observe_property(active.player,110+i,properties[i],MPV_FORMAT_STRING);
    [window addChildWindow:surface ordered:NSWindowAbove];
    [surface orderFront:nil];
    const char *args[]={"loadfile",path,NULL};result=mpv_command_async(active.player,1,args);
    if(result<0){atelier_mpv_close();return result;}
    active.timer=[NSTimer timerWithTimeInterval:1.0/60 target:active selector:@selector(tick) userInfo:nil repeats:YES];
    [[NSRunLoop mainRunLoop]addTimer:active.timer forMode:NSRunLoopCommonModes];
    return 0;
}
int atelier_mpv_rect(double x,double y,double w,double h) {
    if(!active)return -1;
    [surface setFrame:screen_rect(surface.parentWindow,x,y,w,h) display:YES];
    active.dirty=YES;return 0;
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
    NSDictionary *data=@{@"time":@(time),@"duration":@(duration),@"pause":@(pause),@"frames":@(active.frames),@"displayProfile":active.window.screen.colorSpace.localizedName?:@"",@"sampleRGB":active.sampleRGB?:@[],@"surfaceWindow":@(surface.windowNumber),@"surfaceVisible":@(surface.visible),@"renderer":@"software",@"colorManagement":@"ColorSync sRGB",@"previewWidth":@(active.videoSize.width),@"previewHeight":@(active.videoSize.height),@"error":active.error?:@"",@"codec":strprop("video-codec"),@"hwdec":strprop("hwdec-current"),@"primaries":strprop("video-params/primaries"),@"gamma":strprop("video-params/gamma"),@"matrix":strprop("video-params/colormatrix"),@"range":strprop("video-params/colorlevels"),@"width":strprop("width"),@"height":strprop("height")};
    NSData *json=[NSJSONSerialization dataWithJSONObject:data options:0 error:nil];return strndup(json.bytes,json.length);
}
void atelier_mpv_free(char *ptr){free(ptr);}
