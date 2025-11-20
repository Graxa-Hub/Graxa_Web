import React from "react";

const HotelCard = ({ hotel, colaboradores, onChange }) => {
  const updateField = (field, value) => {
    onChange({ ...hotel, [field]: value });
  };

  const toggleHospede = (id) => {
    const jaTem = hotel.hospedes.includes(id);
    let novaLista;

    if (jaTem) {
      novaLista = hotel.hospedes.filter((h) => h !== id);
    } else {
      novaLista = [...hotel.hospedes, id];
    }

    updateField("hospedes", novaLista);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 className="font-semibold text-gray-900">Hotel</h3>

      <input
        className="w-full p-2 border rounded"
        placeholder="Nome do hotel"
        value={hotel.nome}
        onChange={(e) => updateField("nome", e.target.value)}
      />

      <input
        className="w-full p-2 border rounded"
        placeholder="Endereço"
        value={hotel.endereco}
        onChange={(e) => updateField("endereco", e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm">Check-in</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-2 border rounded"
            value={hotel.checkin}
            onChange={(e) => updateField("checkin", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Check-out</label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-2 border rounded"
            value={hotel.checkout}
            onChange={(e) => updateField("checkout", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-sm">Distância para o aeroporto (km)</label>
        <input
          className="w-full p-2 border rounded mt-1"
          value={hotel.distanciaAeroporto}
          onChange={(e) => updateField("distanciaAeroporto", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm">Distância para o palco (km)</label>
        <input
          className="w-full p-2 border rounded mt-1"
          value={hotel.distanciaPalco}
          onChange={(e) => updateField("distanciaPalco", e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm block mb-2">Hóspedes</label>

        <div className="space-y-1">
          {colaboradores.map((c) => {
            const selected = hotel.hospedes.includes(c.id);

            return (
              <button
                key={c.id}
                onClick={() => toggleHospede(c.id)}
                className={`w-full flex justify-between p-2 border rounded ${
                  selected ? "bg-green-100 border-green-500" : "bg-gray-50"
                }`}
              >
                <span>{c.nome}</span>
                {selected && <span className="text-green-600 font-bold">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
