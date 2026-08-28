package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;
import java.util.Map;

public class EmarsysCore {

    public void setContact(int contactFieldId, String contactFieldValue, EmarsysCompletionListener listener) {
        Emarsys.setContact(contactFieldId, contactFieldValue, (error) -> listener.onComplete(error));
    }

    public void clearContact(EmarsysCompletionListener listener) {
        Emarsys.clearContact((error) -> listener.onComplete(error));
    }

    public void trackCustomEvent(String eventName, Map<String, String> eventAttributes, EmarsysCompletionListener listener) {
        Emarsys.trackCustomEvent(eventName, eventAttributes, (error) -> listener.onComplete(error));
    }
}
