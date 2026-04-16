const Penjualan = require('../models/penjualanModel');
const detailController = require('../controllers/detailPenjualanController');



const penjualanViewRoutes = [
  // Tampilkan daftar penjualan
  {
    method: 'GET',
    path: '/penjualan',
    handler: async (request, h) => {
      try {
        const results = await Penjualan.getAll();
        return h.view('penjualan/index', { penjualan: results });
      } catch (err) {
        console.error(err);
        return h.response({ error: err.message || 'Internal Server Error' }).code(500);
      }
    }
  },

  // Form tambah penjualan
  {
    method: 'GET',
    path: '/penjualan/create',
    handler: (request, h) => {
      return h.view('penjualan/create');
    }
  },

  // Simpan penjualan baru
  {
    method: 'POST',
    path: '/penjualan',
    handler: async (request, h) => {
      const data = request.payload;
      try {
        await Penjualan.create(data);
        return h.redirect('/penjualan');
      } catch (err) {
        console.error(err);
        return h.response({ error: err.message || 'Internal Server Error' }).code(500);
      }
    }
  },

  // Form edit penjualan
  {
    method: 'GET',
    path: '/penjualan/{id}/edit',
    handler: async (request, h) => {
      const id = request.params.id;
      try {
        const results = await Penjualan.getById(id);
        if (!results.length) {
          return h.response('Data tidak ditemukan').code(404);
        }
        return h.view('penjualan/edit', { penjualan: results[0] });
      } catch (err) {
        console.error(err);
        return h.response({ error: err.message || 'Internal Server Error' }).code(500);
      }
    }
  },

  // Update data penjualan
  {
    method: 'POST',
    path: '/penjualan/{id}/edit',
    handler: async (request, h) => {
      const id = request.params.id;
      const data = request.payload;
      try {
        await Penjualan.update(id, data);
        return h.redirect('/penjualan');
      } catch (err) {
        console.error(err);
        return h.response({ error: err.message || 'Internal Server Error' }).code(500);
      }
    }
  },

  // Tampilkan detail penjualan
  {
    method: 'GET',
    path: '/penjualan/{id}',
    handler: async (request, h) => {
      const id = request.params.id;
      try {
        const results = await Penjualan.getById(id);
        if (!results.length) {
          return h.response('Data tidak ditemukan').code(404);
        }
        return h.view('penjualan/detail', { penjualan: results[0] });
      } catch (err) {
        console.error(err);
        return h.response({ error: err.message || 'Internal Server Error' }).code(500);
      }
    }
  },

  // Hapus data penjualan
  {
    method: 'DELETE',
    path: '/penjualan/{id}',
    handler: async (request, h) => {
      const id = request.params.id;
      try {
        await Penjualan.delete(id);
        return h.redirect('/penjualan');
      } catch (err) {
        console.error(err);
        return h.response({ error: err.message || 'Internal Server Error' }).code(500);
      }
    }
  },

  {
  method: 'GET',
  path: '/penjualan/{id}/struk',
  handler: async (request, h) => {
    const id = request.params.id;
    try {
      // Ambil data penjualan
      const penjualanData = await Penjualan.getById(id);
      if (!penjualanData.length) {
        return h.response('Data tidak ditemukan').code(404);
      }
      const penjualan = penjualanData[0];

      // Ambil detail penjualan (produk, jumlah, harga, subtotal)
      const detailPenjualan = await detailController.getByPenjualanIdWithProduk(id);

      // Hitung total
      const total = detailPenjualan.reduce((sum, item) => sum + (item.subtotal || 0), 0);

      // Ambil data pelanggan, misal lewat penjualan.pelangganid
      // Asumsi ada model Pelanggan dan method getById
      const Pelanggan = require('../models/pelangganModel');
      const pelangganData = await Pelanggan.getById(penjualan.pelangganid);
      // @ts-ignore
      const pelanggan = pelangganData.length ? pelangganData[0] : { namapelanggan: '-' };

      // Render view struk dengan data lengkap
      return h.view('penjualan/struk', { penjualan, pelanggan, detailPenjualan, total });

    } catch (err) {
      console.error(err);
      return h.response({ error: err.message || 'Internal Server Error' }).code(500);
    }
  }
}

];

module.exports = penjualanViewRoutes;
