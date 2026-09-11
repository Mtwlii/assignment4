const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// CREATE — POST /suppliers
router.post('/suppliers', async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    const [result] = await pool.query(
      'INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES (?, ?)',
      [SupplierName, ContactNumber]
    );

    res.status(201).json({ message: 'Supplier created successfully.', SupplierID: result.insertId });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ ALL — GET /suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Suppliers');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE — PUT /suppliers/:id
router.put('/suppliers/:id', async (req, res) => {
  try {
    const { SupplierName, ContactNumber } = req.body;

    const [result] = await pool.query(
      'UPDATE Suppliers SET SupplierName = ?, ContactNumber = ? WHERE SupplierID = ?',
      [SupplierName, ContactNumber, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    res.status(200).json({ message: 'Supplier updated successfully.' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE — DELETE /suppliers/:id
router.delete('/suppliers/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Suppliers WHERE SupplierID = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Supplier not found.' });
    }

    res.status(200).json({ message: 'Supplier deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
