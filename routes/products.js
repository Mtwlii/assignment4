const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// CREATE — POST /products
router.post('/products', async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;

    const [result] = await pool.query(
      'INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES (?, ?, ?, ?)',
      [ProductName, Price, StockQuantity, SupplierID]
    );

    res.status(201).json({ message: 'Product created successfully.', ProductID: result.insertId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ ALL — GET /products
router.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ONE — GET /products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products WHERE ProductID = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE — PUT /products/:id
router.put('/products/:id', async (req, res) => {
  try {
    const { ProductName, Price, StockQuantity, SupplierID } = req.body;

    const [result] = await pool.query(
      'UPDATE Products SET ProductName = ?, Price = ?, StockQuantity = ?, SupplierID = ? WHERE ProductID = ?',
      [ProductName, Price, StockQuantity, SupplierID, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product updated successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — DELETE /products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Products WHERE ProductID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
