import {
    contextBridge,
    ipcRenderer
} from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
    send: (channel: string, ...data: any[]) => {
        ipcRenderer.send(channel, ...data);
    },
    receive: (channel: string, func: Function) => {
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
    },
    receiveOnce: (channel: string, func: Function) => {
        ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
}
);