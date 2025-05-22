const { contextBridge, ipcRenderer } = require('electron');

// Expose secure APIs to the renderer process via contextBridge
contextBridge.exposeInMainWorld('api', {
  // Create a new user account
  create_account: (username, password) => ipcRenderer.invoke('create-account', username, password),

  // Attempt user login
  login: (username, password) => ipcRenderer.invoke('login', username, password),

  // Logout the current user
  logout: () => ipcRenderer.invoke('logout'),

  // Run submitted code or tasks
  run: (data) => ipcRenderer.invoke('run', data),

  // Notify main process of login status changes; only accepts boolean
  login_change: (success) => {
    if (typeof success === 'boolean') {
      ipcRenderer.send('login-change', success);
    } else {
      console.error('Invalid data type for success:', success);
    }
  },
  input_validation: (password) => ipcRenderer.invoke('input-validate', password),
});
