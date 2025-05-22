const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Open file dialog
  openFile: () => ipcRenderer.invoke('open-file'),

  // Open folder dialog
  openFolder: () => ipcRenderer.invoke('open-folder'),

  // Save content to a specified file
  saveFile: (filepath, content) => ipcRenderer.invoke('save-file', filepath, content),

  // Trigger a new window (e.g., pop-up or modal)
  popWindow: () => ipcRenderer.send('pop-window'),

  // Read file content from the given path
  readFile: (filepath) => ipcRenderer.invoke('read-file', filepath),

  // Listen for login status updates
  onLoginChange: (callback) =>
    ipcRenderer.on("update-login", (_event, status) => callback(status)),

  // Send code and filepath to backend (e.g., for execution or upload)
  sendFile: (code, filepath) => ipcRenderer.invoke('send-file', code, filepath),

  // Logout action
  logout: () => ipcRenderer.invoke('logout'),
});
