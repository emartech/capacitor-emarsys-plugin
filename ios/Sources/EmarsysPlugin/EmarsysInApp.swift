import Foundation
import EmarsysSDK

@objc public class EmarsysInApp: NSObject {
    @objc public func pause() {
        Emarsys.inApp.pause()
    }

    @objc public func resume() {
        Emarsys.inApp.resume()
    }

    @objc public func isPaused() -> Bool {
        return Emarsys.inApp.isPaused()
    }
}
