const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const DatabaseService = require('./database');

let mainWindow;
let db;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Initialize database
  db = new DatabaseService();
  
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    if (db) {
      db.close();
    }
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('get-app-path', () => {
  return app.getPath('userData');
});

// Data operations
ipcMain.handle('save-data', async (event, { key, value }) => {
  try {
    // Handle different types of data
    switch (key) {
      case 'todo':
        if (value.id) {
          return await db.updateTodo(value.id, value);
        }
        const id = Math.random().toString(36).substr(2, 9);
        await db.createTodo({ ...value, id });
        return id;

      case 'todos':
        if (value.ids && Array.isArray(value.ids)) {
          // Batch delete todos
          for (const id of value.ids) {
            await db.deleteTodo(id);
          }
          return true;
        }
        return false;

      case 'account':
        if (value.id) {
          return await db.updateAccount(value.id, value);
        }
        return await db.createAccount(value);
      
      case 'accounts':
        if (value.ids && Array.isArray(value.ids)) {
          // Batch delete accounts
          for (const id of value.ids) {
            await db.deleteAccount(id);
          }
          return true;
        }
        return false;
      
      case 'category':
        if (value.id) {
          return await db.updateCategory(value.id, value);
        }
        return await db.createCategory(value);
      
      case 'categories':
        if (value.ids && Array.isArray(value.ids)) {
          // Batch delete categories
          for (const id of value.ids) {
            await db.deleteCategory(id);
          }
          return true;
        }
        return false;
      
      case 'transaction':
        if (value.id) {
          return await db.updateTransaction(value.id, value);
        }
        return await db.createTransaction(value);
        
      case 'transactions':
        if (value.ids && Array.isArray(value.ids)) {
          // Batch delete transactions
          for (const id of value.ids) {
            await db.deleteTransaction(id);
          }
          return true;
        } else if (Array.isArray(value)) {
          // Batch create transactions
          return await db.createTransactions(value);
        }
        return false;
      
      default:
        console.error('Unknown data key:', key);
        return false;
    }
  } catch (error) {
    console.error('Error saving data:', error);
    return false;
  }
});

ipcMain.handle('get-data', async (event, { key, id }) => {
  try {
    switch (key) {
      case 'todos':
        return await db.getTodos();
        
      case 'todo':
        return await db.getTodo(id);

      case 'account':
        return await db.getAccount(id);
      
      case 'accounts':
        return await db.getAccounts();
      
      case 'category':
        return await db.getCategory(id);
      
      case 'categories':
        return await db.getCategories();
      
      case 'transaction':
        return await db.getTransaction(id);
      
      case 'transactions':
        return await db.getTransactions();
      
      default:
        console.error('Unknown data key:', key);
        return null;
    }
  } catch (error) {
    console.error('Error getting data:', error);
    return null;
  }
}); 