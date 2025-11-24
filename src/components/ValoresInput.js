import React, { useEffect } from 'react';
import { Input } from 'antd';

const ValoresInput = ({ value = '0,00', onChange }) => {
  const formatValue = (raw) => {
    // Remove tudo que não é número
    const digitsOnly = raw.replace(/\D/g, '');

    if (!digitsOnly) return '0,00';

    const padded = digitsOnly.padStart(3, '0');

    const inteiro = padded.slice(0, -2);
    const decimal = padded.slice(-2);

    const numero = parseInt(inteiro) + parseInt(decimal) / 100;

    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero);

    return formatted;
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    const formatted = formatValue(raw);
    onChange(formatted);
  };

  // Garante valor inicial formatado ao montar
  useEffect(() => {
    if (!value || value === '') {
      onChange('0,00');
    }
  }, []);

  return (
    <Input
    maxLength={20}
      value={value}
      onChange={handleChange}
      placeholder=""
    />
  );
};

export default ValoresInput;
