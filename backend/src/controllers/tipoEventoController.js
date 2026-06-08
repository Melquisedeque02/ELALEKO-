const TipoEvento = require('../models/TipoEvento');

exports.listar = (req, res) => {
  const userId = req.usuario.id;
  TipoEvento.listarPorUsuario(userId, (err, tipos) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tipos);
  });
};

exports.criar = (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
  TipoEvento.criar(req.usuario.id, nome, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Tipo criado' });
  });
};

exports.atualizar = (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  TipoEvento.atualizar(id, nome, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Atualizado' });
  });
};

exports.deletar = (req, res) => {
  const { id } = req.params;
  TipoEvento.deletar(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Removido' });
  });
};