const ProdukController = require('../controllers/produkController');

/** @type {import('@hapi/hapi').ServerRoute[]} */
module.exports = [
  {
    method: 'GET',
    path: '/api/produk',
    handler: ProdukController.getAll
  },
  {
    method: 'GET',
    path: '/api/produk/{id}',
    handler: ProdukController.getById
  },
  { 
    method: 'POST',
    path: '/api/produk',
    options: {
      payload: {
        output: 'stream',
        parse: true,
        multipart: true,
        allow: 'multipart/form-data',
        maxBytes: 1024 * 100 // max 100KB
      }
    },
    handler: ProdukController.create
  },
  {
    method: 'PUT',
    path: '/api/produk/{id}',
    handler: ProdukController.update
  },
  {
    method: 'DELETE',
    path: '/api/produk/{id}',
    handler: ProdukController.delete
  }
];
