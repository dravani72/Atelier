// Child-window captures may include their parent group. Verify a substantial
// region of the expected video color rather than assuming the image center.
import AppKit
let args = CommandLine.arguments
guard args.count == 3, let data = try? Data(contentsOf: URL(fileURLWithPath: args[1])),
      let image = NSBitmapImageRep(data: data),
      let index = ["red":0, "green":1, "blue":2][args[2]] else {
    fatalError("Cannot inspect native video window capture")
}
var matches = 0, samples = 0
for y in stride(from: 0, to: image.pixelsHigh, by: 16) {
    for x in stride(from: 0, to: image.pixelsWide, by: 16) {
        guard let color = image.colorAt(x: x, y: y)?.usingColorSpace(NSColorSpace.deviceRGB) else { continue }
        let rgb = [color.redComponent, color.greenComponent, color.blueComponent]
        samples += 1
        if rgb[index] > 0.15 && rgb.enumerated().allSatisfy({ $0.offset == index || rgb[index] > $0.element + 0.10 }) { matches += 1 }
    }
}
let fraction = Double(matches) / Double(max(1, samples))
guard fraction > 0.05 else { fatalError("Video was not visibly \(args[2]); matching area \(fraction)") }
print("Window-server video capture passed: \(args[2]), matching area \(fraction)")
