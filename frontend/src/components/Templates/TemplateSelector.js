import React from 'react';
import { Flower2, Sparkles, Heart, Leaf, Church } from 'lucide-react';
import './Templates.css';

const templates = [
  { id: 'classico', nome: 'Clássico', icon: <Flower2 size={24} />, descricao: 'Elegante e atemporal' },
  { id: 'moderno', nome: 'Moderno', icon: <Sparkles size={24} />, descricao: 'Minimalista e clean' },
  { id: 'romantico', nome: 'Romântico', icon: <Heart size={24} />, descricao: 'Delicado e amoroso' },
  { id: 'natureza', nome: 'Natureza', icon: <Leaf size={24} />, descricao: 'Rústico e natural' },
  { id: 'religioso', nome: 'Religioso', icon: <Church size={24} />, descricao: 'Clássico e solene' },
];

const TemplateSelector = ({ selected, onSelect }) => {
  return (
    <div className="template-selector">
      <label className="template-label">Escolha um modelo de convite</label>
      <div className="template-options">
        {templates.map(template => (
          <button
            key={template.id}
            className={`template-option ${selected === template.id ? 'active' : ''}`}
            onClick={() => onSelect(template.id)}
          >
            <span className="template-icon">{template.icon}</span>
            <span className="template-name">{template.nome}</span>
            <span className="template-desc">{template.descricao}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;