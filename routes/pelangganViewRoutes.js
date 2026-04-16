const Pelanggan = require('../models/pelangganModel');

const pelangganViewRoutes = [
 
  {
    method: 'GET',
    path: '/pelanggan',
    handler: async (request, h) => {
      return new Promise((resolve, reject) => {
        Pelanggan.getAll((err, results) => {
          if (err) return reject(h.response(err).code(500));
          resolve(h.view('pelanggan/index', { pelanggan: results }));
        });
      });
    }
  },
  {
    method: 'GET',
    path: '/pelanggan/create',
    handler: (request, h) => {
      return h.view('pelanggan/create');
    }
  },
  {
    method: 'GET',
    path: '/pelanggan/{id}/edit',
    handler: async (request, h) => {
      const id = request.params.id;
      return new Promise((resolve, reject) => {
        Pelanggan.getById(id, (err, results) => {
          if (err) return reject(h.response(err).code(500));
          if (!results.length) return resolve(h.response('Data tidak ditemukan').code(404));
          resolve(h.view('pelanggan/edit', { pelanggan: results[0] }));
        });
      });
    }
  },
  {
    method: 'GET',
    path: '/pelanggan/{id}',
    handler: async (request, h) => {
      const id = request.params.id;
      return new Promise((resolve, reject) => {
        Pelanggan.getById(id, (err, results) => {
          if (err) return reject(h.response(err).code(500));
          if (!results.length) return resolve(h.response('Data tidak ditemukan').code(404));
          resolve(h.view('pelanggan/detail', { pelanggan: results[0] }));
        });
      });
    }
  },
{
  method: 'PUT',
  path: '/pelanggan/{id}',
  handler: async (request, h) => {
    const id = request.params.id;
    const data = request.payload;
    return new Promise((resolve, reject) => {
      Pelanggan.update(id, data, (err, results) => {
        if (err) return reject(h.response(err).code(500));
        resolve(h.redirect('/pelanggan'));
      });
    });
  }
},

  // Route POST untuk tambah data pelanggan
  {
    method: 'POST',
    path: '/pelanggan',
    handler: async (request, h) => {
      const data = request.payload;
      return new Promise((resolve, reject) => {
        Pelanggan.create(data, (err, results) => {
          if (err) return reject(h.response(err).code(500));
          resolve(h.redirect('/pelanggan'));
        });
      });
    }
  },

  // Route POST untuk update data pelanggan
  {
    method: 'POST',
    path: '/pelanggan/{id}/edit',
    handler: async (request, h) => {
      const id = request.params.id;
      const data = request.payload;
      return new Promise((resolve, reject) => {
        Pelanggan.update(id, data, (err, results) => {
          if (err) return reject(h.response(err).code(500));
          resolve(h.redirect('/pelanggan'));
        });
      });
    }
  },

  {
  method: 'DELETE',
  path: '/pelanggan/{id}',
  handler: async (request, h) => {
    const id = request.params.id;
    return new Promise((resolve, reject) => {
      Pelanggan.delete(id, (err, results) => {
        if (err) return reject(h.response(err).code(500));
        resolve(h.redirect('/pelanggan'));
      });
    });
  }
}

];

module.exports = pelangganViewRoutes;
