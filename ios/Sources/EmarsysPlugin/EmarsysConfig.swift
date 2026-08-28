import Foundation
import EmarsysSDK

@objc public class EmarsysConfig: NSObject {
    @objc public func changeApplicationCode(_ applicationCode: String, completion: @escaping (Error?) -> Void) {
        Emarsys.config.changeApplicationCode(applicationCode: applicationCode) { error in
            completion(error)
        }
    }

    @objc public func changeMerchantId(_ merchantId: String) {
        Emarsys.config.changeMerchantId(merchantId: merchantId)
    }

    @objc public func getApplicationCode() -> String? {
        return Emarsys.config.applicationCode()
    }

    @objc public func getMerchantId() -> String? {
        return Emarsys.config.merchantId()
    }

    @objc public func getClientId() -> String? {
        return Emarsys.config.clientId()
    }

    @objc public func getLanguageCode() -> String? {
        return Emarsys.config.languageCode()
    }

    @objc public func getSdkVersion() -> String? {
        return Emarsys.config.sdkVersion()
    }
}
