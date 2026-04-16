const Produk = require('../models/produkModel');

const ProdukController = {
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
      return h.response({ error: error.message || 'Gagal mengambil data' }).code(500);
    }
  },

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

  create: async (request, h) => {
    try {
      const data = request.payload;

      const produk = {
        id: data.txtid,
        nama: data.txtnama,
        harga: Number(data.txtharga),
        stok: Number(data.txtstock)
      };

      await new Promise((resolve, reject) => {
        Produk.create(produk, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.response({ message: 'Produk berhasil ditambahkan' }).code(201);
    } catch (error) {
      return h.response({ error: error.message || 'Gagal menambahkan produk' }).code(500);
    }
  },

  update: async (request, h) => {
    try {
      const id = request.params.id;
      const data = request.payload;

      const produk = {
        id: id,
        nama: data.txtnama || data.nama,
        harga: Number(data.txtharga || data.harga),
        stok: Number(data.txtstock || data.stok)
      };

      await new Promise((resolve, reject) => {
        Produk.update(produk, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.response({ message: 'Produk berhasil diperbarui' });
    } catch (error) {
      return h.response({ error: error.message || 'Gagal memperbarui produk' }).code(500);
    }
  },

  delete: async (request, h) => {
    try {
      const id = request.params.id;

      await new Promise((resolve, reject) => {
        Produk.delete(id, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.response({ message: 'Produk berhasil dihapus' });
    } catch (error) {
      return h.response({ error: error.message || 'Gagal menghapus produk' }).code(500);
    }
  }
};

module.exports = ProdukController;
