import XCTest
@testable import EmarsysPlugin

class EmarsysPluginTests: XCTestCase {
    func testPluginLoads() {
        XCTAssertNotNil(EmarsysPlugin.self)
    }
}
