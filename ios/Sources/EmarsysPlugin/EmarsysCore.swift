import Foundation
import EmarsysSDK

@objc public class EmarsysCore: NSObject {
    @objc public func trackCustomEvent(eventName: String, eventAttributes: NSDictionary, completion: @escaping (Error?) -> Void) {
        Emarsys.trackCustomEvent(eventName: eventName, eventAttributes: eventAttributes as? [String: String]) { error in
            completion(error)
        }
    }
}
