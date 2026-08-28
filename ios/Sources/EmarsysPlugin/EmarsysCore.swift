import Foundation
import EmarsysSDK

@objc public class EmarsysCore: NSObject {
    @objc public func setContact(contactFieldId: Int, contactFieldValue: String, completion: @escaping (Error?) -> Void) {
        Emarsys.setContact(contactFieldId: contactFieldId as NSNumber, contactFieldValue: contactFieldValue) { error in
            completion(error)
        }
    }

    @objc public func trackCustomEvent(eventName: String, eventAttributes: NSDictionary, completion: @escaping (Error?) -> Void) {
        Emarsys.trackCustomEvent(eventName: eventName, eventAttributes: eventAttributes as? [String: String]) { error in
            completion(error)
        }
    }
}
