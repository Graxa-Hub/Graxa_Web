
function tratarCPF(cpf){
    if(validarCPF(cpf)){
        return limparCampoNumerico(cpf)
    }else{
        return "CPF Inválido"
    }
}

 function validarCPF(cpf) {
  if (!cpf) return false;

  cpf = limparCampoNumerico(cpf);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  const calcularDigito = (cpfSlice) => {
    let soma = 0;
    for (let i = 0; i < cpfSlice.length; i++) {
      soma += parseInt(cpfSlice[i]) * ((cpfSlice.length + 1) - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const digito1 = calcularDigito(cpf.slice(0, 9));
  const digito2 = calcularDigito(cpf.slice(0, 9) + digito1);

  return digito1 === parseInt(cpf[9]) && digito2 === parseInt(cpf[10]);
}

function limparCampoNumerico(valorParaLimpar) { 
    return valorParaLimpar.replace(/\D/g, ''); 
}

function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email); 
}
function isPreenchido(items = []) {
  return items.every(item => {
    if (item == null) return false;              // null ou undefined
    if (typeof item === 'string') return item.trim() !== ''; // string não vazia
    if (typeof item === 'number') return !isNaN(item);      // número válido
    if (Array.isArray(item)) return item.length > 0;        // array não vazio
    if (typeof item === 'object') return Object.keys(item).length > 0; // objeto não vazio
    return true; // booleanos ou outros tipos
  });
}