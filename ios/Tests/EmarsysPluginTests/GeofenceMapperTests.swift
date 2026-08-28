import XCTest
import EmarsysSDK
@testable import EmarsysPlugin

class GeofenceMapperTests: XCTestCase {

    private let actionDict: [String: Any] = [
        "id": "testId",
        "type": "MECustomEvent",
        "name": "testName",
        "payload": ["key": "value"]
    ]

    func testMap_geofenceWithTrigger() {
        let trigger = EMSGeofenceTrigger(
            id: "testTriggerId",
            type: "ENTER",
            loiteringDelay: 123,
            action: actionDict
        )!
        let geofence = EMSGeofence(
            id: "testGeofenceId",
            lat: 12.34,
            lon: 56.78,
            r: 30,
            waitInterval: 90.12,
            triggers: [trigger]
        )!

        let result = GeofenceMapper.map(geofence)

        XCTAssertEqual(result["id"] as? String, "testGeofenceId")
        XCTAssertEqual(result["lat"] as? Double, 12.34)
        XCTAssertEqual(result["lon"] as? Double, 56.78)
        XCTAssertEqual(result["radius"] as? Int, 30)
        XCTAssertEqual(result["waitInterval"] as? Double, 90.12)

        let triggers = result["triggers"] as? [[String: Any]]
        XCTAssertEqual(triggers?.count, 1)

        let t = triggers?.first
        XCTAssertEqual(t?["id"] as? String, "testTriggerId")
        XCTAssertEqual(t?["type"] as? String, "ENTER")
        XCTAssertEqual(t?["loiteringDelay"] as? Int, 123)

        let action = t?["action"] as? [String: Any]
        XCTAssertEqual(action?["id"] as? String, "testId")
        XCTAssertEqual(action?["type"] as? String, "MECustomEvent")
        XCTAssertEqual(action?["name"] as? String, "testName")
    }

    func testMap_geofenceWithEmptyTriggerAction() {
        let trigger = EMSGeofenceTrigger(
            id: "testTriggerId2",
            type: "EXIT",
            loiteringDelay: 456,
            action: [:]
        )!
        let geofence = EMSGeofence(
            id: "testGeofenceId2",
            lat: 12.34,
            lon: 56.78,
            r: 30,
            waitInterval: 90.12,
            triggers: [trigger]
        )!

        let result = GeofenceMapper.map(geofence)

        let triggers = result["triggers"] as? [[String: Any]]
        let action = triggers?.first?["action"] as? [String: Any]
        XCTAssertEqual(action?.count, 0)
    }

    func testMap_geofenceWithNoTriggers() {
        let geofence = EMSGeofence(
            id: "testGeofenceId3",
            lat: 1.0,
            lon: 2.0,
            r: 50,
            waitInterval: 0,
            triggers: []
        )!

        let result = GeofenceMapper.map(geofence)

        XCTAssertEqual(result["id"] as? String, "testGeofenceId3")
        let triggers = result["triggers"] as? [[String: Any]]
        XCTAssertEqual(triggers?.count, 0)
    }

    func testMap_radiusUsesSDKFieldR() {
        let geofence = EMSGeofence(
            id: "id",
            lat: 0,
            lon: 0,
            r: 200,
            waitInterval: 0,
            triggers: []
        )!

        let result = GeofenceMapper.map(geofence)

        // iOS SDK stores radius as `r` — mapper must output it as `radius`
        XCTAssertEqual(result["radius"] as? Int, 200)
        XCTAssertNil(result["r"])
    }
}
