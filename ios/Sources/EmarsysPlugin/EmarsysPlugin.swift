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
        CAPPluginMethod(name: "setContact", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clearContact", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "trackCustomEvent", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setPushToken", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clearPushToken", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getPushToken", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = EmarsysCore()
    private let push = EmarsysPush()

    @objc func setContact(_ call: CAPPluginCall) {
        guard let contactFieldId = call.getInt("contactFieldId") else {
            call.reject("contactFieldId is required")
            return
        }
        guard let contactFieldValue = call.getString("contactFieldValue") else {
            call.reject("contactFieldValue is required")
            return
        }
        
        implementation.setContact(contactFieldId: contactFieldId, contactFieldValue: contactFieldValue) { error in
            if let error = error {
                call.reject("Set contact error", error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }

    @objc func clearContact(_ call: CAPPluginCall) {
        implementation.clearContact() { error in
            if let error = error {
                call.reject("Clear contact error", error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }

    @objc func trackCustomEvent(_ call: CAPPluginCall) {
        guard let eventName = call.getString("eventName") else {
            call.reject("eventName is required")
            return
        }
        let eventAttributes = call.getObject("eventAttributes") as NSDictionary? ?? [:]
        
        implementation.trackCustomEvent(eventName: eventName, eventAttributes: eventAttributes) { error in
            if let error = error {
                call.reject("Track custom event error", error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }

    // MARK: - Push

    @objc func setPushToken(_ call: CAPPluginCall) {
        guard let pushToken = call.getString("pushToken") else {
            call.reject("pushToken is required")
            return
        }

        push.setPushToken(pushToken: pushToken) { error in
            if let error = error {
                call.reject("Set push token error", error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }

    @objc func clearPushToken(_ call: CAPPluginCall) {
        push.clearPushToken() { error in
            if let error = error {
                call.reject("Clear push token error", error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }

    @objc func getPushToken(_ call: CAPPluginCall) {
        let pushToken = push.getPushToken()
        call.resolve([
            "pushToken": pushToken ?? ""
        ])
    }
}
