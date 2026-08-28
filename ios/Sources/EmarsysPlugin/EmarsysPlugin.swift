import Foundation
import Capacitor
import EmarsysSDK

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
        CAPPluginMethod(name: "getPushToken", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "pauseInApp", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "resumeInApp", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isInAppPaused", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "changeApplicationCode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "changeMerchantId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getApplicationCode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getMerchantId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getClientId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getLanguageCode", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getSdkVersion", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = EmarsysCore()
    private let push = EmarsysPush()
    private let inApp = EmarsysInApp()
    private let config = EmarsysConfig()

    private static let eventName = "emarsysEventHandler"

    // MARK: - Event bus

    /// Called by the Capacitor bridge when the plugin is loaded (after the app's `Emarsys.setup`).
    public override func load() {
        let handler: EMSEventHandlerBlock = { [weak self] name, payload in
            self?.forward(eventName: name, payload: payload)
        }
        Emarsys.push.notificationEventHandler = handler
        Emarsys.push.silentMessageEventHandler = handler
        Emarsys.inApp.eventHandler = handler
        Emarsys.onEventAction.eventHandler = handler
        Emarsys.geofence.eventHandler = handler
    }

    private func forward(eventName: String, payload: [AnyHashable: Any]?) {
        var normalizedPayload: [String: Any] = [:]
        if let payload = payload {
            for (key, value) in payload {
                if let key = key as? String {
                    normalizedPayload[key] = value
                }
            }
        }
        let data: [String: Any] = [
            "eventName": eventName,
            "payload": normalizedPayload
        ]
        DispatchQueue.main.async { [weak self] in
            self?.notifyListeners(EmarsysPlugin.eventName, data: data, retainUntilConsumed: true)
        }
    }

    // MARK: - Contact

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

    // MARK: - InApp

    @objc func pauseInApp(_ call: CAPPluginCall) {
        inApp.pause()
        call.resolve()
    }

    @objc func resumeInApp(_ call: CAPPluginCall) {
        inApp.resume()
        call.resolve()
    }

    @objc func isInAppPaused(_ call: CAPPluginCall) {
        call.resolve(["isPaused": inApp.isPaused()])
    }

    // MARK: - Config

    @objc func changeApplicationCode(_ call: CAPPluginCall) {
        guard let applicationCode = call.getString("applicationCode") else {
            call.reject("applicationCode is required")
            return
        }
        config.changeApplicationCode(applicationCode) { error in
            if let error = error {
                call.reject("Change application code error", error.localizedDescription)
            } else {
                call.resolve()
            }
        }
    }

    @objc func changeMerchantId(_ call: CAPPluginCall) {
        guard let merchantId = call.getString("merchantId") else {
            call.reject("merchantId is required")
            return
        }
        config.changeMerchantId(merchantId)
        call.resolve()
    }

    @objc func getApplicationCode(_ call: CAPPluginCall) {
        call.resolve(["applicationCode": config.getApplicationCode() ?? ""])
    }

    @objc func getMerchantId(_ call: CAPPluginCall) {
        call.resolve(["merchantId": config.getMerchantId() ?? ""])
    }

    @objc func getClientId(_ call: CAPPluginCall) {
        call.resolve(["clientId": config.getClientId() ?? ""])
    }

    @objc func getLanguageCode(_ call: CAPPluginCall) {
        call.resolve(["languageCode": config.getLanguageCode() ?? ""])
    }

    @objc func getSdkVersion(_ call: CAPPluginCall) {
        call.resolve(["sdkVersion": config.getSdkVersion() ?? ""])
    }
}
