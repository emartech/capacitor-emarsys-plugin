package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;
import com.emarsys.mobileengage.api.event.EventHandler;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "Emarsys")
public class EmarsysPlugin extends Plugin {

    private static final String EVENT_NAME = "emarsysEventHandler";

    private EmarsysCore implementation = new EmarsysCore();
    private EmarsysPush push = new EmarsysPush();
    private EmarsysInApp inApp = new EmarsysInApp();

    // Event bus

    /**
     * Called by the Capacitor bridge when the plugin is loaded (after the app's
     * {@code Emarsys.setup}).
     */
    @Override
    public void load() {
        EventHandler handler = (context, eventName, payload) -> forward(eventName, payload);
        Emarsys.getPush().setNotificationEventHandler(handler);
        Emarsys.getPush().setSilentMessageEventHandler(handler);
        Emarsys.getInApp().setEventHandler(handler);
        Emarsys.getOnEventAction().setOnEventActionEventHandler(handler);
        Emarsys.getGeofence().setEventHandler(handler);
    }

    private void forward(String eventName, JSONObject payload) {
        JSObject data = new JSObject();
        data.put("eventName", eventName);
        if (payload != null) {
            try {
                data.put("payload", JSObject.fromJSONObject(payload));
            } catch (JSONException e) {
                data.put("payload", new JSObject());
            }
        } else {
            data.put("payload", new JSObject());
        }
        notifyListeners(EVENT_NAME, data, true);
    }

    // Contact

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

        implementation.setContact(contactFieldId, contactFieldValue, (error) -> {
            if (error != null) {
                call.reject("Set contact error", error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void clearContact(PluginCall call) {
        implementation.clearContact((error) -> {
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

        implementation.trackCustomEvent(eventName, eventAttributes, (error) -> {
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

        push.setPushToken(pushToken, (error) -> {
            if (error != null) {
                call.reject(error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void clearPushToken(PluginCall call) {
        push.clearPushToken((error) -> {
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

    // InApp

    @PluginMethod
    public void pauseInApp(PluginCall call) {
        inApp.pause();
        call.resolve();
    }

    @PluginMethod
    public void resumeInApp(PluginCall call) {
        inApp.resume();
        call.resolve();
    }

    @PluginMethod
    public void isInAppPaused(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isPaused", inApp.isPaused());
        call.resolve(ret);
    }
}
