const Produk = require('../models/produkModel');

module.exports = [
  // Tampilkan semua produk
  {
    method: 'GET',
    path: '/produk',
    handler: async (request, h) => {
      const produk = await new Promise((resolve, reject) => {
        Produk.getAll((err, rows) => {
          if (err) reject(err);
          resolve(rows);
        });
      });
      return h.view('produk/index', { produk });
    }
  },

  // Form tambah produk
  {
    method: 'GET',
    path: '/produk/create',
    handler: (request, h) => {
      return h.view('produk/create');
    }
  },

  // Proses tambah produk
  {
    method: 'POST',
    path: '/produk/create',
    handler: async (request, h) => {
const { namaproduk, harga, stok } = request.payload;

const data = {
  nama: namaproduk,
  harga,
  stock: stok,
};

      await new Promise((resolve, reject) => {
        Produk.create(data, (err) => {
          if (err) reject(err);
          resolve(true);
        });
      });

      return h.redirect('/produk');
    }
  },

  // Form edit produk
{
  method: 'GET',
  path: '/produk/edit/{id}',
  handler: async (request, h) => {
    const id = request.params.id;

    try {
      const produk = await new Promise((resolve, reject) => {
        Produk.getById(id, (err, rows) => {
          if (err) return reject(err);
          if (!rows || rows.length === 0) return reject(new Error('Produk tidak ditemukan'));
          resolve(rows[0]);
        });
      });

      return h.view('produk/edit', { produk });
    } catch (err) {
      console.error('Error saat mengambil data produk:', err.message);
      return h.response('Terjadi kesalahan saat mengambil data produk').code(500);
    }
  }
},


  // Proses update produk
  {
    method: 'POST',
    path: '/produk/edit/{id}',
    handler: async (request, h) => {
      const id = request.params.id;
      const { namaproduk, harga, stok } = request.payload;

      const data = {
      produkid: id,
      namaproduk,
      harga,
      stok,
       };

      await new Promise((resolve, reject) => {
        Produk.update(data, (err) => {
          if (err) reject(err);
          resolve(true);
        });
      });

      return h.redirect('/produk');
    }
  },

  // Hapus produk
  {
    method: 'POST',
    path: '/produk/hapus/{id}',
    handler: async (request, h) => {
      const id = request.params.id;

      await new Promise((resolve, reject) => {
        Produk.hapus(id, (err) => {
          if (err) reject(err);
          resolve(true);
        });
      });

      return h.redirect('/produk');
    }
  },

  // Detail produk
  {
    method: 'GET',
    path: '/produk/detail/{id}',
    handler: async (request, h) => {
      const id = request.params.id;
      try {
        const produk = await new Promise((resolve, reject) => {
          Produk.getById(id, (err, rows) => {
            if (err) return reject(err);
            if (!rows || rows.length === 0) return reject(new Error('Produk tidak ditemukan'));
            resolve(rows[0]);
          });
        });
        return h.view('produk/detail', { produk });
      } catch (error) {
        return h.response('Produk tidak ditemukan').code(404);
      }
    }
  }
];
