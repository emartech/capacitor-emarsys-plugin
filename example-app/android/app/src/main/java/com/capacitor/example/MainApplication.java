package com.capacitor.example;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;

import com.emarsys.Emarsys;
import com.emarsys.config.EmarsysConfig;

public class MainApplication extends Application {

    @Override
    public void onCreate() {
        super.onCreate();

        createNotificationChannels();

        EmarsysConfig config = new EmarsysConfig.Builder()
                .application(this)
                .applicationCode("EMS9F-AF591")
                .enableVerboseConsoleLogging()
                .build();

        Emarsys.setup(config);
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
