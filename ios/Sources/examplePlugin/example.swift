import Foundation

@objc public class example: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
