package com.emarsys.plugin.emarsys.utils.mappers;

import com.emarsys.mobileengage.api.geofence.Geofence;
import com.emarsys.mobileengage.api.geofence.Trigger;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class GeofenceMapper {

    public static JSONArray mapGeofences(List<Geofence> geofences) {
        JSONArray result = new JSONArray();
        for (Geofence geofence : geofences) {
            result.put(mapGeofence(geofence));
        }
        return result;
    }

    private static JSONObject mapGeofence(Geofence geofence) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", geofence.getId());
            obj.put("lat", geofence.getLat());
            obj.put("lon", geofence.getLon());
            obj.put("radius", geofence.getRadius());
            Double waitInterval = geofence.getWaitInterval();
            if (waitInterval != null) {
                obj.put("waitInterval", waitInterval);
            }
            JSONArray triggers = new JSONArray();
            for (Trigger trigger : geofence.getTriggers()) {
                triggers.put(mapTrigger(trigger));
            }
            obj.put("triggers", triggers);
        } catch (JSONException e) {
            // fields are non-null primitives; exception won't occur
        }
        return obj;
    }

    private static JSONObject mapTrigger(Trigger trigger) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", trigger.getId());
            obj.put("type", trigger.getType().name());
            obj.put("loiteringDelay", trigger.getLoiteringDelay());
            obj.put("action", trigger.getAction());
        } catch (JSONException e) {
            // fields are non-null; exception won't occur
        }
        return obj;
    }
}
