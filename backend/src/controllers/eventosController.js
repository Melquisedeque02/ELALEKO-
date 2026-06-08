const Evento = require('../models/Evento');
const db = require('../config/database');

exports.criarEvento = (req, res) => {
  const { 
    nome_evento, data_evento, hora_evento, endereco,
    tipo_evento, template_padrao, manual, declaracao,
    pai_noivo, mae_noivo, pai_noiva, mae_noiva
  } = req.body;
  const userId = req.usuario.id;

  if (!nome_evento) {
    return res.status(400).json({ error: 'Nome do evento é obrigatório' });
  }

  // Verificar limite de eventos
  db.get(`SELECT limite_eventos FROM usuarios WHERE id = ?`, [userId], (err, row) => {
    const limiteEventos = row?.limite_eventos || 5;
    db.get(`SELECT COUNT(*) as total FROM eventos WHERE user_id = ?`, [userId], (err, countRow) => {
      if (countRow.total >= limiteEventos) {
        return res.status(403).json({ error: `Limite de eventos atingido (máximo ${limiteEventos})` });
      }
      
      Evento.criar(
        userId, nome_evento, data_evento, hora_evento, endereco,
        tipo_evento || 'outro', template_padrao || 'classico',
        manual ? JSON.stringify(manual) : null,
        declaracao ? JSON.stringify(declaracao) : null,
        pai_noivo || null, mae_noivo || null, pai_noiva || null, mae_noiva || null,
        (err, id) => {
          if (err) {
            console.error('Erro ao criar evento:', err);
            return res.status(500).json({ error: 'Erro ao criar evento' });
          }
          res.status(201).json({ message: 'Evento criado com sucesso', id });
        }
      );
    });
  });
};

exports.listarEventos = (req, res) => {
  const userId = req.usuario.id;
  Evento.listarPorUsuario(userId, (err, eventos) => {
    if (err) {
      console.error('Erro ao listar eventos:', err);
      return res.status(500).json({ error: 'Erro ao listar eventos' });
    }
    res.json(eventos);
  });
};

exports.buscarEventoPorId = (req, res) => {
  const { id } = req.params;
  Evento.buscarPorId(id, (err, evento) => {
    if (err) {
      console.error('Erro ao buscar evento:', err);
      return res.status(500).json({ error: 'Erro ao buscar evento' });
    }
    if (!evento) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    // Parse JSON fields
    if (evento.manual) {
      try { evento.manual = JSON.parse(evento.manual); } catch(e) {}
    }
    if (evento.declaracao) {
      try { evento.declaracao = JSON.parse(evento.declaracao); } catch(e) {}
    }
    res.json(evento);
  });
};

exports.atualizarEvento = (req, res) => {
  const { id } = req.params;
  const { 
    nome_evento, data_evento, hora_evento, endereco,
    tipo_evento, template_padrao, manual, declaracao,
    pai_noivo, mae_noivo, pai_noiva, mae_noiva
  } = req.body;

  Evento.atualizar(
    id, nome_evento, data_evento, hora_evento, endereco,
    tipo_evento, template_padrao,
    manual ? JSON.stringify(manual) : null,
    declaracao ? JSON.stringify(declaracao) : null,
    pai_noivo, mae_noivo, pai_noiva, mae_noiva,
    (err, changes) => {
      if (err) {
        console.error('Erro ao atualizar evento:', err);
        return res.status(500).json({ error: 'Erro ao atualizar evento' });
      }
      if (changes === 0) {
        return res.status(404).json({ error: 'Evento não encontrado' });
      }
      res.json({ message: 'Evento atualizado com sucesso' });
    }
  );
};

exports.deletarEvento = (req, res) => {
  const { id } = req.params;
  Evento.deletar(id, (err, changes) => {
    if (err) {
      console.error('Erro ao deletar evento:', err);
      return res.status(500).json({ error: 'Erro ao deletar evento' });
    }
    if (changes === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    res.json({ message: 'Evento deletado com sucesso' });
  });
};