package com.emarsys.plugin.emarsys.utils.mappers;

import com.emarsys.mobileengage.api.action.ActionModel;
import com.emarsys.mobileengage.api.action.AppEventActionModel;
import com.emarsys.mobileengage.api.action.OpenExternalUrlActionModel;
import com.emarsys.mobileengage.api.inbox.Message;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class MessageMapper {

    public static JSONArray mapMessages(List<Message> messages) {
        JSONArray result = new JSONArray();
        for (Message message : messages) {
            result.put(mapMessage(message));
        }
        return result;
    }

    private static JSONObject mapMessage(Message message) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", message.getId());
            obj.put("campaignId", message.getCampaignId());
            if (message.getCollapseId() != null) {
                obj.put("collapseId", message.getCollapseId());
            }
            obj.put("title", message.getTitle());
            obj.put("body", message.getBody());
            if (message.getImageUrl() != null) {
                obj.put("imageUrl", message.getImageUrl());
            }
            if (message.getImageAltText() != null) {
                obj.put("imageAltText", message.getImageAltText());
            }
            obj.put("receivedAt", message.getReceivedAt());
            if (message.getUpdatedAt() != null) {
                obj.put("updatedAt", message.getUpdatedAt());
            }
            if (message.getExpiresAt() != null) {
                obj.put("expiresAt", message.getExpiresAt());
            }
            List<String> tags = message.getTags();
            if (tags != null) {
                obj.put("tags", new JSONArray(tags));
            }
            Map<String, String> properties = message.getProperties();
            if (properties != null) {
                obj.put("properties", new JSONObject(properties));
            }
            List<ActionModel> actions = message.getActions();
            if (actions != null) {
                JSONArray actionsArray = new JSONArray();
                for (ActionModel action : actions) {
                    actionsArray.put(mapAction(action));
                }
                obj.put("actions", actionsArray);
            }
        } catch (JSONException e) {
            // required fields are non-null; exception won't occur
        }
        return obj;
    }

    private static JSONObject mapAction(ActionModel action) {
        JSONObject obj = new JSONObject();
        try {
            obj.put("id", action.getId());
            obj.put("title", action.getTitle());
            obj.put("type", action.getType());

            if (action instanceof AppEventActionModel) {
                AppEventActionModel appEventAction = (AppEventActionModel) action;
                obj.put("name", appEventAction.getName());
                if (appEventAction.getPayload() != null) {
                    obj.put("payload", new JSONObject(appEventAction.getPayload()));
                }
            } else if (action instanceof OpenExternalUrlActionModel) {
                OpenExternalUrlActionModel externalUrlAction = (OpenExternalUrlActionModel) action;
                obj.put("url", externalUrlAction.getUrl().toString());
            }
        } catch (JSONException e) {
            // fields are non-null; exception won't occur
        }
        return obj;
    }
}
