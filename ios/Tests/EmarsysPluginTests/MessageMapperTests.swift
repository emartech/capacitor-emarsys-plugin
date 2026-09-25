import XCTest
import EmarsysSDK
@testable import EmarsysPlugin

class MessageMapperTests: XCTestCase {

    func testMap_messageWithAppEventAction() {
        let action = EMSAppEventActionModel(
            id: "actionId",
            title: "Open",
            type: "MEAppEvent",
            name: "testEvent",
            payload: ["key": "value"]
        )
        let message = EMSMessage(
            id: "msgId",
            campaignId: "campaignId",
            collapseId: "collapseId",
            title: "Title",
            body: "Body",
            imageUrl: "https://example.com/image.png",
            imageAltText: "alt",
            receivedAt: NSNumber(value: 1700000000000),
            updatedAt: NSNumber(value: 1700000001000),
            expiresAt: NSNumber(value: 1700000002000),
            tags: ["seen", "opened"],
            properties: ["propKey": "propValue"],
            actions: [action]
        )

        let result = MessageMapper.map(message)

        XCTAssertEqual(result["id"] as? String, "msgId")
        XCTAssertEqual(result["campaignId"] as? String, "campaignId")
        XCTAssertEqual(result["collapseId"] as? String, "collapseId")
        XCTAssertEqual(result["title"] as? String, "Title")
        XCTAssertEqual(result["body"] as? String, "Body")
        XCTAssertEqual(result["imageUrl"] as? String, "https://example.com/image.png")
        XCTAssertEqual(result["imageAltText"] as? String, "alt")
        XCTAssertEqual(result["receivedAt"] as? NSNumber, NSNumber(value: 1700000000000))
        XCTAssertEqual(result["updatedAt"] as? NSNumber, NSNumber(value: 1700000001000))
        XCTAssertEqual(result["expiresAt"] as? NSNumber, NSNumber(value: 1700000002000))
        XCTAssertEqual(result["tags"] as? [String], ["seen", "opened"])
        XCTAssertEqual(result["properties"] as? [String: String], ["propKey": "propValue"])

        let actions = result["actions"] as? [[String: Any]]
        XCTAssertEqual(actions?.count, 1)

        let a = actions?.first
        XCTAssertEqual(a?["id"] as? String, "actionId")
        XCTAssertEqual(a?["title"] as? String, "Open")
        XCTAssertEqual(a?["type"] as? String, "MEAppEvent")
        XCTAssertEqual(a?["name"] as? String, "testEvent")
        let payload = a?["payload"] as? [String: Any]
        XCTAssertEqual(payload?["key"] as? String, "value")
    }

    func testMap_messageWithOpenExternalUrlAction() {
        let action = EMSOpenExternalUrlActionModel(
            id: "urlActionId",
            title: "Visit",
            type: "OpenExternalUrl",
            url: URL(string: "https://example.com")!
        )
        let message = EMSMessage(
            id: "msgId2",
            campaignId: "campaignId2",
            collapseId: nil,
            title: "Title2",
            body: "Body2",
            imageUrl: nil,
            imageAltText: nil,
            receivedAt: NSNumber(value: 1700000000000),
            updatedAt: nil,
            expiresAt: nil,
            tags: nil,
            properties: nil,
            actions: [action]
        )

        let result = MessageMapper.map(message)

        // nil optionals are omitted
        XCTAssertNil(result["collapseId"])
        XCTAssertNil(result["imageUrl"])
        XCTAssertNil(result["updatedAt"])
        XCTAssertNil(result["expiresAt"])
        XCTAssertNil(result["tags"])
        XCTAssertNil(result["properties"])

        let actions = result["actions"] as? [[String: Any]]
        let a = actions?.first
        XCTAssertEqual(a?["type"] as? String, "OpenExternalUrl")
        XCTAssertEqual(a?["url"] as? String, "https://example.com")
        XCTAssertNil(a?["name"])
    }

    func testMap_messageWithNoActions() {
        let message = EMSMessage(
            id: "msgId3",
            campaignId: "campaignId3",
            collapseId: nil,
            title: "Title3",
            body: "Body3",
            imageUrl: nil,
            imageAltText: nil,
            receivedAt: NSNumber(value: 1700000000000),
            updatedAt: nil,
            expiresAt: nil,
            tags: nil,
            properties: nil,
            actions: nil
        )

        let result = MessageMapper.map(message)

        XCTAssertEqual(result["id"] as? String, "msgId3")
        XCTAssertNil(result["actions"])
    }
}
