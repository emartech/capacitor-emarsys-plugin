import Foundation
import EmarsysSDK

@objc public class EmarsysGeofence: NSObject {
    @objc public func enable(completion: @escaping (Error?) -> Void) {
        Emarsys.geofence.enable { error in completion(error) }
    }

    @objc public func disable() {
        Emarsys.geofence.disable()
    }

    @objc public func isEnabled() -> Bool {
        return Emarsys.geofence.isEnabled()
    }

    @objc public func getRegisteredGeofences() -> [[String: Any]] {
        return Emarsys.geofence.registeredGeofences().map { GeofenceMapper.map($0) }
    }
}
