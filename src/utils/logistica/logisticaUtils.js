// =====================================================
// 🔥 NORMALIZADORES — garantem compatibilidade com o frontend
// =====================================================

// HOTEL
export function normalizarHotel(h) {
  return {
    id: h.id,
    nome: h.nomeHotel || "",
    endereco: h.endereco || "",
    latitude: h.latitude || null,
    longitude: h.longitude || null,
    distanciaPalcoKm: h.distanciaPalcoKm ?? null,
    distanciaAeroportoKm: h.distanciaAeroportoKm ?? null,

    checkin: h.checkin ? h.checkin.substring(0, 16) : "",
    checkout: h.checkout ? h.checkout.substring(0, 16) : "",

    hospedes: [h.colaborador?.id] // 🔥 transforma cada item do banco em 1 hóspede
  };
}

// VOO
export function normalizarVoo(v) {
  return {
    id: v.id,

    cia: v.ciaAerea || "",
    numero: v.codigoVoo || "",
    origem: v.origem || "",
    destino: v.destino || "",

    saida: v.partida ? v.partida.substring(0, 16) : "",
    chegada: v.chegada ? v.chegada.substring(0, 16) : "",

    passageiros: [v.colaborador?.id] // 🔥 transforma 1 registro → passageiro único
  };
}

// TRANSPORTE
export function normalizarTransporte(t) {
  return {
    id: t.id,

    tipo: t.tipo || "",
    saida: t.saida ? t.saida.substring(0, 16) : "",
    chegada: "", // não existe no backend
    destino: t.destino || "",
    responsavel: t.motorista || "",
    observacao: t.observacao || "",

    passageiros: [t.colaborador?.id]
  };
}


// =====================================================
// 🔥 AGRUPADORES — juntam registros iguais (hospedagem / voo / transporte)
// =====================================================

export function agruparHoteis(lista) {
  if (!lista || lista.length === 0) return [];

  const mapa = {};

  lista.forEach(h => {
    const nome = h.nomeHotel || "";
    const endereco = h.endereco || "";
    const latitude = h.latitude || "";
    const longitude = h.longitude || "";

    const key = `${nome}|${endereco}|${latitude}|${longitude}`;

    if (!mapa[key]) {
      mapa[key] = {
        id: h.id,
        nome: h.nomeHotel || "",
        endereco: h.endereco || "",
        latitude: h.latitude || null,
        longitude: h.longitude || null,
        distanciaPalcoKm: h.distanciaPalcoKm || 0,
        distanciaAeroportoKm: h.distanciaAeroportoKm || 0,
        checkin: h.checkin ? h.checkin.substring(0, 16) : "",
        checkout: h.checkout ? h.checkout.substring(0, 16) : "",
        hospedes: []
      };
    }

    mapa[key].hospedes.push(h.colaboradorId);
  });

  return Object.values(mapa);
}


export function agruparVoos(lista) {
  if (!lista || lista.length === 0) return [];

  const mapa = {};

  lista.forEach(v => {
    const key =
      `${v.ciaAerea}|${v.codigoVoo}|${v.origem}|${v.destino}|${v.partida}|${v.chegada}`;

    if (!mapa[key]) {
      mapa[key] = {
        id: v.id,
        cia: v.ciaAerea || "",
        numero: v.codigoVoo || "",
        origem: v.origem || "",
        destino: v.destino || "",
        saida: v.partida ? v.partida.substring(0, 16) : "",
        chegada: v.chegada ? v.chegada.substring(0, 16) : "",
        passageiros: []
      };
    }

    mapa[key].passageiros.push(v.colaboradorId);
  });

  return Object.values(mapa);
}


export function agruparTransportes(lista) {
  if (!lista || lista.length === 0) return [];

  const mapa = {};

  lista.forEach(t => {
    const key =
      `${t.tipo}|${t.saida}|${t.destino}|${t.motorista}|${t.observacao}`;

    if (!mapa[key]) {
      mapa[key] = {
        id: t.id,
        tipo: t.tipo || "",
        saida: t.saida ? t.saida.substring(0, 16) : "",
        chegada: "", // backend não possui
        destino: t.destino || "",
        responsavel: t.motorista || "",
        observacao: t.observacao || "",
        passageiros: []
      };
    }

    mapa[key].passageiros.push(t.colaboradorId);
  });

  return Object.values(mapa);
}

