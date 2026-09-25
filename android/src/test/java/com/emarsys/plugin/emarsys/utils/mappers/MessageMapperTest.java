package com.emarsys.plugin.emarsys.utils.mappers;

import static org.junit.Assert.*;

import com.emarsys.mobileengage.api.action.ActionModel;
import com.emarsys.mobileengage.api.action.AppEventActionModel;
import com.emarsys.mobileengage.api.action.OpenExternalUrlActionModel;
import com.emarsys.mobileengage.api.inbox.Message;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;

@RunWith(RobolectricTestRunner.class)
public class MessageMapperTest {

    @Test
    public void testMapMessages_withAppEventAction() throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("key", "value");
        AppEventActionModel action = new AppEventActionModel("actionId", "Open", "MEAppEvent", "testEvent", payload);

        Map<String, String> properties = new HashMap<>();
        properties.put("propKey", "propValue");

        Message message = new Message(
            "msgId",
            "campaignId",
            "collapseId",
            "Title",
            "Body",
            "https://example.com/image.png",
            "alt",
            1700000000000L,
            1700000001000L,
            1700000002000L,
            Arrays.asList("seen", "opened"),
            properties,
            Collections.singletonList(action)
        );

        JSONArray result = MessageMapper.mapMessages(Collections.singletonList(message));
        assertEquals(1, result.length());

        JSONObject msg = result.getJSONObject(0);
        assertEquals("msgId", msg.getString("id"));
        assertEquals("campaignId", msg.getString("campaignId"));
        assertEquals("collapseId", msg.getString("collapseId"));
        assertEquals("Title", msg.getString("title"));
        assertEquals("Body", msg.getString("body"));
        assertEquals("https://example.com/image.png", msg.getString("imageUrl"));
        assertEquals("alt", msg.getString("imageAltText"));
        assertEquals(1700000000000L, msg.getLong("receivedAt"));
        assertEquals(1700000001000L, msg.getLong("updatedAt"));
        assertEquals(1700000002000L, msg.getLong("expiresAt"));

        JSONArray tags = msg.getJSONArray("tags");
        assertEquals("seen", tags.getString(0));
        assertEquals("opened", tags.getString(1));

        JSONObject props = msg.getJSONObject("properties");
        assertEquals("propValue", props.getString("propKey"));

        JSONArray actions = msg.getJSONArray("actions");
        assertEquals(1, actions.length());
        JSONObject a = actions.getJSONObject(0);
        assertEquals("actionId", a.getString("id"));
        assertEquals("Open", a.getString("title"));
        assertEquals("MEAppEvent", a.getString("type"));
        assertEquals("testEvent", a.getString("name"));
        assertEquals("value", a.getJSONObject("payload").getString("key"));
    }

    @Test
    public void testMapMessages_withOpenExternalUrlAction() throws Exception {
        OpenExternalUrlActionModel action = new OpenExternalUrlActionModel(
            "urlActionId",
            "Visit",
            "OpenExternalUrl",
            new URL("https://example.com")
        );

        Message message = new Message(
            "msgId2",
            "campaignId2",
            null,
            "Title2",
            "Body2",
            null,
            null,
            1700000000000L,
            null,
            null,
            null,
            null,
            Collections.singletonList(action)
        );

        JSONArray result = MessageMapper.mapMessages(Collections.singletonList(message));
        JSONObject msg = result.getJSONObject(0);

        // null optionals are omitted
        assertFalse(msg.has("collapseId"));
        assertFalse(msg.has("imageUrl"));
        assertFalse(msg.has("updatedAt"));
        assertFalse(msg.has("expiresAt"));
        assertFalse(msg.has("tags"));
        assertFalse(msg.has("properties"));

        JSONObject a = msg.getJSONArray("actions").getJSONObject(0);
        assertEquals("OpenExternalUrl", a.getString("type"));
        assertEquals("https://example.com", a.getString("url"));
        assertFalse(a.has("name"));
    }

    @Test
    public void testMapMessages_withNoActions() throws Exception {
        Message message = new Message(
            "msgId3",
            "campaignId3",
            null,
            "Title3",
            "Body3",
            null,
            null,
            1700000000000L,
            null,
            null,
            null,
            null,
            null
        );

        JSONArray result = MessageMapper.mapMessages(Collections.singletonList(message));
        JSONObject msg = result.getJSONObject(0);

        assertEquals("msgId3", msg.getString("id"));
        assertFalse(msg.has("actions"));
    }

    @Test
    public void testMapMessages_emptyList() {
        JSONArray result = MessageMapper.mapMessages(Collections.emptyList());
        assertEquals(0, result.length());
    }
}
