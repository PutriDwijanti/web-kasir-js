const db = require('../config/db');

const Pelanggan = {
  getAll: (callback) => {
    db.query('SELECT * FROM pelanggan', callback);
  },
  getById: (id, callback) => {
    db.query('SELECT * FROM pelanggan WHERE pelangganid = ?', [id], callback);
  },
  create: (data, callback) => {
    db.query('INSERT INTO pelanggan SET ?', data, callback);
  },
  update: (id, data, callback) => {
    db.query('UPDATE pelanggan SET namapelanggan = ?, alamat = ?, nomortelepon = ? WHERE pelangganid = ?', 
      [data.namapelanggan, data.alamat, data.nomortelepon, id], callback);
  },
  delete: (id, callback) => {
    db.query('DELETE FROM pelanggan WHERE pelangganid = ?', [id], callback);
  },
};

module.exports = Pelanggan;
