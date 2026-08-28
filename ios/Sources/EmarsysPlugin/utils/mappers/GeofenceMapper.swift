import Foundation
import EmarsysSDK

class GeofenceMapper {
    static func map(_ geofence: EMSGeofence) -> [String: Any] {
        return [
            "id": geofence.id,
            "lat": geofence.lat,
            "lon": geofence.lon,
            "radius": Int(geofence.r),
            "waitInterval": geofence.waitInterval,
            "triggers": geofence.triggers.map { mapTrigger($0) }
        ]
    }

    private static func mapTrigger(_ trigger: EMSGeofenceTrigger) -> [String: Any] {
        return [
            "id": trigger.id,
            "type": trigger.type,
            "loiteringDelay": Int(trigger.loiteringDelay),
            "action": trigger.action ?? [:]
        ]
    }
}
