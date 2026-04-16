const pelangganController = require('../controllers/pelangganController');

/** @type {import('@hapi/hapi').ServerRoute[]} */
const routes = [
  {
    method: 'get',
    path: '/api/pelanggan',
    handler: pelangganController.getAll,
  },
  {
    method: 'get',
    path: '/api/pelanggan/{id}',
    handler: pelangganController.getById,
  },
  {
    method: 'post',
    path: '/api/pelanggan',
    handler: pelangganController.create,
  },
  {
    method: 'put',
    path: '/api/pelanggan/{id}',
    handler: pelangganController.update,
  },
  {
    method: 'delete',
    path: '/api/pelanggan/{id}',
    handler: pelangganController.delete,
  },
];

module.exports = routes;
