
var gui = require("nw.gui");
var win = gui.Window.get();

var winState, currWinMode, resizeTimeout,
    isMaximizationEvent = false;

// extra height added in linux x64 gnome-shell env, use it as workaround
var deltaHeight = (function () {
    // use deltaHeight only in windows with frame enabled
    if (gui.App.manifest.window.frame) return true; else return 'disabled';
})();

function initWindowState() {
    winState = JSON.parse(localStorage.windowState || 'null');
    if (winState) {
        currWinMode = winState.mode;
        if (currWinMode === 'maximized') {
            win.maximize();
        } else {
            restoreWindowState();
        }
    } else {
        currWinMode = 'normal';
        if (deltaHeight !== 'disabled') deltaHeight = 0;
        dumpWindowState();
    }
    // uncomment if no splash screen
    // this is unecesary as splash screen will show when loaded
//    win.show();
}

function dumpWindowState() {
    if (!winState) {
        winState = {};
    }
    // we don't want to save minimized state, only maximized or normal
    if (currWinMode === 'maximized') {
        winState.mode = 'maximized';
    } else {
        winState.mode = 'normal';
    }
    // when window is maximized you want to preserve normal
    // window dimensions to restore them later (even between sessions)
    if (currWinMode === 'normal') {
        winState.x = win.x;
        winState.y = win.y;
        winState.width = win.width;
        winState.height = win.height;
        // save delta only of it is not zero
        if (deltaHeight !== 'disabled' && deltaHeight !== 0 && currWinMode !== 'maximized') {
            winState.deltaHeight = deltaHeight;
        }
    }
}

function restoreWindowState() {
    // deltaHeight already saved, so just restore it and adjust window height
    if (deltaHeight !== 'disabled' && typeof winState.deltaHeight !== 'undefined') {
        deltaHeight = winState.deltaHeight;
        winState.height = winState.height - deltaHeight;
    }
    win.resizeTo(winState.width, winState.height);
    win.moveTo(winState.x, winState.y);
}

function saveWindowState() {
    dumpWindowState();
    localStorage["windowState"] = JSON.stringify(winState);
    localStorage["screenState"] = JSON.stringify(screen);
}

initWindowState();

win.on('maximize', function () {
    isMaximizationEvent = true;
    currWinMode = 'maximized';
});

win.on('unmaximize', function () {
    currWinMode = 'normal';
    restoreWindowState();
});

win.on('minimize', function () {
    currWinMode = 'minimized';
});

win.on('restore', function () {
    currWinMode = 'normal';
});

win.window.addEventListener('resize', function () {
    // resize event is fired many times on one resize action,
    // this hack with setTimeout forces it to fire only once
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
        // on MacOS you can resize maximized window, so it's no longer maximized
        if (isMaximizationEvent) {
            // first resize after maximization event should be ignored
            isMaximizationEvent = false;
        } else {
            if (currWinMode === 'maximized') {
                currWinMode = 'normal';
            }
        }
        // there is no deltaHeight yet, calculate it and adjust window size
        if (deltaHeight !== 'disabled' && deltaHeight === false) {
            deltaHeight = win.height - winState.height;
            // set correct size
            if (deltaHeight !== 0) {
                win.resizeTo(winState.width, win.height - deltaHeight);
            }
        }
        dumpWindowState();
    }, 500);
}, false);

win.on('close', function () {
    try {
        saveWindowState();
    } catch(err) {
        console.log("winstateError: " + err);
    }
    this.close(true);
});
