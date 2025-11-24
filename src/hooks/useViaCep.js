import { useState } from 'react';

export function useViaCep() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarCep = async (cep) => {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    // Valida CEP
    if (cepLimpo.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return {
        cep: data.cep,
        logradouro: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
        complemento: data.complemento || '',
      };
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.');
      console.error('Erro ao buscar CEP:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { buscarCep, loading, error };
}