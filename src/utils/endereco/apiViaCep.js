

export function isCep(valor) {
  if (!valor) return false;
  const trimmed = valor.trim();
  const semPrefixo = trimmed.replace(/^cep\s*:?\s*/i, "");
  // Só aceita como CEP se não tiver letras (apenas dígitos, espaços e hífen)
  if (!/^[\d\s\-]+$/.test(semPrefixo)) return false;
  return semPrefixo.replace(/\D/g, "").length === 8;
}

export async function buscarCep(cep) {
  const url = `https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.erro) throw new Error("CEP não encontrado");

    const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}, Brasil`;

    return {
      tipo: "cep",
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
      pais: "Brasil",
      enderecoCompleto,
      enderecoParaBusca: `${data.logradouro}, ${data.localidade} - ${data.uf}`,
    };
  } catch (err) {
    console.error("Erro ViaCEP:", err);
    throw err;
  }
}
