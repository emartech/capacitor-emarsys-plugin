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
| `setContact` | ✅ | ✅ | `Emarsys.setContact()` |
| `clearContact` | ✅ | ✅ | `Emarsys.clearContact()` |
| **Push** | | | |
| `setPushToken` | ✅ | ✅ | `Emarsys.push.setPushToken()` |
| `clearPushToken` | ✅ | ✅ | `Emarsys.push.clearPushToken()` |
| `getPushToken` | ✅ | ✅ | `Emarsys.push.getPushToken()` |
| `notificationEventHandler` | ✅ | ✅ | Forwarded to JS via `Emarsys.addEventListener` |
| `silentMessageEventHandler` | ✅ | ✅ | Forwarded to JS via `Emarsys.addEventListener` |
| **Event Tracking** | | | |
| `trackCustomEvent` | ✅ | ✅ | `Emarsys.trackCustomEvent()` |
| **In-App Messaging** | | | |
| `pause` | ✅ | ✅ | `Emarsys.inApp.pause()` |
| `resume` | ✅ | ✅ | `Emarsys.inApp.resume()` |
| `isPaused` | ✅ | ✅ | `Emarsys.inApp.isPaused()` |
| `loadInlineInApp` | ❌ | ❌ | To be confirmed |
| `inApp.eventHandler` | ✅ | ✅ | Forwarded to JS via `Emarsys.addEventListener` |
| `onEventAction.eventHandler` | ✅ | ✅ | Forwarded to JS via `Emarsys.addEventListener` |
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
| `geofence.eventHandler` | ✅ | ✅ | Forwarded to JS via `Emarsys.addEventListener` |
| **Configuration** | | | |
| `changeApplicationCode` | ✅ | ✅ | `Emarsys.config.changeApplicationCode()` |
| `changeMerchantId` | ✅ | ✅ | `Emarsys.config.changeMerchantId()` |
| `getApplicationCode` | ✅ | ✅ | `Emarsys.config.getApplicationCode()` |
| `getMerchantId` | ✅ | ✅ | `Emarsys.config.getMerchantId()` |
| `getClientId` | ✅ | ✅ | `Emarsys.config.getClientId()` |
| `getLanguageCode` | ✅ | ✅ | `Emarsys.config.getLanguageCode()` |
| `getSdkVersion` | ✅ | ✅ | `Emarsys.config.getSdkVersion()` |
| **Deep Linking** | | | |
| `trackDeepLink` | ❌ | ❌ | To be confirmed |

### Known Issues

- None currently.

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
}
```

---

## Usage

```typescript
import { Emarsys } from 'capacitor-emarsys-plugin';

// Contact
await Emarsys.setContact({ contactFieldId: 123456, contactFieldValue: 'f7e3a2b9' });
await Emarsys.clearContact();

// Push
await Emarsys.push.setPushToken('<token>');
await Emarsys.push.clearPushToken();
const pushToken = await Emarsys.push.getPushToken();

// Event Tracking
await Emarsys.trackCustomEvent({ eventName: 'my_event', eventAttributes: { key: 'value' } });

// In-App
await Emarsys.inApp.pause();
await Emarsys.inApp.resume();
const paused = await Emarsys.inApp.isPaused();

// Config
await Emarsys.config.changeApplicationCode('<APPLICATION_CODE>');
await Emarsys.config.changeMerchantId('<MERCHANT_ID>');
const appCode = await Emarsys.config.getApplicationCode();
const sdkVersion = await Emarsys.config.getSdkVersion();
const languageCode = await Emarsys.config.getLanguageCode();
const clientId = await Emarsys.config.getClientId();
```

### Events

On **both iOS and Android**, all Emarsys native event handlers (push notification opened, silent
message, in-app, onEventAction, geofence) are automatically forwarded to the JavaScript layer.
Subscribe once — ideally early at app bootstrap so no events fired before the listener attaches are
missed (Capacitor buffers and replays them on the first subscription):

```typescript
import { Emarsys } from 'capacitor-emarsys-plugin';
import type { EmarsysEvent } from 'capacitor-emarsys-plugin';

const handle = await Emarsys.addEventListener((event: EmarsysEvent) => {
  // event.eventName: the Emarsys app-event name
  // event.payload: the raw Emarsys payload
  console.log('Emarsys event', event.eventName, event.payload);
});
```

