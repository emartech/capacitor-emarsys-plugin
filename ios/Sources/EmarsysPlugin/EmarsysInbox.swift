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

    @objc public func addTag(_ tag: String, messageId: String, completion: @escaping (Error?) -> Void) {
        Emarsys.messageInbox.addTag(tag: tag, messageId: messageId) { error in completion(error) }
    }

    @objc public func removeTag(_ tag: String, messageId: String, completion: @escaping (Error?) -> Void) {
        Emarsys.messageInbox.removeTag(tag: tag, messageId: messageId) { error in completion(error) }
    }
}
