package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;

public class EmarsysCore {

    public void setContact(int contactFieldId, String contactFieldValue, EmarsysCompletionListener listener) {
        Emarsys.setContact(contactFieldId, contactFieldValue, error -> {
            listener.onComplete(error);
        });
    }
}
