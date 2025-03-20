const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  saveData: (key, value) => ipcRenderer.invoke('save-data', { key, value }),
  getData: (key, id) => ipcRenderer.invoke('get-data', { key, id }),
  getTodos: () => ipcRenderer.invoke('get-data', { key: 'todos' }),
  saveTodo: (title, completed, id) => ipcRenderer.invoke('save-data', { 
    key: 'todo', 
    value: { title, completed, id } 
  }),
  deleteTodo: (id) => ipcRenderer.invoke('save-data', { 
    key: 'todos', 
    value: { ids: [id] } 
  }),
}); 