// Inspect the actual window-server capture, rather than a decoder framebuffer.
import AppKit
let args = CommandLine.arguments
guard args.count == 3, let data = try? Data(contentsOf: URL(fileURLWithPath: args[1])),
      let image = NSBitmapImageRep(data: data),
      let color = image.colorAt(x: image.pixelsWide / 2, y: image.pixelsHigh / 2)?.usingColorSpace(NSColorSpace.deviceRGB) else {
    fatalError("Cannot inspect native video window capture")
}
let channels = [color.redComponent, color.greenComponent, color.blueComponent]
let index = ["red":0, "green":1, "blue":2][args[2]]!
let expected = channels[index]
let others = channels.enumerated().filter { $0.offset != index }.map { $0.element }
guard expected > 0.15 && others.allSatisfy({ expected > $0 + 0.10 }) else {
    fatalError("Video was not visibly \(args[2]); captured RGB \(channels)")
}
print("Window-server video capture passed: \(args[2]), RGB \(channels)")
