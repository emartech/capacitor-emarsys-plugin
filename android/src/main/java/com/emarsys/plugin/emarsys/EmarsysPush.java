package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;

public class EmarsysPush {

    public void setPushToken(String pushToken, EmarsysCompletionListener listener) {
        Emarsys.getPush().setPushToken(pushToken, (error) -> listener.onComplete(error));
    }

    public void clearPushToken(EmarsysCompletionListener listener) {
        Emarsys.getPush().clearPushToken((error) -> listener.onComplete(error));
    }

    public String getPushToken() {
        return Emarsys.getPush().getPushToken();
    }
}
