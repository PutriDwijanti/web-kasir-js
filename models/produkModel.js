const db = require('../config/db');

const produkModel = {

  // GET ALL
  getAll: (callback) => {
    db.query('SELECT * FROM produk', (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // GET BY ID
  getById: (id, callback) => {
    db.query(
      'SELECT * FROM produk WHERE produkid = ?',
      [id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  // CREATE
  create: (data, callback) => {
    const sql = `
      INSERT INTO produk (namaproduk, harga, stok, gambar)
      VALUES (?, ?, ?, ?)
    `;

    const params = [
      data.nama,
      data.harga,
      data.stok,
      data.gambar
    ];

    db.query(sql, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // UPDATE
  update: (data, callback) => {
    let sql;
    let params;

    if (data.gambar) {
      sql = `
        UPDATE produk 
        SET namaproduk = ?, harga = ?, stok = ?, gambar = ?
        WHERE produkid = ?
      `;

      params = [
        data.namaproduk || data.nama,
        data.harga,
        data.stok,
        data.gambar,
        data.produkid || data.id
      ];
    } else {
      sql = `
        UPDATE produk 
        SET namaproduk = ?, harga = ?, stok = ?
        WHERE produkid = ?
      `;

      params = [
        data.namaproduk || data.nama,
        data.harga,
        data.stok,
        data.produkid || data.id
      ];
    }

    db.query(sql, params, (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  // DELETE
  hapus: (id, callback) => {
    db.query(
      'DELETE FROM produk WHERE produkid = ?',
      [id],
      (err, results) => {
        if (err) return callback(err);
        callback(null, results);
      }
    );
  },

  // =========================
  // KURANGI STOK (REVISI)
  // =========================
  kurangiStok: (produkid, qty, callback) => {
    // Pastikan input adalah angka untuk menghindari bug tipe data
    const jumlah = Number(qty);
    const id = Number(produkid);

    const sql = `
      UPDATE produk 
      SET stok = stok - ? 
      WHERE produkid = ? AND stok >= ?
    `;

    console.log(`Menjalankan Kurangi Stok: ID ${id}, Qty ${jumlah}`); // Debugging

    db.query(sql, [jumlah, id, jumlah], (err, results) => {
      if (err) {
        console.error("Database Error:", err);
        return callback(err);
      }

      // Jika tidak ada baris yang berubah, berarti ID salah atau stok kurang
      if (results.affectedRows === 0) {
        console.warn(`Gagal Update: Produk ID ${id} tidak ditemukan atau stok < ${jumlah}`);
        return callback(new Error('Stok tidak cukup atau produk tidak ditemukan'));
      }

      console.log("Stok berhasil dikurangi di database.");
      callback(null, results);
    });
  }

};

module.exports = produkModel;