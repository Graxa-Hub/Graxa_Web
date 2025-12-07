import { CloudRain } from "lucide-react";
import { useRef } from "react";

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
    anotacao: "Transfer André",
  },
  {
    id: 2,
    nome: "Montagem do palco",
    descricao: "Preparação e montagem da infraestrutura",
    anotacao: null,
  },
  {
    id: 3,
    nome: "Show da banda",
    descricao: "Apresentação dos artistas",
    anotacao: null,
  },
  {
    id: 4,
    nome: "Viagem de volta a casa",
    descricao: "Retorno do local do evento",
    anotacao:
      "Receptivo + Transfer Mini Van no Aeroporto \nAgência Solférias: Manuel Achando +351 965 060 401",
  },
];

const dadosClima = [
  {
    id: 1,
    diaSemana: "Seg",
    dia: "27",
    tempMax: 32,
    tempMin: 22,
    chuva: "tarde",
  },
  {
    id: 2,
    diaSemana: "Ter",
    dia: "28",
    tempMax: 30,
    tempMin: 21,
    chuva: "noite",
  },
  {
    id: 3,
    diaSemana: "Qua",
    dia: "29",
    tempMax: 28,
    tempMin: 19,
    chuva: "todo dia",
  },
  {
    id: 4,
    diaSemana: "Qui",
    dia: "30",
    tempMax: 31,
    tempMin: 23,
    chuva: null,
  },
  {
    id: 5,
    diaSemana: "Sex",
    dia: "01",
    tempMax: 33,
    tempMin: 24,
    chuva: "tarde",
  },
  {
    id: 6,
    diaSemana: "Sáb",
    dia: "02",
    tempMax: 29,
    tempMin: 20,
    chuva: "todo dia",
  },
  {
    id: 7,
    diaSemana: "Dom",
    dia: "03",
    tempMax: 27,
    tempMin: 18,
    chuva: "noite",
  },
];

const nomesLista = lista.map((item) => item.nome).join(", ");

export function RelatorioPage() {
  const handleGeneratePDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-blue-100/30 py-10">
      {/* Botão para gerar PDF - não aparece no PDF */}
      <div className="fixed top-4 right-4 print:hidden z-50">
        <button
          onClick={handleGeneratePDF}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg"
        >
          Gerar PDF
        </button>
      </div>

      {/* Conteúdo do PDF */}
      <div className="px-8">
        {/* Cabeçalho */}
        <div className="mb-20">
          <h1 className="text-4xl font-bold text-center mb-4">
            Título - Nome artístico
          </h1>
          <p className="text-center text-black mb-2 text-lg">
            CRONOGRAMA DE HORÁRIO
          </p>
          <p className="text-center text-red-600 font-bold mb-2 text-lg">
            DD.MM.YYYY - DIA DE SEMANA - NOME DO EVENTO
          </p>
          <p className="text-center text-blue-600 font-bold text-lg">
            NOME DO LOCAL - ENDEREÇO DO LOCAL
          </p>
        </div>

        {/* Equipe */}
        <div className="px-8 print:break-inside-avoid">
          <h1 className="text-center text-xl font-bold text-red-400 mb-10">
            EQUIPE - NOME DO EQUIPE
          </h1>
          {lista.map((item) => (
            <div className="flex gap-2 text-lg" key={item.id}>
              <p className="font-bold">{item.cargo}:</p>
              <span>{item.nome} -</span>
              <span>{item.telefone}</span>
            </div>
          ))}
          <p className="mt-5 font-bold text-lg">Banda:</p>
          <p className="text-lg">{nomesLista}</p>
        </div>

        {/* Eventos */}
        <div className="px-8 mt-20 print:break-inside-avoid print:break-before-page">
          <h1 className="text-center text-xl font-bold text-red-400 mb-10">
            CRONOGRAMA DE HORÁRIO
          </h1>
          <h2 className="text-red-600 text-lg">
            ORIGEM (IATA) X DESTINO (IATA) | TRIPULANTE
          </h2>
          <p className="font-bold bg-yellow-300 underline w-fit text-lg">
            AVIAO (CODIGO): HORARIO IATA X HORARIO IATA
          </p>
          <p className="font-bold bg-neutral-200 w-fit text-lg">
            LOC (PNR): TRIPULANTES
          </p>

          <ul className="mt-7 text-lg">
            {eventos.map((item) => (
              <li key={item.id} className="">
                <p className="whitespace-nowrap">
                  <span className="font-bold">00:00 - </span>
                  {item.descricao}
                </p>
                <p className="text-blue-400">
                  {item.anotacao != null ? <p>*{item.anotacao}</p> : null}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Hospedagem */}

        {/* DAY USE */}
        <div className="px-8 mt-20 border border-neutral-400 print:break-inside-avoid">
          <h1 className="text-center text-xl font-bold text-red-400 mb-8">
            DAY USE - CIDADE/ESTADO | HORÁRIO
            <p className="text-end font-normal justify-self-end text-base text-blue-300">
              Reserva All Included
            </p>
          </h1>
          <h2 className="underline text-lg">NOME DO LOCAL</h2>
          <h3 className="text-lg">
            <span className="font-bold">ENDEREÇO: </span>
            Rua Alguma coisa 1092 Lisboa - Portugal
          </h3>
          <h3 className="text-lg">
            <span className="font-bold">DISTÂNCIA AEROPORTO: </span>
            Distância - Tempo
          </h3>
        </div>

        {/* HOTEL */}
        <div className="px-8 mt-20 border border-neutral-400 print:break-inside-avoid">
          <h1 className="text-center text-xl font-bold text-red-400 mb-8">
            HOSPEDAGEM - ARTISTA
          </h1>
          <h2 className="underline text-lg">NOME DO LOCAL</h2>
          <h3 className="text-lg">
            <span className="font-bold">ENDEREÇO: </span>
            Rua Alguma coisa 1092 Lisboa - Portugal
          </h3>
          <h3 className="text-lg">
            <span className="font-bold">DISTÂNCIA AEROPORTO: </span>
            Distância - Tempo
          </h3>
        </div>

        {/* Clima */}
        <div className="px-8 mt-20 print:break-inside-avoid">
          <h1 className="text-center text-2xl font-bold text-red-400 mb-10">
            CLIMA DO DIA
          </h1>
          <div className="p-4 m-auto">
            <ul>
              {dadosClima.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center whitespace-nowrap mb-3"
                >
                  <p className="w-40 text-xl">
                    {item.diaSemana}. {item.dia}
                  </p>
                  <p className="w-20 text-xl whitespace-nowrap">
                    <span className="font-bold">{item.tempMax}°</span> /{" "}
                    {item.tempMin}°
                  </p>
                  <p>
                    <CloudRain className="" />
                  </p>
                  <p className="w-20 text-xl">{item.chuva}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-8 mt-20">
          <h1 className="text-center text-xl font-bold text-red-400 mb-8">
            OBSERVAÇÕES:
          </h1>
        </div>
      </div>
    </div>
  );
}

export default RelatorioPage;
