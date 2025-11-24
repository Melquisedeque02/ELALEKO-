export default function formatarValor(valor) {
  if (typeof valor !== 'number') valor = parseFloat(valor);
  if (isNaN(valor)) return '0,00';
  
  return valor
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
