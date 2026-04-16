const db = require('../config/db'); 

const produkModel = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM produk';
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM produk WHERE produkid = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results); 
    });
  },

  create: (data, callback) => {
    const sql = 'INSERT INTO produk (namaproduk, harga, stok) VALUES (?, ?, ?)';
    const params = [data.nama, data.harga, data.stock];
    db.query(sql, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

update: (data, callback) => {
  const sql = `
    UPDATE produk 
    SET namaproduk = ?, harga = ?, stok = ?
    WHERE produkid = ?
  `;
  const params = [data.namaproduk, data.harga, data.stok, data.produkid];
  db.query(sql, params, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
},


  hapus: (id, callback) => {
    const sql = 'DELETE FROM produk WHERE produkid = ?';
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  }
};

module.exports = produkModel;
