const Convite = require('../models/Convite');
const db = require('../config/database');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const AdmZip = require('adm-zip');
const puppeteer = require('puppeteer');
const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });

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
    manual,
    declaracao,
    presentes,
    pai_noivo,
    mae_noivo,
    pai_noiva,
    mae_noiva,
    evento_id,
    template
  } = req.body;
  
  console.log('📥 Dados recebidos:', req.body);
  
  if (!nome_convidado1 || nome_convidado1.trim() === '') {
    return res.status(400).json({ error: 'Nome do primeiro convidado é obrigatório' });
  }
  
  if (!evento_id) {
    return res.status(400).json({ error: 'Evento ID é obrigatório' });
  }
  
  // Verificar limite de convidados por evento
  const userId = req.usuario.id;
  
  // Buscar limite do evento
  db.get(`SELECT limite_convidados FROM eventos WHERE id = ?`, [evento_id], (err, eventoRow) => {
    if (err) {
      console.error('Erro ao buscar limite do evento:', err);
      return res.status(500).json({ error: 'Erro ao verificar limite' });
    }
    
    let limiteConvidados = eventoRow?.limite_convidados;
    
    const verificarContagem = () => {
      db.get(`SELECT COUNT(*) as total FROM convites WHERE evento_id = ?`, [evento_id], (err, countRow) => {
        if (err) {
          console.error('Erro ao contar convites:', err);
          return res.status(500).json({ error: 'Erro ao verificar quantidade de convites' });
        }
        
        if (countRow.total >= limiteConvidados) {
          return res.status(403).json({ 
            error: `Limite de convidados para este evento atingido (máximo ${limiteConvidados}).`,
            limite: limiteConvidados,
            atual: countRow.total
          });
        }
        
        // Continuar com a criação do convite
        Convite.criar(
          nome_convidado1, 
          nome_convidado2 || null, 
          endereco || null,
          nome_evento || null,
          data_evento || null,
          hora_evento || null,
          cronograma || null,
          manual || null,
          declaracao || null,
          presentes || null,
          pai_noivo || null,
          mae_noivo || null,
          pai_noiva || null,
          mae_noiva || null,
          evento_id,
          req.body.template || 'classico',
          (err, resultado) => {
            if (err) {
              console.error('❌ Erro ao criar convite:', err.message);
              return res.status(500).json({ error: 'Erro interno ao criar convite: ' + err.message });
            }
            
            console.log('✅ Convite criado:', resultado);
            res.status(201).json({ message: 'Convite criado com sucesso', convite: resultado });
          }
        );
      });
    };
    
    if (limiteConvidados) {
      verificarContagem();
    } else {
      db.get(`SELECT limite_convidados_por_evento FROM usuarios WHERE id = ?`, [userId], (err, userRow) => {
        limiteConvidados = userRow?.limite_convidados_por_evento || 100;
        verificarContagem();
      });
    }
  });
};

// Buscar convite por ID
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

// Atualizar convite
exports.atualizarConvite = (req, res) => {
  const { id } = req.params;
  const userId = req.usuario.id;
  const { 
    nome_convidado1, 
    nome_convidado2, 
    nome_evento, 
    data_evento, 
    hora_evento, 
    endereco 
  } = req.body;

  // Verificar se o convite pertence ao utilizador (via evento ou diretamente se for admin)
  const checkQuery = `
    SELECT c.id FROM convites c
    LEFT JOIN eventos e ON c.evento_id = e.id
    WHERE c.id = ? AND (e.user_id = ? OR ? = 'admin')
  `;
  
  db.get(checkQuery, [id, userId, req.usuario.role], (err, row) => {
    if (err) {
      console.error('Erro ao verificar permissão:', err);
      return res.status(500).json({ error: 'Erro ao verificar permissão' });
    }
    
    if (!row && req.usuario.role !== 'admin') {
      return res.status(403).json({ error: 'Não tem permissão para editar este convite' });
    }
    
    const query = `
      UPDATE convites 
      SET nome_convidado1 = ?, 
          nome_convidado2 = ?, 
          nome_evento = ?, 
          data_evento = ?, 
          hora_evento = ?, 
          endereco = ?
      WHERE id = ?
    `;
    
    db.run(query, [nome_convidado1, nome_convidado2, nome_evento, data_evento, hora_evento, endereco, id], function(err) {
      if (err) {
        console.error('❌ Erro ao atualizar convite:', err);
        return res.status(500).json({ error: 'Erro ao atualizar convite' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Convite não encontrado' });
      }
      
      res.json({ message: 'Convite atualizado com sucesso' });
    });
  });

  // Verificar se o convite pertence ao organizador (via evento)
db.get(
  `SELECT c.id FROM convites c
   JOIN eventos e ON c.evento_id = e.id
   WHERE c.id = ? AND e.user_id = ?`,
  [id, req.usuario.id],
  (err, row) => {
    if (err || !row) {
      return res.status(403).json({ error: 'Não tem permissão para esta ação' });
    }
  }
);
};

// Validar convite público
exports.validarConvitePublico = (req, res) => {
  const { qrCode } = req.params;

  Convite.buscarPorQRCode(qrCode, (err, convite) => {
    if (err) {
      console.error('❌ Erro ao buscar convite por QR Code:', err);
      return res.status(500).json({ error: 'Erro ao validar convite' });
    }

    if (!convite) {
      return res.status(404).json({ 
        valido: false, 
        mensagem: 'Convite não encontrado' 
      });
    }

    res.json({
      valido: convite.utilizado === 0,
      localizacao: {
        endereco: convite.endereco,
        nome_evento: convite.nome_evento,
        data_evento: convite.data_evento,
        hora_evento: convite.hora_evento,
        manual: convite.manual,
        declaracao: convite.declaracao
      }
    });
  });
};

// Validar convite protegido
exports.validarConviteProtegido = (req, res) => {
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
        manual: convite.manual,
        declaracao: convite.declaracao,
        presentes: convite.presentes,
        pai_noivo: convite.pai_noivo,
        mae_noivo: convite.mae_noivo,
        pai_noiva: convite.pai_noiva,
        mae_noiva: convite.mae_noiva
      }
    });
  });
};

// Utilizar convite (marcar como usado)
exports.utilizarConvite = (req, res) => {
  const { qrCode } = req.params;
  const userId = req.usuario.id;

  // Verificar se o convite existe
  const checkQuery = `
    SELECT c.id, c.utilizado FROM convites c
    LEFT JOIN eventos e ON c.evento_id = e.id
    WHERE c.qr_code = ? AND (e.user_id = ? OR ? = 'admin')
  `;
  
  db.get(checkQuery, [qrCode, userId, req.usuario.role], (err, row) => {
    if (err) {
      console.error('Erro ao verificar convite:', err);
      return res.status(500).json({ error: 'Erro ao verificar convite' });
    }
    
    if (!row && req.usuario.role !== 'admin') {
      return res.status(404).json({ error: 'Convite não encontrado ou não tem permissão' });
    }
    
    if (row && row.utilizado === 1) {
      return res.status(400).json({ error: 'Convite já foi utilizado' });
    }
    
    const query = `UPDATE convites SET utilizado = 1 WHERE qr_code = ?`;
    db.run(query, [qrCode], function(err) {
      if (err) {
        console.error('❌ Erro ao marcar convite como utilizado:', err);
        return res.status(500).json({ error: 'Erro ao marcar convite como utilizado' });
      }
      
      res.json({ message: 'Convite marcado como utilizado com sucesso' });
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

// Listar convites por evento
exports.listarConvitesPorEvento = (req, res) => {
  const { eventoId } = req.params;
  const query = `SELECT * FROM convites WHERE evento_id = ? ORDER BY data_criacao DESC`;
  db.all(query, [eventoId], (err, rows) => {
    if (err) {
      console.error('Erro ao listar convites por evento:', err);
      return res.status(500).json({ error: 'Erro ao buscar convites' });
    }
    res.json(rows);
  });
};

// Deletar convite
exports.deletarConvite = (req, res) => {
  const { id } = req.params;
  const userId = req.usuario.id;

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

// ==================== FUNÇÕES PARA GERAR HTML DOS TEMPLATES ====================

function gerarHTMLTemplateClassico(dados, qrCodeUrl) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Convite ${dados.nome_convidado1}</title>
    <style>
      body { font-family: 'Playfair Display', serif; margin: 0; padding: 0; background: #f5f0eb; }
      .template { max-width: 500px; margin: 20px auto; background: white; border-radius: 20px; padding: 30px; border: 1px solid #c9a87c; }
      h1 { color: #19634c; text-align: center; font-size: 24px; }
      .guest { text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; padding: 10px; border-top: 1px solid #e0dcd7; border-bottom: 1px solid #e0dcd7; }
      .info { background: #f8f9fa; padding: 15px; border-radius: 12px; margin: 20px 0; }
      .info p { margin: 8px 0; }
      .qr { text-align: center; margin: 20px 0; }
      .qr img { width: 120px; height: 120px; }
      .footer { text-align: center; font-size: 10px; color: #aaa; margin-top: 20px; }
    </style>
    </head>
    <body>
      <div class="template">
        <h1>${dados.nome_evento || 'CONVITE ESPECIAL'}</h1>
        <div class="guest">${dados.nome_convidado1}${dados.nome_convidado2 ? ` & ${dados.nome_convidado2}` : ''}</div>
        <div class="info">
          <p>📅 ${dados.data_evento ? new Date(dados.data_evento).toLocaleDateString('pt-BR') : 'Data a definir'}</p>
          <p>⏰ ${dados.hora_evento || 'Hora a definir'}</p>
          <p>📍 ${dados.endereco || 'Local a definir'}</p>
        </div>
        <div class="qr"><img src="${qrCodeUrl}" /><p>QR Code de validação</p></div>
        <div class="footer">Elaleko - Convite Digital</div>
      </div>
    </body>
    </html>
  `;
}

// Funções similares para outros templates (moderno, romantico, natureza, religioso)
function gerarHTMLTemplateModerno(dados, qrCodeUrl) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Convite ${dados.nome_convidado1}</title>
  <style>body { font-family: 'Inter', sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  .template { max-width: 500px; margin: 20px auto; background: white; border-radius: 20px; padding: 30px; }
  h1 { color: #19634c; text-align: center; } .guest { text-align: center; font-size: 18px; margin: 20px 0; }
  .info { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px 0; }
  .info-card { background: #f8f9fa; padding: 10px; border-radius: 10px; text-align: center; }
  .qr { text-align: center; margin: 20px 0; } .qr img { width: 100px; }</style>
  </head><body><div class="template"><h1>${dados.nome_evento || 'EVENTO'}</h1>
  <div class="guest">${dados.nome_convidado1}${dados.nome_convidado2 ? ` & ${dados.nome_convidado2}` : ''}</div>
  <div class="info"><div class="info-card">📅 ${dados.data_evento || 'Data'}</div><div class="info-card">⏰ ${dados.hora_evento || 'Hora'}</div>
  <div class="info-card" style="grid-column:span 2">📍 ${dados.endereco || 'Local'}</div></div>
  <div class="qr"><img src="${qrCodeUrl}" /><p>QR Code</p></div></div></body></html>`;
}

// Função para gerar PDF usando o template correto
async function gerarPDFConvite(convite) {
  const template = convite.template || 'classico';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${convite.qr_code}&format=png`;
  
  let html = '';
  switch(template) {
    case 'moderno':
      html = gerarHTMLTemplateModerno(convite, qrCodeUrl);
      break;
    case 'romantico':
      html = gerarHTMLTemplateModerno(convite, qrCodeUrl); // Adaptar depois
      break;
    case 'natureza':
      html = gerarHTMLTemplateModerno(convite, qrCodeUrl); // Adaptar depois
      break;
    case 'religioso':
      html = gerarHTMLTemplateModerno(convite, qrCodeUrl); // Adaptar depois
      break;
    default:
      html = gerarHTMLTemplateClassico(convite, qrCodeUrl);
  }
  
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return pdf;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return null;
  }
}

// Gerar ZIP com todos os convites do evento
exports.baixarTodosConvites = async (req, res) => {
  const { eventoId } = req.params;
  
  try {
    const query = `SELECT * FROM convites WHERE evento_id = ? ORDER BY id`;
    const convites = await new Promise((resolve, reject) => {
      db.all(query, [eventoId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
    
    if (convites.length === 0) {
      return res.status(404).json({ error: 'Nenhum convite encontrado para este evento' });
    }
    
    const zip = new AdmZip();
    
    for (const convite of convites) {
      const nomeBase = `${convite.nome_convidado1.replace(/[^a-z0-9]/gi, '_')}_${convite.id}`;
      
      // QR Code
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${convite.qr_code}&format=png`;
      try {
        const qrResponse = await fetch(qrUrl);
        const qrBuffer = await qrResponse.buffer();
        zip.addFile(`${nomeBase}_qr.png`, qrBuffer);
      } catch (error) {
        zip.addFile(`${nomeBase}_qr_error.txt`, Buffer.from('Erro ao gerar QR Code'));
      }
      
      // PDF do convite
      const pdfBuffer = await gerarPDFConvite(convite);
      if (pdfBuffer) {
        zip.addFile(`${nomeBase}_convite.pdf`, pdfBuffer);
      } else {
        zip.addFile(`${nomeBase}_convite_error.txt`, Buffer.from('Erro ao gerar PDF'));
      }
      
      // Informações
      const infoText = `CONVITE #${convite.id}\nConvidado: ${convite.nome_convidado1}${convite.nome_convidado2 ? `\nAcompanhante: ${convite.nome_convidado2}` : ''}\nEvento: ${convite.nome_evento}\nData: ${convite.data_evento}\nHora: ${convite.hora_evento}\nLocal: ${convite.endereco}\nStatus: ${convite.utilizado ? 'UTILIZADO' : 'VÁLIDO'}\nCódigo: ${convite.qr_code}`;
      zip.addFile(`${nomeBase}_info.txt`, Buffer.from(infoText));
    }
    
    const zipFileName = `convites_evento_${eventoId}_${Date.now()}.zip`;
    const zipBuffer = zip.toBuffer();
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
    res.send(zipBuffer);
    
  } catch (error) {
    console.error('Erro ao gerar ZIP:', error);
    res.status(500).json({ error: 'Erro ao gerar arquivo ZIP' });
  }
};







// Importar convites em massa via Excel/CSV (apenas nomes)
exports.importarConvites = async (req, res) => {
  const { eventoId } = req.params;
  const userId = req.usuario.id;
  
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum ficheiro enviado' });
  }
  
  try {
    const xlsx = require('xlsx');
    const fs = require('fs');
    
    // Ler o ficheiro Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dados = xlsx.utils.sheet_to_json(sheet);
    
    if (dados.length === 0) {
      return res.status(400).json({ error: 'Ficheiro vazio ou formato inválido' });
    }
    
    // Buscar dados completos do evento
    const eventoData = await new Promise((resolve, reject) => {
      db.get(`SELECT * FROM eventos WHERE id = ? AND user_id = ?`, [eventoId, userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    
    if (!eventoData) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }
    
    // Verificar limite de convidados
    const limiteConvidados = eventoData.limite_convidados || 100;
    const totalExistente = await new Promise((resolve, reject) => {
      db.get(`SELECT COUNT(*) as total FROM convites WHERE evento_id = ?`, [eventoId], (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });
    
    const espacoDisponivel = limiteConvidados - totalExistente;
    
    if (dados.length > espacoDisponivel) {
      return res.status(400).json({ 
        error: `Limite excedido. Espaço disponível: ${espacoDisponivel}, ficheiro tem: ${dados.length}`
      });
    }
    
    // Detetar colunas
    const sampleRow = dados[0];
    const columnKeys = Object.keys(sampleRow);
    const colunaNome1 = columnKeys.find(key => 
      key.toLowerCase().replace(/\s/g, '').includes('convidado1') || 
      (key.toLowerCase().replace(/\s/g, '').includes('nome') && key.toLowerCase().replace(/\s/g, '').includes('1'))
    ) || columnKeys[0];
    
    const colunaNome2 = columnKeys.find(key => 
      key.toLowerCase().replace(/\s/g, '').includes('convidado2') || 
      (key.toLowerCase().replace(/\s/g, '').includes('nome') && key.toLowerCase().replace(/\s/g, '').includes('2'))
    );
    
    let criados = 0;
    let erros = [];
    
    for (const row of dados) {
      const nome1 = row[colunaNome1]?.toString().trim();
      const nome2 = colunaNome2 ? row[colunaNome2]?.toString().trim() : null;
      
      if (!nome1) {
        erros.push({ linha: row, motivo: 'Nome do convidado 1 é obrigatório' });
        continue;
      }
      
      await new Promise((resolve) => {
        Convite.criar(
          nome1,
          nome2,
          eventoData.endereco,
          eventoData.nome_evento,
          eventoData.data_evento,
          eventoData.hora_evento,
          null,
          eventoData.manual,
          eventoData.declaracao,
          null,
          eventoData.pai_noivo,
          eventoData.mae_noivo,
          eventoData.pai_noiva,
          eventoData.mae_noiva,
          eventoId,
          eventoData.template_padrao || 'classico',
          (err) => {
            if (err) {
              erros.push({ linha: row, motivo: err.message });
            } else {
              criados++;
            }
            resolve();
          }
        );
      });
    }
    
    // Limpar ficheiro temporário
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    
    res.json({
      message: `Importação concluída: ${criados} convites criados, ${erros.length} erros`,
      criados,
      erros: erros.slice(0, 10)
    });
    
  } catch (error) {
    console.error('Erro na importação:', error);
    try {
      const fs = require('fs');
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } catch(e) {}
    res.status(500).json({ error: 'Erro ao processar importação: ' + error.message });
  }
};