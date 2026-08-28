package com.emarsys.plugin.emarsys;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@CapacitorPlugin(name = "Emarsys")
public class EmarsysPlugin extends Plugin {

    private EmarsysCore implementation = new EmarsysCore();

    @PluginMethod
    public void setContact(PluginCall call) {
        Integer contactFieldId = call.getInt("contactFieldId");
        String contactFieldValue = call.getString("contactFieldValue");

        if (contactFieldId == null || contactFieldValue == null) {
            call.reject("contactFieldId and contactFieldValue are required");
            return;
        }

        implementation.setContact(contactFieldId, contactFieldValue, error -> {
            if (error != null) {
                call.reject(error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void clearContact(PluginCall call) {
        implementation.clearContact(error -> {
            if (error != null) {
                call.reject(error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void trackCustomEvent(PluginCall call) {
        String eventName = call.getString("eventName");

        if (eventName == null || eventName.isEmpty()) {
            call.reject("eventName is required");
            return;
        }

        JSObject attrs = call.getObject("eventAttributes", new JSObject());
        Map<String, String> eventAttributes = new HashMap<>();
        Iterator<String> keys = attrs.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            String value = attrs.optString(key, null);
            if (value != null) {
                eventAttributes.put(key, value);
            }
        }

        implementation.trackCustomEvent(eventName, eventAttributes, error -> {
            if (error != null) {
                call.reject(error.getMessage());
            } else {
                call.resolve();
            }
        });
    }
}
