## Capacitor Plugin for SAP Emarsys

> **⚠ Disclaimer**
> This is an internal LIF (Learning and Innovation Friday) project and is **not a supported SAP Emarsys product**. It is not intended for production use by customers. SAP Emarsys assumes no responsibility for any issues arising from its use. Customers may use this project as a **reference implementation** for building their own Capacitor integration with the Emarsys Mobile SDK.

The Capacitor Plugin for SAP Emarsys is a **LIF (Learning and Innovation Friday)** project to help integrate the SAP Emarsys Mobile SDK into Capacitor applications.

---

## Status

This plugin is under active development. The table below compares current implementation status against the [React Native Emarsys SDK](https://github.com/emartech/react-native-emarsys-sdk).

| Feature | iOS | Android | Notes |
|---|---|---|---|
| **Contact Management** | | | |
| `setContact` | ✅ | ✅ | |
| `clearContact` | ✅ | ✅ | |
| **Push** | | | |
| `setPushToken` | ✅ | ✅ | |
| `clearPushToken` | ✅ | ✅ | |
| `getPushToken` | ✅ | ✅ | |
| `notificationEventHandler` | ⚠️ | ⚠️ | Native handler wired; Capacitor bridge not yet implemented. Can be used natively — see Known Issues. |
| `silentMessageEventHandler` | ⚠️ | ⚠️ | Native handler wired; Capacitor bridge not yet implemented. Can be used natively — see Known Issues. |
| **Event Tracking** | | | |
| `trackCustomEvent` | ✅ | ✅ | |
| **In-App Messaging** | | | |
| `pause` | ❌ | ❌ | To be confirmed |
| `resume` | ❌ | ❌ | To be confirmed |
| `loadInlineInApp` | ❌ | ❌ | To be confirmed |
| `inApp.eventHandler` | ⚠️ | ⚠️ | Native handler wired; Capacitor bridge not yet implemented. Can be used natively — see Known Issues. |
| `onEventAction.eventHandler` | ⚠️ | ⚠️ | Native handler wired; Capacitor bridge not yet implemented. Can be used natively — see Known Issues. |
| **Predict** | | | |
| `trackPurchase` | ❌ | ❌ | To be confirmed |
| `trackItemView` | ❌ | ❌ | To be confirmed |
| `trackCategoryView` | ❌ | ❌ | To be confirmed |
| `trackSearchTerm` | ❌ | ❌ | To be confirmed |
| `trackTag` | ❌ | ❌ | To be confirmed |
| `recommendProducts` | ❌ | ❌ | To be confirmed |
| `trackRecommendationClick` | ❌ | ❌ | To be confirmed |
| **Inbox** | | | |
| `fetchMessages` | ❌ | ❌ | To be confirmed |
| `addTag` / `removeTag` | ❌ | ❌ | To be confirmed |
| **Geofencing** | | | |
| `enable` / `disable` | ❌ | ❌ | To be confirmed |
| `isEnabled` | ❌ | ❌ | To be confirmed |
| `getRegisteredGeofences` | ❌ | ❌ | To be confirmed |
| `geofence.eventHandler` | ⚠️ | ⚠️ | Native handler wired; Capacitor bridge not yet implemented. Can be used natively — see Known Issues. |
| **Configuration** | | | |
| `changeApplicationCode` | ❌ | ❌ | To be confirmed |
| `changeMerchantId` | ❌ | ❌ | To be confirmed |
| `getSdkVersion` etc. | ❌ | ❌ | To be confirmed |
| **Deep Linking** | | | |
| `trackDeepLink` | ❌ | ❌ | To be confirmed |

### Known Issues

- **Event handler bridge** — the following native SDK event handlers are wired on the native side but the bridge to forward events into the Capacitor JavaScript layer is not yet implemented. They can be used natively by implementing a custom Capacitor plugin bridge:
  - `Emarsys.push.notificationEventHandler`
  - `Emarsys.push.silentMessageEventHandler`
  - `Emarsys.inApp.eventHandler`
  - `Emarsys.onEventAction.eventHandler`
  - `Emarsys.geofence.eventHandler`

---

## Installation

```bash
$ npm install "git+ssh://git@github.com/emartech/capacitor-emarsys-plugin.git#<version>" --save
npx cap sync
```

---

## Setup

### iOS

Add the SDK setup to `didFinishLaunchingWithOptions` in your `AppDelegate.swift`:

```swift
import EmarsysSDK

func application(_ application: UIApplication,
didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let config = EMSConfig.make { builder in
        builder.setMobileEngageApplicationCode("<APPLICATION_CODE>")
    }
    Emarsys.setup(config: config)

    UNUserNotificationCenter.current().delegate = Emarsys.push

    Emarsys.push.notificationEventHandler = { name, payload in
        // handle push notification event
    }
    Emarsys.push.silentMessageEventHandler = { name, payload in
        // handle silent message event
    }
    Emarsys.inApp.eventHandler = { name, payload in
        // handle in-app event
    }
    Emarsys.onEventAction.eventHandler = { name, payload in
        // handle on event action
    }
    Emarsys.geofence.eventHandler = { name, payload in
        // handle geofence event
    }

    return true
}
```

Set `handleApplicationNotifications` to `false` in `capacitor.config.json` so the Emarsys SDK handles push notifications directly:

```json
{
  "ios": {
    "handleApplicationNotifications": false
  }
}
```

### Android

Follow [Google's instructions](https://firebase.google.com/docs/android/setup) to set up Firebase and copy `google-services.json` to `android/app/`.

Add the Emarsys dependencies to `android/app/build.gradle`:

```gradle
implementation 'com.emarsys:emarsys-sdk:<version>'
implementation 'com.emarsys:emarsys-firebase:<version>'
```

Register `EmarsysFirebaseMessagingService` in `AndroidManifest.xml` to handle push tokens and notification opens automatically:

```xml
<service
    android:name="com.emarsys.service.EmarsysFirebaseMessagingService"
    android:exported="false">
    <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
    </intent-filter>
</service>
```

Initialize the SDK in `MainApplication.java`:

```java
import com.emarsys.Emarsys;
import com.emarsys.config.EmarsysConfig;

public void onCreate() {
    super.onCreate();

    EmarsysConfig config = new EmarsysConfig.Builder()
            .application(this)
            .applicationCode("<APPLICATION_CODE>")
            .build();
    Emarsys.setup(config);

    Emarsys.getPush().setNotificationEventHandler((context, name, payload) -> { /* handle */ });
    Emarsys.getPush().setSilentMessageEventHandler((context, name, payload) -> { /* handle */ });
    Emarsys.getInApp().setEventHandler((context, name, payload) -> { /* handle */ });
    Emarsys.getOnEventAction().setOnEventActionEventHandler((context, name, payload) -> { /* handle */ });
    Emarsys.getGeofence().setEventHandler((context, name, payload) -> { /* handle */ });
}
```

---

## Usage

```typescript
import { Plugins } from '@capacitor/core';
const { Emarsys } = Plugins;

// Contact
await Emarsys.setContact({ contactFieldId: 3, contactFieldValue: 'user@example.com' });
await Emarsys.clearContact();

// Push
await Emarsys.setPushToken({ pushToken: '<token>' });
await Emarsys.clearPushToken();
const { pushToken } = await Emarsys.getPushToken();

// Event Tracking
await Emarsys.trackCustomEvent({ eventName: 'my_event', eventAttributes: { key: 'value' } });
```
