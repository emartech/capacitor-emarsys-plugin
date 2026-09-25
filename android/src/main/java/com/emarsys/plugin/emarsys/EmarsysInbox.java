package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;
import com.emarsys.core.api.result.CompletionListener;
import com.emarsys.mobileengage.api.inbox.InboxResult;
import com.emarsys.plugin.emarsys.utils.mappers.MessageMapper;
import java.util.Collections;
import org.json.JSONArray;

public class EmarsysInbox {

    public interface InboxResultListener {
        void onResult(JSONArray messages, Throwable error);
    }

    public void fetchMessages(InboxResultListener listener) {
        Emarsys.getMessageInbox().fetchMessages((result) -> {
            if (result.getErrorCause() != null) {
                listener.onResult(null, result.getErrorCause());
            } else {
                InboxResult inboxResult = result.getResult();
                JSONArray messages = MessageMapper.mapMessages(inboxResult != null ? inboxResult.getMessages() : Collections.emptyList());
                listener.onResult(messages, null);
            }
        });
    }

    public void addTag(String tag, String messageId, EmarsysCompletionListener listener) {
        CompletionListener completionListener = (error) -> listener.onComplete(error);
        Emarsys.getMessageInbox().addTag(tag, messageId, completionListener);
    }

    public void removeTag(String tag, String messageId, EmarsysCompletionListener listener) {
        CompletionListener completionListener = (error) -> listener.onComplete(error);
        Emarsys.getMessageInbox().removeTag(tag, messageId, completionListener);
    }
}
