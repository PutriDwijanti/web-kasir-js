const Produk = require('../models/produkModel');
const fs = require('fs');
const path = require('path');

module.exports = [

  // =========================
  // LIST PRODUK
  // =========================
  {
    method: 'GET',
    path: '/produk',
    handler: async (request, h) => {
      const produk = await new Promise((resolve, reject) => {
        Produk.getAll((err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });

      return h.view('produk/index', { produk });
    }
  },

  // =========================
  // FORM CREATE
  // =========================
  {
    method: 'GET',
    path: '/produk/create',
    handler: (request, h) => {
      return h.view('produk/create');
    }
  },

  // =========================
  // CREATE + UPLOAD GAMBAR
  // =========================
  {
    method: 'POST',
    path: '/produk/create',
    options: {
      payload: {
        parse: true,
        multipart: true,
        output: 'stream',
        maxBytes: 10 * 1024 * 1024
      }
    },

    handler: async (request, h) => {
      try {
        const { namaproduk, harga, stok } = request.payload;

        let filename = null; // ✔ hanya sekali

        const file = request.payload.gambar;

        if (file && file.hapi) {
          filename = Date.now() + '-' + file.hapi.filename;

          const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

          const fileStream = fs.createWriteStream(uploadPath);

          await new Promise((resolve, reject) => {
            file.pipe(fileStream);

            file.on('error', reject);
            fileStream.on('finish', resolve);
          });
        }

        const data = {
          nama: namaproduk,
          harga: Number(harga),
          stok: Number(stok),
          gambar: filename
        };

        await new Promise((resolve, reject) => {
          Produk.create(data, (err) => {
            if (err) return reject(err);
            resolve(true);
          });
        });

        return h.redirect('/produk');

      } catch (err) {
        console.error(err);
        return h.response('Gagal upload produk').code(500);
      }
    }
  },

  // =========================
  // FORM EDIT
  // =========================
  {
    method: 'GET',
    path: '/produk/edit/{id}',
    handler: async (request, h) => {
      const id = request.params.id;

      const produk = await new Promise((resolve, reject) => {
        Produk.getById(id, (err, rows) => {
          if (err) return reject(err);
          if (!rows || rows.length === 0) return reject(new Error('Not found'));
          resolve(rows[0]);
        });
      });

      return h.view('produk/edit', { produk });
    }
  },

  // =========================
  // UPDATE + GAMBAR OPTIONAL
  // =========================
  {
    method: 'POST',
    path: '/produk/edit/{id}',
    options: {
      payload: {
        parse: true,
        multipart: true,
        output: 'stream'
      }
    },

    handler: async (request, h) => {
      const id = request.params.id;
      const { namaproduk, harga, stok } = request.payload;

      let filename = null; // ✔ FIX DUPLIKAT DIHAPUS

      const file = request.payload.gambar;

      if (file && file.hapi) {
        filename = Date.now() + '-' + file.hapi.filename;

        const uploadPath = path.join(process.cwd(), 'public/uploads', filename);

        const fileStream = fs.createWriteStream(uploadPath);

        await new Promise((resolve, reject) => {
          file.pipe(fileStream);

          file.on('error', reject);
          fileStream.on('finish', resolve);
        });
      }

      const data = {
        produkid: id,
        namaproduk,
        harga: Number(harga),
        stok: Number(stok),
        gambar: filename
      };

      await new Promise((resolve, reject) => {
        Produk.update(data, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.redirect('/produk');
    }
  },

  // =========================
  // DELETE
  // =========================
  {
    method: 'POST',
    path: '/produk/hapus/{id}',
    handler: async (request, h) => {
      const id = request.params.id;

      await new Promise((resolve, reject) => {
        Produk.hapus(id, (err) => {
          if (err) return reject(err);
          resolve(true);
        });
      });

      return h.redirect('/produk');
    }
  },

  // =========================
  // DETAIL
  // =========================
  {
    method: 'GET',
    path: '/produk/detail/{id}',
    handler: async (request, h) => {
      const id = request.params.id;

      const produk = await new Promise((resolve, reject) => {
        Produk.getById(id, (err, rows) => {
          if (err) return reject(err);
          if (!rows || rows.length === 0) return reject(new Error('Not found'));
          resolve(rows[0]);
        });
      });

      return h.view('produk/detail', { produk });
    }
  }
];