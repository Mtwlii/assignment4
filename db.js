const mysql = require('mysql2/promise');


const rootPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  waitForConnections: true,
});


const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'RoutePass123!',
  database: 'store_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


async function initializeDatabase() {
  await rootPool.query('CREATE DATABASE IF NOT EXISTS store_db');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Suppliers (
      SupplierID INT AUTO_INCREMENT PRIMARY KEY,
      SupplierName TEXT,
      ContactNumber TEXT
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Products (
      ProductID INT AUTO_INCREMENT PRIMARY KEY,
      ProductName TEXT,
      Price DECIMAL(10, 2),
      StockQuantity INT,
      SupplierID INT,
      FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS Sales (
      SaleID INT AUTO_INCREMENT PRIMARY KEY,
      ProductID INT,
      QuantitySold INT,
      SaleDate DATE,
      FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    )
  `);

  console.log('Database and tables are ready.');
}

module.exports = { pool, rootPool, initializeDatabase };
