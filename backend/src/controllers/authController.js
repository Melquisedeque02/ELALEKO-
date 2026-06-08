const db = require('../config/database');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendResetEmail } = require('../services/emailService');

const SECRET_KEY = 'digitalinvites_secret_key_2024';

exports.login = (req, res) => {
  const { email, senha } = req.body;

  console.log('🔐 Tentativa de login:', email);
  
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }
  
  Usuario.buscarPorEmail(email, (err, usuario) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
    
    if (usuario.ativo === 0) {
        console.log('❌ Conta desativada:', email);
        return res.status(401).json({ error: 'Conta desativada. Contacte o administrador.' });
    }
    
    console.log('✅ Usuário encontrado:', usuario.email);
    
    const senhaValida = Usuario.verificarSenha(senha, usuario.senha);
    
    if (!senhaValida) {
      console.log('❌ Senha inválida para:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }
    
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      SECRET_KEY,
      { expiresIn: '8h' }
    );
    
    console.log('✅ Login bem-sucedido:', email);
    
    res.json({
      message: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
  });
};

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

exports.registrar = (req, res) => {
  const { nome, email, senha, role } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }
  
  Usuario.registrar(nome, email, senha, role || 'seguranca', (err) => {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      return res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
    
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  });
};

// Registrar organizador (público)
exports.registrarOrganizador = (req, res) => {
  const { nome, email, senha } = req.body;
  
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
  }
  
  // Validação de email
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  // Validação de senha
  if (senha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }
  
  Usuario.criar(nome, email, senha, 'organizador', (err, id) => {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Email já registado' });
      }
      console.error('Erro ao registrar organizador:', err);
      return res.status(500).json({ error: 'Erro interno ao registar' });
    }
    
    res.status(201).json({ message: 'Organizador registado com sucesso', id });
  });
};

// Solicitar recuperação de senha (com Resend)
exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  db.get(`SELECT id, email FROM usuarios WHERE email = ?`, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro interno' });
    }
    if (!user) {
      // Por segurança, não revelar se o email existe
      return res.json({ message: 'Se o email existir, receberá as instruções' });
    }

    // Gerar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hora

    db.run(
      `UPDATE usuarios SET reset_token = ?, reset_expires = ? WHERE id = ?`,
      [resetToken, expiresAt.toISOString(), user.id],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao gerar token' });
        }

        // Link de redefinição (frontend)
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/resetar-senha?token=${resetToken}`;

        // Enviar email real usando Resend
        sendResetEmail(email, resetLink)
          .then(() => {
            console.log(`📧 Email de recuperação enviado para ${email}`);
          })
          .catch((emailError) => {
            console.error(`❌ Erro ao enviar email para ${email}:`, emailError);
          });

        // Fallback: mostrar link no terminal (útil para debug)
        console.log(`🔗 Link de redefinição (fallback): ${resetLink}`);

        res.json({ message: 'Se o email existir, receberá as instruções' });
      }
    );
  });
};

// Redefinir senha com token
exports.resetPassword = (req, res) => {
  const { token, novaSenha } = req.body;
  if (!token || !novaSenha) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
  }
  if (novaSenha.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }

  db.get(
    `SELECT id, reset_token, reset_expires FROM usuarios WHERE reset_token = ?`,
    [token],
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: 'Token inválido ou expirado' });
      }
      if (new Date(user.reset_expires) < new Date()) {
        return res.status(400).json({ error: 'Token expirado' });
      }

      const hashedPassword = bcrypt.hashSync(novaSenha, 10);
      db.run(
        `UPDATE usuarios SET senha = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?`,
        [hashedPassword, user.id],
        (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao atualizar senha' });
          }
          res.json({ message: 'Senha atualizada com sucesso' });
        }
      );
    }
  );
};