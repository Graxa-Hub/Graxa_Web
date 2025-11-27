const lista = [
  {
    id: 1,
    nome: "João Silva",
    telefone: "(11) 98765-4321",
    cargo: "Produtor",
  },
  {
    id: 2,
    nome: "Maria Santos",
    telefone: "(11) 99876-5432",
    cargo: "Assistente de Produção",
  },
  {
    id: 3,
    nome: "Pedro Oliveira",
    telefone: "(11) 97654-3210",
    cargo: "Técnico de Som",
  },
  {
    id: 4,
    nome: "Ana Costa",
    telefone: "(11) 98765-4321",
    cargo: "Coordenadora",
  },
  {
    id: 5,
    nome: "Carlos Ferreira",
    telefone: "(11) 99654-3210",
    cargo: "Segurança",
  },
];

const eventos = [
  {
    id: 1,
    nome: "Viagem",
    descricao: "Deslocamento para o local do evento",
  },
  {
    id: 2,
    nome: "Montagem do palco",
    descricao: "Preparação e montagem da infraestrutura",
  },
  {
    id: 3,
    nome: "Show da banda",
    descricao: "Apresentação dos artistas",
  },
  {
    id: 4,
    nome: "Viagem de volta a casa",
    descricao: "Retorno do local do evento",
  },
];

const nomesLista = lista.map((item) => item.nome).join(", ");

export function RelatorioPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Cabeçalho */}
      <div className="mb-20">
        <h1 className="text-3xl font-bold text-center mb-4">
          Título - Nome artístico
        </h1>
        <p className="text-center text-black mb-2">CRONOGRAMA DE HORÁRIO</p>
        <p className="text-center text-red-600 font-bold mb-2">
          DD.MM.YYYY - DIA DE SEMANA - NOME DO EVENTO
        </p>
        <p className="text-center text-blue-600 font-bold">
          NOME DO LOCAL - ENDEREÇO DO LOCAL
        </p>
      </div>

      {/* Equipe */}
      <div className="px-8">
        <h1 className="text-center text-lg font-bold text-red-400 mb-10">
          EQUIPE - NOME DO EQUIPE
        </h1>
        {lista.map((item) => (
          <div className="flex gap-2" key={item.id}>
            <p className="font-bold">{item.cargo}:</p>
            <span>{item.nome} -</span>
            <span>{item.telefone}</span>
          </div>
        ))}
        <p className="mt-5 font-bold">Banda:</p>
        <p className="">{nomesLista}</p>
      </div>

      {/* Clima */}
      <div className="px-8 mt-20">
        <h1 className="text-center text-lg font-bold text-red-400 mb-10">
          CLIMA DO DIA
        </h1>
        <div className="w-full p-4 py-2 bg-blue-100">
          <ul>
            <li>Exemplo - 1</li>
            <li>Exemplo - 2</li>
            <li>Exemplo - 3</li>
            <li>Exemplo - 4</li>
          </ul>
        </div>
      </div>

      {/* Eventos */}
      <div className="px-8 mt-20">
        <h1 className="text-center text-lg font-bold text-red-400 mb-10">
          CRONOGRAMA DE HORÁRIO
        </h1>
        <h2>ORIGEM (IATA) X DESTINO (IATA) | TRIPULANTE</h2>
        <p>AVIAO (CODIGO): HORARIO IATA X HORARIO IATA</p>
        <p>LOC (PNR): TRIPULANTES</p>

        <ul className="mt-7">
          {eventos.map((item) => (
            <li key={item.id}>
              <p>00:00 {item.descricao}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Hospedagem */}

      {/* DAY USE */}
      <div className="px-8 mt-20 border border-neutral-400">
        <h1 className="text-center text-lg font-bold text-red-400 mb-8">
          DAY USE - CIDADE/ESTADO | HORÁRIO
          <p className="text-end font-normal justify-self-end text-sm text-blue-300">
            Reserva All Included
          </p>
        </h1>
        <h2 className="underline">NOME DO LOCAL</h2>
        <h3>
          <span className="font-bold">ENDEREÇO: </span>
          Rua Alguma coisa 1092 Lisboa - Portugal
        </h3>
        <h3>
          <span className="font-bold">DISTÂNCIA AEROPORTO: </span>
          Distância - Tempo
        </h3>
      </div>

      {/* HOTEL */}
      <div className="px-8 mt-20 border border-neutral-400">
        <h1 className="text-center text-lg font-bold text-red-400 mb-8">
          HOSPEDAGEM - ARTISTA
        </h1>
        <h2 className="underline">NOME DO LOCAL</h2>
        <h3>
          <span className="font-bold">ENDEREÇO: </span>
          Rua Alguma coisa 1092 Lisboa - Portugal
        </h3>
        <h3>
          <span className="font-bold">DISTÂNCIA AEROPORTO: </span>
          Distância - Tempo
        </h3>
      </div>
    </div>
  );
}

export default RelatorioPage;
