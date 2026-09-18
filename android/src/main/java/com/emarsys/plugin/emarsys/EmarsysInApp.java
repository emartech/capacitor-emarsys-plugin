package com.emarsys.plugin.emarsys;

import android.view.ViewGroup;
import androidx.coordinatorlayout.widget.CoordinatorLayout;
import com.emarsys.Emarsys;
import com.emarsys.inapp.ui.InlineInAppView;
import java.util.HashMap;
import java.util.Map;
import kotlin.Unit;

public class EmarsysInApp {

    public interface InlineEventCallback {
        void emit(String viewRef, String type, org.json.JSONObject data);
    }

    private final Map<String, InlineInAppView> inlineViews = new HashMap<>();
    private final java.util.Set<String> loadedViews = new java.util.HashSet<>();
    private InlineEventCallback inlineEventCallback;

    public void pause() {
        Emarsys.getInApp().pause();
    }

    public void resume() {
        Emarsys.getInApp().resume();
    }

    public boolean isPaused() {
        return Emarsys.getInApp().isPaused();
    }

    public void setInlineEventCallback(InlineEventCallback callback) {
        this.inlineEventCallback = callback;
    }

    public void loadInline(String viewRef, String viewId, ViewGroup parent, InlineFrame frame, Integer zIndex) {
        InlineInAppView view = inlineViews.get(viewRef);
        boolean isNew = view == null;
        if (isNew) {
            view = new InlineInAppView(parent.getContext(), ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
            wireListeners(view, viewRef);
            inlineViews.put(viewRef, view);
            parent.addView(view, makeParams(parent, 0, 0));
        }
        applyFrame(view, parent, frame, zIndex);
        if ((isNew || !loadedViews.contains(viewRef)) && frame.width > 0 && frame.height > 0) {
            loadedViews.add(viewRef);
            view.loadInApp(viewId);
        }
    }

    private void wireListeners(InlineInAppView view, String viewRef) {
        view.setOnAppEventListener((property, json) -> {
            org.json.JSONObject data = new org.json.JSONObject();
            try {
                data.put("name", property);
                data.put("payload", json != null ? json : new org.json.JSONObject());
            } catch (org.json.JSONException ignored) {}
            emit(viewRef, "appEvent", data);
            return Unit.INSTANCE;
        });
        view.setOnCompletionListener((errorCause) -> {
            org.json.JSONObject data = new org.json.JSONObject();
            try {
                data.put("error", errorCause != null ? errorCause.getLocalizedMessage() : org.json.JSONObject.NULL);
            } catch (org.json.JSONException ignored) {}
            emit(viewRef, "completion", data);
        });
        view.setOnCloseListener(() -> {
            emit(viewRef, "close", new org.json.JSONObject());
            return Unit.INSTANCE;
        });
    }

    private void applyFrame(InlineInAppView view, ViewGroup parent, InlineFrame frame, Integer zIndex) {
        view.setLayoutParams(makeParams(parent, frame.width, frame.height));
        view.setX(frame.x);
        view.setY(frame.y);
        if (zIndex != null) {
            view.setElevation(zIndex);
            view.bringToFront();
        }
    }

    private ViewGroup.LayoutParams makeParams(ViewGroup parent, int width, int height) {
        if (parent instanceof CoordinatorLayout) {
            CoordinatorLayout.LayoutParams p = new CoordinatorLayout.LayoutParams(width, height);
            return p;
        }
        return new ViewGroup.LayoutParams(width, height);
    }

    private void emit(String viewRef, String type, org.json.JSONObject data) {
        if (inlineEventCallback != null) {
            inlineEventCallback.emit(viewRef, type, data);
        }
    }

    public static class InlineFrame {

        public final int x;
        public final int y;
        public final int width;
        public final int height;

        public InlineFrame(int x, int y, int width, int height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }
}
