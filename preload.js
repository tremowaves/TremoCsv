const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFolderDialog: () => ipcRenderer.invoke('open-folder-dialog'),
  processFiles: (options) => ipcRenderer.invoke('process-files', options)
}); 