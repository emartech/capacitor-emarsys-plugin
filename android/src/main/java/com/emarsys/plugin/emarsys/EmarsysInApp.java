package com.emarsys.plugin.emarsys;

import com.emarsys.Emarsys;

public class EmarsysInApp {

    public void pause() {
        Emarsys.getInApp().pause();
    }

    public void resume() {
        Emarsys.getInApp().resume();
    }

    public boolean isPaused() {
        return Emarsys.getInApp().isPaused();
    }
}
