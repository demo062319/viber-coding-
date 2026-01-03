const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  saveApiKey: (apiKey) => ipcRenderer.invoke('save-api-key', apiKey),
  generateCode: (params) => ipcRenderer.invoke('generate-code', params),
  autoComplete: (params) => ipcRenderer.invoke('auto-complete', params),
  analyzeCode: (params) => ipcRenderer.invoke('analyze-code', params)
});
