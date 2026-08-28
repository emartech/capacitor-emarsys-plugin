package com.emarsys.plugin.emarsys;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Emarsys")
public class EmarsysPlugin extends Plugin {

    private EmarsysCore implementation = new EmarsysCore();

    @PluginMethod
    public void setContact(PluginCall call) {
        Integer contactFieldId = call.getInt("contactFieldId");
        String contactFieldValue = call.getString("contactFieldValue");

        if (contactFieldId == null || contactFieldValue == null) {
            call.reject("contactFieldId and contactFieldValue are required");
            return;
        }

        implementation.setContact(contactFieldId, contactFieldValue, error -> {
            if (error != null) {
                call.reject(error.getMessage());
            } else {
                call.resolve();
            }
        });
    }
}
