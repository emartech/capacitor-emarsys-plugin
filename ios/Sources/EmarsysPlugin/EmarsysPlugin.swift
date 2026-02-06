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
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "trackCustomEvent", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = EmarsysCore()

    @objc func trackCustomEvent(_ call: CAPPluginCall) {
        let eventName = call.getString("eventName") ?? ""
        let eventAttributes = call.getObject("eventAttributes") as NSDictionary? ?? [:]
        
        implementation.trackCustomEvent(eventName: eventName, eventAttributes: eventAttributes) { error in
            if let error = error {
                call.reject("Error tracking custom event", error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }
}
