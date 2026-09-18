package com.emarsys.plugin.emarsys;

import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
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
    private static final String INLINE_EVENT_NAME = "emarsysInlineInAppHandler";

    private EmarsysCore implementation = new EmarsysCore();
    private EmarsysPush push = new EmarsysPush();
    private EmarsysInApp inApp = new EmarsysInApp();
    private EmarsysConfig config = new EmarsysConfig();
    private EmarsysGeofence geofence = new EmarsysGeofence();
    private EmarsysInbox inbox = new EmarsysInbox();

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

        inApp.setInlineEventCallback(this::forwardInline);
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

    private void forwardInline(String viewRef, String type, JSONObject payload) {
        JSObject data = new JSObject();
        data.put("viewRef", viewRef);
        data.put("type", type);
        if (payload != null) {
            Iterator<String> keys = payload.keys();
            while (keys.hasNext()) {
                String key = keys.next();
                data.put(key, payload.opt(key));
            }
        }
        notifyListeners(INLINE_EVENT_NAME, data, false);
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

    @PluginMethod
    public void loadInlineInApp(PluginCall call) {
        String viewRef = call.getString("viewRef");
        String viewId = call.getString("viewId");
        if (viewRef == null) {
            call.reject("viewRef is required");
            return;
        }
        if (viewId == null) {
            call.reject("viewId is required");
            return;
        }
        EmarsysInApp.InlineFrame frame = frameFrom(call);
        if (frame == null) {
            call.reject("frame is required");
            return;
        }
        Integer zIndex = call.getInt("zIndex");
        getActivity().runOnUiThread(() -> {
            ViewGroup parent = webViewParent();
            if (parent == null) {
                call.reject("WebView is not attached");
                return;
            }
            makeWebViewTransparent();
            inApp.loadInline(viewRef, viewId, parent, frame, zIndex);
            call.resolve();
        });
    }

    private EmarsysInApp.InlineFrame frameFrom(PluginCall call) {
        JSObject frame = call.getObject("frame");
        if (frame == null) {
            return null;
        }
        float density = getContext().getResources().getDisplayMetrics().density;
        int x = Math.round((float) frame.optDouble("x", 0) * density);
        int y = Math.round((float) frame.optDouble("y", 0) * density);
        int width = Math.round((float) frame.optDouble("width", 0) * density);
        int height = Math.round((float) frame.optDouble("height", 0) * density);

        View webView = getBridge().getWebView();
        if (webView != null) {
            int[] loc = new int[2];
            webView.getLocationInWindow(loc);
            x += loc[0];
            y += loc[1];
        }
        return new EmarsysInApp.InlineFrame(x, y, width, height);
    }

    private ViewGroup webViewParent() {
        View webView = getBridge().getWebView();
        if (webView != null && webView.getParent() instanceof ViewGroup) {
            return (ViewGroup) webView.getParent();
        }
        return getActivity().findViewById(android.R.id.content);
    }

    private void makeWebViewTransparent() {
        View webView = getBridge().getWebView();
        if (webView != null) {
            webView.setBackgroundColor(Color.TRANSPARENT);
        }
    }

    // Config

    @PluginMethod
    public void changeApplicationCode(PluginCall call) {
        String applicationCode = call.getString("applicationCode");
        if (applicationCode == null) {
            call.reject("applicationCode is required");
            return;
        }
        config.changeApplicationCode(applicationCode, (error) -> {
            if (error != null) {
                call.reject("Change application code error", error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void changeMerchantId(PluginCall call) {
        String merchantId = call.getString("merchantId");
        if (merchantId == null) {
            call.reject("merchantId is required");
            return;
        }
        config.changeMerchantId(merchantId);
        call.resolve();
    }

    @PluginMethod
    public void getApplicationCode(PluginCall call) {
        JSObject ret = new JSObject();
        String value = config.getApplicationCode();
        ret.put("applicationCode", value != null ? value : "");
        call.resolve(ret);
    }

    @PluginMethod
    public void getMerchantId(PluginCall call) {
        JSObject ret = new JSObject();
        String value = config.getMerchantId();
        ret.put("merchantId", value != null ? value : "");
        call.resolve(ret);
    }

    @PluginMethod
    public void getClientId(PluginCall call) {
        JSObject ret = new JSObject();
        String value = config.getClientId();
        ret.put("clientId", value != null ? value : "");
        call.resolve(ret);
    }

    @PluginMethod
    public void getLanguageCode(PluginCall call) {
        JSObject ret = new JSObject();
        String value = config.getLanguageCode();
        ret.put("languageCode", value != null ? value : "");
        call.resolve(ret);
    }

    @PluginMethod
    public void getSdkVersion(PluginCall call) {
        JSObject ret = new JSObject();
        String value = config.getSdkVersion();
        ret.put("sdkVersion", value != null ? value : "");
        call.resolve(ret);
    }

    // Geofence

    @PluginMethod
    public void enableGeofence(PluginCall call) {
        geofence.enable((error) -> {
            if (error != null) {
                call.reject("Enable geofence error", error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void disableGeofence(PluginCall call) {
        geofence.disable();
        call.resolve();
    }

    @PluginMethod
    public void isGeofenceEnabled(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("isEnabled", geofence.isEnabled());
        call.resolve(ret);
    }

    @PluginMethod
    public void getRegisteredGeofences(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("geofences", geofence.getRegisteredGeofences());
        call.resolve(ret);
    }

    // Inbox

    @PluginMethod
    public void fetchInboxMessages(PluginCall call) {
        inbox.fetchMessages((messages, error) -> {
            if (error != null) {
                call.reject("Fetch inbox messages error", error.getMessage());
            } else {
                JSObject ret = new JSObject();
                ret.put("messages", messages);
                call.resolve(ret);
            }
        });
    }

    @PluginMethod
    public void addInboxTag(PluginCall call) {
        String tag = call.getString("tag");
        String messageId = call.getString("messageId");
        if (tag == null) {
            call.reject("tag is required");
            return;
        }
        if (messageId == null) {
            call.reject("messageId is required");
            return;
        }
        inbox.addTag(tag, messageId, (error) -> {
            if (error != null) {
                call.reject("Add inbox tag error", error.getMessage());
            } else {
                call.resolve();
            }
        });
    }

    @PluginMethod
    public void removeInboxTag(PluginCall call) {
        String tag = call.getString("tag");
        String messageId = call.getString("messageId");
        if (tag == null) {
            call.reject("tag is required");
            return;
        }
        if (messageId == null) {
            call.reject("messageId is required");
            return;
        }
        inbox.removeTag(tag, messageId, (error) -> {
            if (error != null) {
                call.reject("Remove inbox tag error", error.getMessage());
            } else {
                call.resolve();
            }
        });
    }
}
