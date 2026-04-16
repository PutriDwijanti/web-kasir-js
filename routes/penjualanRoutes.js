const penjualanController = require('../controllers/penjualanController');

/** @type {import('@hapi/hapi').ServerRoute[]} */
module.exports = [
  {
    method: 'GET',
    path: '/api/penjualan',
    handler: penjualanController.getAll
  },
  {
    method: 'GET',
    path: '/api/penjualan/{id}',
    handler: penjualanController.getById
  },
  {
    method: 'POST',
    path: '/api/penjualan',
    handler: penjualanController.create
  },
  {
    method: 'PUT',
    path: '/api/penjualan/{id}',
    handler: penjualanController.update
  },
  {
    method: 'DELETE',
    path: '/api/penjualan/{id}',
    handler: penjualanController.delete
  },
{
  method: 'GET',
  path: '/api/penjualan/{id}/struk',
  handler: penjualanController.showStruk
}

];
