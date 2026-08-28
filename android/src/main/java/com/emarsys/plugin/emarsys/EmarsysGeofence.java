package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;
import com.emarsys.plugin.emarsys.utils.mappers.GeofenceMapper;
import org.json.JSONArray;

public class EmarsysGeofence {

    public void enable(EmarsysCompletionListener listener) {
        Emarsys.getGeofence().enable((error) -> listener.onComplete(error));
    }

    public void disable() {
        Emarsys.getGeofence().disable();
    }

    public boolean isEnabled() {
        return Emarsys.getGeofence().isEnabled();
    }

    public JSONArray getRegisteredGeofences() {
        return GeofenceMapper.mapGeofences(Emarsys.getGeofence().getRegisteredGeofences());
    }
}
