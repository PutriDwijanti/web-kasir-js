const Produk = require('../models/produkModel');
const fs = require('fs');
const path = require('path');

const ProdukController = {

  // =========================
  // GET ALL
  // =========================
  getAll: async (request, h) => {
    try {
      const rows = await new Promise((resolve, reject) => {
        Produk.getAll((err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });

      return rows;
    } catch (error) {
      return h.response({ error: error.message }).code(500);
    }
  },

  // =========================
  // GET BY ID
  // =========================
  getById: async (request, h) => {
    const id = request.params.id;

    try {
      const row = await new Promise((resolve, reject) => {
        Produk.getById(id, (err, rows) => {
          if (err) return reject(err);
          if (!rows || rows.length === 0) return reject(new Error('Produk tidak ditemukan'));
          resolve(rows[0]);
        });
      });

      return row;
    } catch (error) {
      return h.response({ error: error.message }).code(404);
    }
  },

  // =========================
  // CREATE
  // =========================
  create: async (request, h) => {
    try {
      const data = request.payload;

      let filename = null;
      const file = data.gambar;

      if (file && file.hapi) {
        filename = Date.now() + '-' + file.hapi.filename;

        const filePath = path.join(process.cwd(), 'public/uploads', filename);

        const fileStream = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
          file.pipe(fileStream);
          file.on('error', reject);
          fileStream.on('finish', resolve);
        });
      }

      const produk = {
        nama: data.txtnama,
        harga: Number(data.harga),
        stok: Number(data.stok),
        gambar: filename
      };

      await new Promise((resolve, reject) => {
        Produk.create(produk, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.response({ message: 'Produk berhasil ditambahkan' }).code(201);

    } catch (error) {
      return h.response({ error: error.message }).code(500);
    }
  },

  // =========================
  // UPDATE
  // =========================
  update: async (request, h) => {
    try {
      const id = request.params.id;
      const data = request.payload;

      let filename = null;
      const file = data.gambar;

      if (file && file.hapi) {
        filename = Date.now() + '-' + file.hapi.filename;

        const filePath = path.join(process.cwd(), 'public/uploads', filename);

        const fileStream = fs.createWriteStream(filePath);

        await new Promise((resolve, reject) => {
          file.pipe(fileStream);
          file.on('error', reject);
          fileStream.on('finish', resolve);
        });
      }

        const gambarLama = data.gambarLama || null;

        const produk = {
          produkid: id,
          namaproduk: data.namaproduk,
          harga: Number(data.harga),
          stok: Number(data.stok),
          gambar: filename || gambarLama
        };

      await new Promise((resolve, reject) => {
        Produk.update(produk, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.response({ message: 'Produk berhasil diperbarui' });

    } catch (error) {
      return h.response({ error: error.message }).code(500);
    }
  },

  // =========================
  // DELETE
  // =========================
  delete: async (request, h) => {
    try {
      const id = request.params.id;

      await new Promise((resolve, reject) => {
        Produk.hapus(id, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.response({ message: 'Produk berhasil dihapus' });

    } catch (error) {
      return h.response({ error: error.message }).code(500);
    }
  },

  // =========================
  // 🔥 TAMBAHAN: KURANGI STOK (WAJIB KASIR)
  // =========================
  kurangiStok: async (request, h) => {
    try {
      const { produkid, qty } = request.payload;

      await new Promise((resolve, reject) => {
        Produk.kurangiStok(produkid, qty, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.response({
        message: 'Stok berhasil dikurangi'
      }).code(200);

    } catch (error) {
      return h.response({
        error: error.message
      }).code(400);
    }
  }

};

module.exports = ProdukController;