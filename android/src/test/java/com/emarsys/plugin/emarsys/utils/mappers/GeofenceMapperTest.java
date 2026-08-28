package com.emarsys.plugin.emarsys.utils.mappers;

import static org.junit.Assert.*;

import com.emarsys.mobileengage.api.geofence.Geofence;
import com.emarsys.mobileengage.api.geofence.Trigger;
import com.emarsys.mobileengage.api.geofence.TriggerType;
import java.util.Arrays;
import java.util.Collections;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;

@RunWith(RobolectricTestRunner.class)
public class GeofenceMapperTest {

    @Test
    public void testMapGeofences_withSingleGeofence() throws Exception {
        JSONObject action = new JSONObject();
        action.put("id", "testId");
        action.put("type", "MECustomEvent");
        action.put("name", "testName");

        Trigger trigger = new Trigger("testTriggerId", TriggerType.ENTER, 123, action);
        Geofence geofence = new Geofence("testGeofenceId", 12.34, 56.78, 30.0, 90.12, Collections.singletonList(trigger));

        JSONArray result = GeofenceMapper.mapGeofences(Collections.singletonList(geofence));

        assertEquals(1, result.length());

        JSONObject geo = result.getJSONObject(0);
        assertEquals("testGeofenceId", geo.getString("id"));
        assertEquals(12.34, geo.getDouble("lat"), 0.001);
        assertEquals(56.78, geo.getDouble("lon"), 0.001);
        assertEquals(30.0, geo.getDouble("radius"), 0.001);
        assertEquals(90.12, geo.getDouble("waitInterval"), 0.001);

        JSONArray triggers = geo.getJSONArray("triggers");
        assertEquals(1, triggers.length());

        JSONObject t = triggers.getJSONObject(0);
        assertEquals("testTriggerId", t.getString("id"));
        assertEquals("ENTER", t.getString("type"));
        assertEquals(123, t.getInt("loiteringDelay"));

        JSONObject resultAction = t.getJSONObject("action");
        assertEquals("testId", resultAction.getString("id"));
        assertEquals("MECustomEvent", resultAction.getString("type"));
        assertEquals("testName", resultAction.getString("name"));
    }

    @Test
    public void testMapGeofences_withEmptyTriggerAction() throws Exception {
        Trigger trigger = new Trigger("testTriggerId2", TriggerType.EXIT, 456, new JSONObject());
        Geofence geofence = new Geofence("testGeofenceId2", 12.34, 56.78, 30.0, 90.12, Collections.singletonList(trigger));

        JSONArray result = GeofenceMapper.mapGeofences(Collections.singletonList(geofence));

        JSONObject geo = result.getJSONObject(0);
        JSONArray triggers = geo.getJSONArray("triggers");
        JSONObject action = triggers.getJSONObject(0).getJSONObject("action");
        assertEquals(0, action.length());
    }

    @Test
    public void testMapGeofences_withNullWaitInterval() throws Exception {
        Trigger trigger = new Trigger("t1", TriggerType.ENTER, 0, new JSONObject());
        Geofence geofence = new Geofence("geo1", 1.0, 2.0, 50.0, null, Collections.singletonList(trigger));

        JSONArray result = GeofenceMapper.mapGeofences(Collections.singletonList(geofence));

        JSONObject geo = result.getJSONObject(0);
        assertFalse(geo.has("waitInterval"));
    }

    @Test
    public void testMapGeofences_emptyList() {
        JSONArray result = GeofenceMapper.mapGeofences(Collections.emptyList());
        assertEquals(0, result.length());
    }

    @Test
    public void testMapGeofences_triggerTypeNames() throws Exception {
        Trigger enterTrigger = new Trigger("t1", TriggerType.ENTER, 0, new JSONObject());
        Trigger exitTrigger = new Trigger("t2", TriggerType.EXIT, 0, new JSONObject());
        Trigger dwellingTrigger = new Trigger("t3", TriggerType.DWELLING, 0, new JSONObject());

        Geofence geofence = new Geofence("geo1", 0, 0, 10.0, null, Arrays.asList(enterTrigger, exitTrigger, dwellingTrigger));

        JSONArray result = GeofenceMapper.mapGeofences(Collections.singletonList(geofence));
        JSONArray triggers = result.getJSONObject(0).getJSONArray("triggers");

        assertEquals("ENTER", triggers.getJSONObject(0).getString("type"));
        assertEquals("EXIT", triggers.getJSONObject(1).getString("type"));
        assertEquals("DWELLING", triggers.getJSONObject(2).getString("type"));
    }
}
