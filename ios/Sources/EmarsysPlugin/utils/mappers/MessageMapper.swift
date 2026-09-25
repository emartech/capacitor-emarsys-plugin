import Foundation
import EmarsysSDK

class MessageMapper {
    static func map(_ message: EMSMessage) -> [String: Any] {
        var dictionary: [String: Any] = [:]
        dictionary["id"] = message.id
        dictionary["campaignId"] = message.campaignId
        dictionary["collapseId"] = message.collapseId
        dictionary["title"] = message.title
        dictionary["body"] = message.body
        dictionary["imageUrl"] = message.imageUrl
        dictionary["imageAltText"] = message.imageAltText
        dictionary["receivedAt"] = message.receivedAt
        dictionary["updatedAt"] = message.updatedAt
        dictionary["expiresAt"] = message.expiresAt
        dictionary["tags"] = message.tags
        dictionary["properties"] = message.properties
        if let actions = message.actions {
            dictionary["actions"] = actions.map { mapAction($0) }
        }
        return dictionary
    }

    private static func mapAction(_ action: EMSActionModelProtocol) -> [String: Any] {
        var dictionary: [String: Any] = [:]

        if let appEventAction = action as? EMSAppEventActionModel {
            dictionary["id"] = appEventAction.id
            dictionary["title"] = appEventAction.title
            dictionary["type"] = appEventAction.type
            dictionary["name"] = appEventAction.name
            dictionary["payload"] = appEventAction.payload
        } else if let externalUrlAction = action as? EMSOpenExternalUrlActionModel {
            dictionary["id"] = externalUrlAction.id
            dictionary["title"] = externalUrlAction.title
            dictionary["type"] = externalUrlAction.type
            dictionary["url"] = externalUrlAction.url.absoluteString
        } else {
            dictionary["id"] = action.id()
            dictionary["title"] = action.title()
            dictionary["type"] = action.type()
        }

        return dictionary
    }
}
