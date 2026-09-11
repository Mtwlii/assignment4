const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Task 5 — Schema modification endpoints

// Add a Category column to Products
router.post('/schema/add-category', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Products ADD COLUMN Category VARCHAR(100)');
    res.status(200).json({ message: 'Category column added successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Remove the Category column from Products
router.delete('/schema/remove-category', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Products DROP COLUMN Category');
    res.status(200).json({ message: 'Category column removed successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Change Suppliers.ContactNumber to VARCHAR(15)
router.put('/schema/contact-number-type', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15)');
    res.status(200).json({ message: 'ContactNumber column changed to VARCHAR(15).' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a NOT NULL constraint to Products.ProductName
router.put('/schema/productname-not-null', async (req, res) => {
  try {
    await pool.query('ALTER TABLE Products MODIFY COLUMN ProductName TEXT NOT NULL');
    res.status(200).json({ message: 'NOT NULL constraint added to ProductName.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Task 6 — Seed the required initial data
router.post('/seed', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // a) Add supplier 'FreshFoods'
    const [supplierResult] = await connection.query(
      'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)',
      ['FreshFoods', '01001234567']
    );
    const supplierId = supplierResult.insertId;

    // b) Insert the three products, all supplied by FreshFoods
    const [milkResult] = await connection.query(
      'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
      ['Milk', 15.0, 50, supplierId]
    );
    await connection.query(
      'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
      ['Bread', 10.0, 30, supplierId]
    );
    await connection.query(
      'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
      ['Eggs', 20.0, 40, supplierId]
    );

    // c) Record the sale of 2 units of Milk on 2025-05-20
    await connection.query(
      'INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)',
      [milkResult.insertId, 2, '2025-05-20']
    );

    await connection.commit();
    res.status(201).json({ message: 'Seed data inserted successfully.' });
  } catch (err) {
    await connection.rollback();
    res.status(400).json({ message: err.message });
  } finally {
    connection.release();
  }
});

// Task 7 — Update the price of 'Bread' to 25.00
router.put('/products/bread/price', async (req, res) => {
  try {
    const [result] = await pool.query(
      "UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'"
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Bread not found.' });
    }

    res.status(200).json({ message: "Bread's price updated to 25.00." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Task 8 — Delete the product 'Eggs'
router.delete('/products/eggs', async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM Products WHERE ProductName = 'Eggs'");

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Eggs not found.' });
    }

    res.status(200).json({ message: 'Eggs deleted successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
