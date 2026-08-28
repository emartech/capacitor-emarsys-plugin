import Foundation
import EmarsysSDK

@objc public class EmarsysPush: NSObject {
    @objc public func setPushToken(pushToken: String, completion: @escaping (Error?) -> Void) {
        let tokenData = Data(hexString: pushToken)
        Emarsys.push.setPushToken(pushToken: tokenData) { error in
            completion(error)
        }
    }

    @objc public func clearPushToken(completion: @escaping (Error?) -> Void) {
        Emarsys.push.clearPushToken() { error in
            completion(error)
        }
    }

    @objc public func getPushToken() -> String? {
        guard let tokenData = Emarsys.push.pushToken() else { return nil }
        return tokenData.hexString
    }
}
