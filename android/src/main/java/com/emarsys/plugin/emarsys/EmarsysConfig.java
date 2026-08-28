package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;

public class EmarsysConfig {

    public void changeApplicationCode(String applicationCode, EmarsysCompletionListener listener) {
        Emarsys.getConfig().changeApplicationCode(applicationCode, error -> listener.onComplete(error));
    }

    public void changeMerchantId(String merchantId) {
        Emarsys.getConfig().changeMerchantId(merchantId);
    }

    public String getApplicationCode() {
        return Emarsys.getConfig().getApplicationCode();
    }

    public String getMerchantId() {
        return Emarsys.getConfig().getMerchantId();
    }

    public String getClientId() {
        return Emarsys.getConfig().getClientId();
    }

    public String getLanguageCode() {
        return Emarsys.getConfig().getLanguageCode();
    }

    public String getSdkVersion() {
        return Emarsys.getConfig().getSdkVersion();
    }
}
