import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';
import { Sparkles, Loader } from 'lucide-react';
import './CriarTemplateIAPage.css';

const CriarTemplateIAPage = () => {
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [templateGerado, setTemplateGerado] = useState(null);
  const navigate = useNavigate();

  const handleGerar = async () => {
    if (!descricao.trim()) {
      setErro('Por favor, descreva o estilo desejado');
      return;
    }
    
    setLoading(true);
    setErro('');
    setTemplateGerado(null);
    
    try {
      const result = await ApiService.gerarTemplateIA(descricao);
      setTemplateGerado(result);
    } catch (error) {
      setErro(error.message || 'Erro ao gerar template');
    } finally {
      setLoading(false);
    }
  };

  const handleUsarTemplate = () => {
    // Salvar template no localStorage ou contexto para usar no criarPage
    localStorage.setItem('template_ia_gerado', JSON.stringify(templateGerado));
    navigate('/criar');
  };

  return (
    <div className="criar-template-ia-page">
      <div className="container">
        <h1><Sparkles size={28} /> Criar Template com IA</h1>
        <p>Descreva o estilo de convite que deseja e a IA criará um template único para si.</p>

        <div className="descricao-area">
          <label>Descrição do estilo</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Casamento rústico com tons de verde e folhas, estilo vintage e elegante..."
            rows={4}
          />
          <button onClick={handleGerar} disabled={loading} className="btn-gerar">
            {loading ? <Loader className="spinner" /> : <Sparkles size={18} />}
            {loading ? 'Gerando...' : 'Gerar Template com IA'}
          </button>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        {templateGerado && (
          <div className="template-preview">
            <h3> Template Gerado</h3>
            <div dangerouslySetInnerHTML={{ __html: templateGerado.html_css }} />
            <div className="preview-note">
               Esta é uma simulação. Na versão final, a imagem será gerada por IA real.
            </div>
            <div className="acoes">
              <button onClick={handleUsarTemplate} className="btn-usar">
                Usar este template
              </button>
              <button onClick={() => setTemplateGerado(null)} className="btn-novo">
                Gerar outro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CriarTemplateIAPage;