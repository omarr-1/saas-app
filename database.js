const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

class DatabaseService {
  constructor() {
    const userDataPath = app.getPath('userData');
    this.dbPath = path.join(userDataPath, 'finances.sqlite');
    this.initializeDatabase();
  }

  initializeDatabase() {
    try {
      // Ensure the directory exists
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      this.db = new Database(this.dbPath);

      // Create tables
      this.db.exec(`
        -- Todos table
        CREATE TABLE IF NOT EXISTS todos (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          completed BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Accounts table
        CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Categories table
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- Transactions table
        CREATE TABLE IF NOT EXISTS transactions (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          payee TEXT,
          amount REAL NOT NULL,
          account_id TEXT NOT NULL,
          category_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (account_id) REFERENCES accounts(id),
          FOREIGN KEY (category_id) REFERENCES categories(id)
        );
      `);
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // Todo operations
  getTodos() {
    try {
      return this.db.prepare('SELECT * FROM todos ORDER BY created_at DESC').all();
    } catch (error) {
      console.error('Error getting todos:', error);
      return [];
    }
  }

  getTodo(id) {
    try {
      return this.db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    } catch (error) {
      console.error('Error getting todo:', error);
      return null;
    }
  }

  createTodo(todo) {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO todos (id, title, completed) VALUES (?, ?, ?)'
      );
      return stmt.run(todo.id, todo.title, todo.completed ? 1 : 0);
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  updateTodo(id, updates) {
    try {
      const stmt = this.db.prepare(
        'UPDATE todos SET title = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );
      return stmt.run(updates.title, updates.completed ? 1 : 0, id);
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  deleteTodo(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM todos WHERE id = ?');
      return stmt.run(id);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }

  // Account operations
  getAccounts() {
    try {
      return this.db.prepare('SELECT * FROM accounts ORDER BY name').all();
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  }

  getAccount(id) {
    try {
      return this.db.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
    } catch (error) {
      console.error('Error getting account:', error);
      return null;
    }
  }

  createAccount(account) {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO accounts (id, name) VALUES (?, ?)'
      );
      return stmt.run(account.id, account.name);
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  updateAccount(id, updates) {
    try {
      const stmt = this.db.prepare(
        'UPDATE accounts SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );
      return stmt.run(updates.name, id);
    } catch (error) {
      console.error('Error updating account:', error);
      throw error;
    }
  }

  deleteAccount(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM accounts WHERE id = ?');
      return stmt.run(id);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Category operations
  getCategories() {
    try {
      return this.db.prepare('SELECT * FROM categories ORDER BY name').all();
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  }

  getCategory(id) {
    try {
      return this.db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    } catch (error) {
      console.error('Error getting category:', error);
      return null;
    }
  }

  createCategory(category) {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO categories (id, name) VALUES (?, ?)'
      );
      return stmt.run(category.id, category.name);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  updateCategory(id, updates) {
    try {
      const stmt = this.db.prepare(
        'UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      );
      return stmt.run(updates.name, id);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  deleteCategory(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM categories WHERE id = ?');
      return stmt.run(id);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Transaction operations
  getTransactions() {
    try {
      return this.db.prepare(`
        SELECT 
          t.*, 
          a.name as account, 
          c.name as category,
          t.account_id as accountId,
          t.category_id as categoryId
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        LEFT JOIN categories c ON t.category_id = c.id
        ORDER BY t.date DESC
      `).all();
    } catch (error) {
      console.error('Error getting transactions:', error);
      return [];
    }
  }

  getTransaction(id) {
    try {
      return this.db.prepare(`
        SELECT 
          t.*, 
          a.name as account, 
          c.name as category,
          t.account_id as accountId,
          t.category_id as categoryId
        FROM transactions t
        JOIN accounts a ON t.account_id = a.id
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.id = ?
      `).get(id);
    } catch (error) {
      console.error('Error getting transaction:', error);
      return null;
    }
  }

  createTransaction(transaction) {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO transactions (id, date, payee, amount, account_id, category_id) VALUES (?, ?, ?, ?, ?, ?)'
      );
      return stmt.run(
        transaction.id,
        transaction.date,
        transaction.payee,
        transaction.amount,
        transaction.accountId,
        transaction.categoryId
      );
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  createTransactions(transactions) {
    try {
      const stmt = this.db.prepare(
        'INSERT INTO transactions (id, date, payee, amount, account_id, category_id) VALUES (?, ?, ?, ?, ?, ?)'
      );
      
      const insertMany = this.db.transaction((transactionsArray) => {
        for (const tr of transactionsArray) {
          stmt.run(
            tr.id, 
            tr.date, 
            tr.payee, 
            tr.amount, 
            tr.accountId, 
            tr.categoryId
          );
        }
      });
      
      insertMany(transactions);
      return { success: true };
    } catch (error) {
      console.error('Error creating transactions:', error);
      throw error;
    }
  }

  updateTransaction(id, updates) {
    try {
      const stmt = this.db.prepare(`
        UPDATE transactions 
        SET date = ?, 
            payee = ?, 
            amount = ?, 
            account_id = ?, 
            category_id = ?, 
            updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      return stmt.run(
        updates.date,
        updates.payee,
        updates.amount,
        updates.accountId,
        updates.categoryId,
        id
      );
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
  }

  deleteTransaction(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM transactions WHERE id = ?');
      return stmt.run(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = DatabaseService; 