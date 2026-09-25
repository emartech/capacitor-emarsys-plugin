import Foundation
import EmarsysSDK

@objc public class EmarsysInbox: NSObject {
    @objc public func fetchMessages(completion: @escaping ([[String: Any]]?, Error?) -> Void) {
        Emarsys.messageInbox.fetchMessages { inboxResult, error in
            if let error = error {
                completion(nil, error)
            } else {
                let messages = (inboxResult?.messages ?? []).map { MessageMapper.map($0) }
                completion(messages, nil)
            }
        }
    }

}
