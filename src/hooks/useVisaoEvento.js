import { useEffect, useState } from "react";
import { getVisaoDoShow } from "../services/visaoEventoService";

export function useVisaoEvento(id) {
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const resp = await getVisaoDoShow(id);
        setEvento(resp.data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar visão do evento.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  return { evento, loading, erro };
}
