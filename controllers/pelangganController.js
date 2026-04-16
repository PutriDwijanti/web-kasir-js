const Pelanggan = require('../models/pelangganModel');

exports.getAll = async (request, h) => {
  return new Promise((resolve, reject) => {
    Pelanggan.getAll((err, results) => {
      if (err) return reject(h.response(err).code(500));
      resolve(results);
    });
  });
};

exports.getById = async (request, h) => {
  return new Promise((resolve, reject) => {
    const id = request.params.id;
    Pelanggan.getById(id, (err, results) => {
      if (err) return reject(h.response(err).code(500));
      resolve(results[0]);
    });
  });
};

exports.create = async (request, h) => {
  return new Promise((resolve, reject) => {
    const data = request.payload;
    Pelanggan.create(data, (err, result) => {
      if (err) return reject(h.response(err).code(500));
      resolve({ message: 'Pelanggan berhasil ditambahkan', id: result.insertId });
    });
  });
};

exports.update = async (request, h) => {
  return new Promise((resolve, reject) => {
    const id = request.params.id;
    const data = request.payload;
    Pelanggan.update(id, data, (err) => {
      if (err) return reject(h.response(err).code(500));
      resolve({ message: 'Pelanggan berhasil diupdate' });
    });
  });
};

exports.delete = async (request, h) => {
  return new Promise((resolve, reject) => {
    const id = request.params.id;
    Pelanggan.delete(id, (err) => {
      if (err) return reject(h.response(err).code(500));
      resolve({ message: 'Pelanggan berhasil dihapus' });
    });
  });
};
