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
    private EmarsysPushCore push = new EmarsysPushCore();

    @PluginMethod
    public void setContact(PluginCall call) {
        Integer contactFieldId = call.getInt("contactFieldId");
        String contactFieldValue = call.getString("contactFieldValue");

        if (contactFieldId == null) {
            call.reject("contactFieldId is required");
            return;
        }
        if (contactFieldValue == null) {
            call.reject("contactFieldValue is required");
            return;
        }

        implementation.setContact(contactFieldId, contactFieldValue, error -> {
            if (error != null) {
                call.reject("Set contact error", error.getMessage());
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
                call.reject("Track custom event error", error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    // Push

    @PluginMethod
    public void setPushToken(PluginCall call) {
        String pushToken = call.getString("pushToken");

        if (pushToken == null || pushToken.isEmpty()) {
            call.reject("pushToken is required");
            return;
        }

        push.setPushToken(pushToken, error -> {
            if (error != null) {
                call.reject(error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void clearPushToken(PluginCall call) {
        push.clearPushToken(error -> {
            if (error != null) {
                call.reject(error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void getPushToken(PluginCall call) {
        String pushToken = push.getPushToken();
        JSObject ret = new JSObject();
        ret.put("pushToken", pushToken != null ? pushToken : "");
        call.resolve(ret);
    }
}
