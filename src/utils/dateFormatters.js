// src/utils/dateFormatters.js
export const formatarData = (data) => {
  if (!(data instanceof Date)) return "";
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

export const formatarHora = (data) => {
  if (!(data instanceof Date)) return "";
  const hora = String(data.getHours()).padStart(2, '0');
  const minuto = String(data.getMinutes()).padStart(2, '0');
  return `${hora}:${minuto}`;
};