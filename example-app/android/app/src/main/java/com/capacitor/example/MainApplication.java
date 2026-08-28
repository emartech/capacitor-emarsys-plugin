package com.capacitor.example;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.emarsys.Emarsys;
import com.emarsys.config.EmarsysConfig;
import com.emarsys.mobileengage.api.event.EventHandler;

import org.json.JSONObject;

public class MainApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        createNotificationChannels();

        EmarsysConfig config = new EmarsysConfig.Builder()
                .application(this)
                .applicationCode("EMS08-CD6F6")
                .enableVerboseConsoleLogging()
                .build();

        Emarsys.setup(config);

        Emarsys.getPush().setNotificationEventHandler((context, name, payload) ->
                Log.i("EMARSYS", "Push notification: " + name));
        Emarsys.getPush().setSilentMessageEventHandler((context, name, payload) ->
                Log.i("EMARSYS", "Silent message: " + name));
        Emarsys.getInApp().setEventHandler((context, name, payload) ->
                Log.i("EMARSYS", "In-app event: " + name));
        Emarsys.getOnEventAction().setOnEventActionEventHandler((context, name, payload) ->
                Log.i("EMARSYS", "On event action: " + name));
        Emarsys.getGeofence().setEventHandler((context, name, payload) ->
                Log.i("EMARSYS", "Geofence event: " + name));
    }

    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel(
                    "ems_sample_messages",
                    "Messages",
                    "Important messages go into this channel",
                    NotificationManager.IMPORTANCE_HIGH
            );
            createNotificationChannel(
                    "ems_sample_news",
                    "News",
                    "Important messages go into this channel",
                    NotificationManager.IMPORTANCE_HIGH
            );
        }
    }

    private void createNotificationChannel(String id, String name, String description, int importance) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            NotificationChannel channel = new NotificationChannel(id, name, importance);
            channel.setDescription(description);
            manager.createNotificationChannel(channel);
        }
    }
}
