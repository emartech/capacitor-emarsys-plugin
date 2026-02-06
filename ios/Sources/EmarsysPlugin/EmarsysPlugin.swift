import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(EmarsysPlugin)
public class EmarsysPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "EmarsysPlugin"
    public let jsName = "Emarsys"
    private let implementation = EmarsysCore()

}
