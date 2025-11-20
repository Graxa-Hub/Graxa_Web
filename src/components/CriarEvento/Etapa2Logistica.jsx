import React from "react";
import HotelCard from "./cards/HotelCard";
import FlightCard from "./cards/FlightCard";
import TransporteCard from "./cards/TransporteCard";

const Etapa2Logistica = ({
  hotels,
  flights,
  transports,
  setHotels,
  setFlights,
  setTransports,
  colaboradores
}) => {
  return (
    <div className="space-y-10">

      {/* HOSPEDAGEM */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Hospedagem</h2>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() =>
            setHotels([
              ...hotels,
              {
                id: Date.now(),
                nome: "",
                endereco: "",
                checkin: "",
                checkout: "",
                distanciaAeroporto: "",
                distanciaPalco: "",
                hospedes: []
              }
            ])
          }
        >
          Adicionar Hotel
        </button>

        <div className="mt-4 grid md:grid-cols-2 gap-6">
          {hotels.map((hotel, index) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              colaboradores={colaboradores}
              onChange={(updated) => {
                const newList = [...hotels];
                newList[index] = updated;
                setHotels(newList);
              }}
            />
          ))}
        </div>
      </section>

      {/* VOOS */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Voos da Equipe</h2>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() =>
            setFlights([
              ...flights,
              {
                id: Date.now(),
                cia: "",
                numero: "",
                origem: "",
                destino: "",
                saida: "",
                chegada: "",
                passageiros: []
              }
            ])
          }
        >
          Adicionar Voo
        </button>

        <div className="mt-4 space-y-6">
          {flights.map((flight, index) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              colaboradores={colaboradores}
              onChange={(updated) => {
                const newList = [...flights];
                newList[index] = updated;
                setFlights(newList);
              }}
            />
          ))}
        </div>
      </section>

      {/* TRANSPORTES */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Transportes</h2>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
          onClick={() =>
            setTransports([
              ...transports,
              {
                id: Date.now(),
                tipo: "",
                saida: "",
                chegada: "",
                responsavel: "",
                passageiros: [],
                observacao: ""
              }
            ])
          }
        >
          Adicionar Transporte
        </button>

        <div className="mt-4 space-y-6">
          {transports.map((t, index) => (
            <TransporteCard
              key={t.id}
              transporte={t}
              colaboradores={colaboradores}
              onChange={(updated) => {
                const newList = [...transports];
                newList[index] = updated;
                setTransports(newList);
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Etapa2Logistica;
