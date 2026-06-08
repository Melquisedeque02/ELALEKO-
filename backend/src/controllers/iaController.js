const db = require('../config/database');

// Gerar template com IA (SIMULAÇÃO - PLACEHOLDER)
exports.gerarTemplate = async (req, res) => {
  const { descricao } = req.body;
  const userId = req.usuario.id;

  if (!descricao || descricao.trim() === '') {
    return res.status(400).json({ error: 'Descrição do estilo é obrigatória' });
  }

  // Verificar se a IA está ativa nas configurações
  db.get(`SELECT ia_ativa FROM configuracoes WHERE id = 1`, [], async (err, configRow) => {
    if (err) {
      console.error('Erro ao verificar configuração:', err);
      return res.status(500).json({ error: 'Erro interno' });
    }
    
    if (!configRow || configRow.ia_ativa !== 1) {
      return res.status(403).json({ error: 'Funcionalidade IA desativada pelo administrador' });
    }

    // Verificar créditos
    db.get(`SELECT creditos FROM usuarios WHERE id = ?`, [userId], async (err, row) => {
      if (err) {
        console.error('Erro ao verificar créditos:', err);
        return res.status(500).json({ error: 'Erro interno' });
      }

      if (!row || row.creditos < 1) {
        return res.status(402).json({ error: 'Créditos insuficientes. Compre mais créditos.' });
      }

      try {
        // Gerar imagem placeholder (simulação)
        const timestamp = Date.now();
        const randomId = Math.floor(Math.random() * 1000);
        const imagemUrl = `https://picsum.photos/seed/${timestamp}-${randomId}/1024/1024`;

        // HTML/CSS com a imagem placeholder
        const htmlCss = `
          <div class="template-ia-placeholder" style="text-align:center; padding:24px; background: linear-gradient(135deg, #f5f0eb 0%, #e8d5c0 100%); border-radius:24px; max-width:500px; margin:0 auto;">
            <img src="${imagemUrl}" alt="Template IA" style="width:100%; border-radius:16px; margin-bottom:16px;" />
            <h3 style="color:#19634c; font-family:'Playfair Display', serif;">Template Personalizado</h3>
            <p style="color:#6b6b6b; font-style:italic;">"${descricao.substring(0, 100)}"</p>
            <div style="margin:16px 0; padding:12px; background:white; border-radius:12px;">
              <p style="margin:0;"><strong>✨ Imagem gerada por simulação (placeholder)</strong></p>
              <p style="font-size:11px; margin-top:8px;">Na versão final, a imagem será gerada por IA real.</p>
            </div>
          </div>
        `;

        // Descontar crédito
        db.run(`UPDATE usuarios SET creditos = creditos - 1 WHERE id = ?`, [userId], (err) => {
          if (err) throw err;

          // Guardar template na tabela templates_ia
          db.run(`INSERT INTO templates_ia (user_id, descricao, imagem_url, html_css, creditos_gastos) VALUES (?, ?, ?, ?, ?)`,
            [userId, descricao, imagemUrl, htmlCss, 1], function(err) {
              if (err) throw err;

              // Registar transação
              db.run(`INSERT INTO transacoes (user_id, tipo, quantidade, descricao) VALUES (?, ?, ?, ?)`,
                [userId, 'uso_ia', 1, `Simulação IA: ${descricao.substring(0, 100)}`]);

              // Buscar saldo atualizado
              db.get(`SELECT creditos FROM usuarios WHERE id = ?`, [userId], (err, saldoRow) => {
                if (err) {
                  console.error('Erro ao buscar saldo:', err);
                  return res.status(500).json({ error: 'Erro ao buscar saldo' });
                }
                
                res.json({
                  success: true,
                  template_id: this.lastID,
                  imagem_url: imagemUrl,
                  html_css: htmlCss,
                  creditos_restantes: saldoRow?.creditos || 0
                });
              });
            });
        });

      } catch (error) {
        console.error('❌ Erro na geração placeholder:', error);
        res.status(500).json({ error: 'Erro ao gerar imagem. Tente novamente.' });
      }
    });
  });
};

// Listar templates IA do organizador
exports.listarTemplates = (req, res) => {
  const userId = req.usuario.id;
  const query = `SELECT * FROM templates_ia WHERE user_id = ? ORDER BY created_at DESC`;
  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Erro ao listar templates:', err);
      return res.status(500).json({ error: 'Erro ao listar templates' });
    }
    res.json(rows || []);
  });
};