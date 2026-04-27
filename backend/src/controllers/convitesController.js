const Convite = require('../models/Convite');

// Criar convite
exports.criarConvite = (req, res) => {
  const { 
    nome_convidado1, 
    nome_convidado2, 
    endereco, 
    nome_evento, 
    data_evento, 
    hora_evento,
    cronograma,
    manual
  } = req.body;
  
  console.log('📥 Dados recebidos:', req.body);
  
  if (!nome_convidado1 || nome_convidado1.trim() === '') {
    return res.status(400).json({ error: 'Nome do primeiro convidado é obrigatório' });
  }

  Convite.criar(
    nome_convidado1, 
    nome_convidado2 || null, 
    endereco || null,
    nome_evento || null,
    data_evento || null,
    hora_evento || null,
    cronograma || null,
    manual || null,
    (err, resultado) => {
      if (err) {
        console.error('❌ Erro ao criar convite:', err.message);
        return res.status(500).json({ error: 'Erro interno ao criar convite: ' + err.message });
      }
      
      console.log('✅ Convite criado:', resultado);
      res.status(201).json({ message: 'Convite criado com sucesso', convite: resultado });
    }
  );
};

// Buscar convite por ID (para detalhes)
exports.buscarConvitePorId = (req, res) => {
  const { id } = req.params;
  
  Convite.buscarPorId(id, (err, convite) => {
    if (err) {
      console.error('❌ Erro ao buscar convite por ID:', err);
      return res.status(500).json({ error: 'Erro ao buscar convite' });
    }
    
    if (!convite) {
      return res.status(404).json({ error: 'Convite não encontrado' });
    }
    
    res.json(convite);
  });
};

// Validar convite por QR Code
exports.validarConvite = (req, res) => {
  const { qrCode } = req.params;

  Convite.buscarPorQRCode(qrCode, (err, convite) => {
    if (err) {
      console.error('❌ Erro ao buscar convite por QR Code:', err);
      return res.status(500).json({ 
        error: 'Erro ao validar convite' 
      });
    }

    if (!convite) {
      return res.status(404).json({ 
        valido: false, 
        mensagem: 'Convite não encontrado' 
      });
    }

    if (convite.utilizado === 1) {
      return res.json({ 
        valido: false, 
        mensagem: 'Este convite já foi utilizado' 
      });
    }

    res.json({
      valido: true,
      convite: {
        id: convite.id,
        nome_convidado1: convite.nome_convidado1,
        nome_convidado2: convite.nome_convidado2,
        data_criacao: convite.data_criacao,
        endereco: convite.endereco,
        nome_evento: convite.nome_evento,
        data_evento: convite.data_evento,
        hora_evento: convite.hora_evento,
        cronograma: convite.cronograma,
        manual: convite.manual
      }
    });
  });
};

// Utilizar convite (marcar como usado)
exports.utilizarConvite = (req, res) => {
  const { qrCode } = req.params;

  Convite.marcarComoUtilizado(qrCode, (err, changes) => {
    if (err) {
      console.error('❌ Erro ao marcar convite como utilizado:', err);
      return res.status(500).json({ 
        error: 'Erro ao marcar convite como utilizado' 
      });
    }

    if (changes === 0) {
      return res.status(404).json({ 
        error: 'Convite não encontrado ou já utilizado' 
      });
    }

    res.json({ 
      message: 'Convite marcado como utilizado com sucesso' 
    });
  });
};

// Listar todos convites
exports.listarConvites = (req, res) => {
  Convite.listarTodos((err, convites) => {
    if (err) {
      console.error('❌ Erro ao listar convites:', err);
      return res.status(500).json({ 
        error: 'Erro ao buscar convites' 
      });
    }

    res.json(convites || []);
  });
};

// Deletar convite
exports.deletarConvite = (req, res) => {
  const { id } = req.params;

  Convite.deletar(id, (err, changes) => {
    if (err) {
      console.error('❌ Erro ao deletar convite:', err);
      return res.status(500).json({ 
        error: 'Erro ao deletar convite' 
      });
    }

    if (changes === 0) {
      return res.status(404).json({ 
        error: 'Convite não encontrado' 
      });
    }

    res.json({ 
      message: 'Convite deletado com sucesso' 
    });
  });
};