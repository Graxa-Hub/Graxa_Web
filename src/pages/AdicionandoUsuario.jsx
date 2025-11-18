import React, { useEffect, useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { BandaDropdown } from "../components/BandaDropdown";
import { Settings, Camera, Volume2, Guitar } from "lucide-react";
import { useBandas } from "../hooks/useBandas";
import { imagemService } from "../services/imagemService";

// ========== COMPONENTE DE FUNÇÃO ==========
const StageCard = ({ number, title, description }) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-8 max-w-md">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
        {number}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

// ========== CARD DE ROLE ==========
const RoleCard = ({ role, isSelected, onClick }) => {
  const Icon = role.icon;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-sm p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer ${
        isSelected ? "ring-2 ring-red-300" : ""
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            isSelected ? "bg-red-50" : "bg-gray-100"
          }`}
        >
          <Icon
            className={`w-6 h-6 ${
              isSelected ? "text-red-600" : "text-gray-600"
            }`}
          />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">{role.title}</h3>
          <p className="text-sm text-gray-500">{role.description}</p>
        </div>
      </div>
    </div>
  );
};

const RolesList = ({ roles, selectedRole, onSelectRole }) => (
  <div className="space-y-4 max-w-2xl">
    {roles.map((role) => (
      <RoleCard
        key={role.id}
        role={role}
        isSelected={selectedRole === role.id}
        onClick={() => onSelectRole(role.id)}
      />
    ))}
  </div>
);

// ========== ASSOCIADO ==========
const AssociateCard = ({ associate, onSelect, isChosen }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
    <img
      src={associate.image}
      className="w-16 h-16 rounded-full object-cover"
    />

    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 text-sm">{associate.name}</h3>
      <p className="text-xs text-gray-500">{associate.role}</p>
      <p className="text-xs text-gray-400 mt-1">
        Shows realizados: {associate.shows}
      </p>
    </div>

    <button
      onClick={onSelect}
      disabled={isChosen}
      className={`px-4 py-2 text-xs rounded-full transition-colors ${
        isChosen
          ? "bg-green-600 text-white cursor-default"
          : "bg-gray-800 text-white hover:bg-gray-700"
      }`}
    >
      {isChosen ? "escolhido" : "escolher"}
    </button>
  </div>
);

// SIDEBAR
const AssociatesSidebar = ({ associates, selectedRole, onSelect, selectedAssociates }) => {
  if (!selectedRole) {
    return (
      <div className="w-96 bg-gray-50 flex items-center justify-center text-gray-500">
        Selecione uma função
      </div>
    );
  }

  return (
    <div className="w-96 bg-gray-50 flex flex-col h-screen border-l border-gray-200 px-6 py-6 overflow-y-auto">
      {associates.length === 0 ? (
        <p className="text-gray-500 text-center">
          Nenhum associado disponível
        </p>
      ) : (
        associates.map((associate, index) => {
          const isChosen =
            selectedAssociates[selectedRole]?.name === associate.name;

          return (
            <AssociateCard
              key={index}
              associate={associate}
              onSelect={() => onSelect(associate)}
              isChosen={isChosen}
            />
          );
        })
      )}
    </div>
  );
};

// ===================================================================
// =========================== PRINCIPAL ==============================
// ===================================================================

export const AdicionandoUsuarios = () => {
  const { bandas, listarBandas } = useBandas();

  const [selectedBand, setSelectedBand] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [fotosBandas, setFotosBandas] = useState({});
  const [selectedAssociates, setSelectedAssociates] = useState({});

  // ASSOCIADOS (mock)
  const associates = [
    { name: "Rafael Monteiro", role: "Produtor de Estrada", roleId: "produtor", shows: 42, image: "https://i.pravatar.cc/150?img=21" },
    { name: "Lucas Almeida", role: "Produtor de Estrada", roleId: "produtor", shows: 19, image: "https://i.pravatar.cc/150?img=22" },
    { name: "Felipe Rocha", role: "Produtor de Estrada", roleId: "produtor", shows: 37, image: "https://i.pravatar.cc/150?img=23" },
    { name: "Eduardo Ramos", role: "Técnico de Luz", roleId: "tecnico-luz", shows: 33, image: "https://i.pravatar.cc/150?img=26" },
    { name: "Henrique Santos", role: "Técnico de Luz", roleId: "tecnico-luz", shows: 15, image: "https://i.pravatar.cc/150?img=27" },
    { name: "André Paiva", role: "Técnico de Som", roleId: "tecnico-som", shows: 41, image: "https://i.pravatar.cc/150?img=31" },
    { name: "William Costa", role: "Técnico de Som", roleId: "tecnico-som", shows: 22, image: "https://i.pravatar.cc/150?img=32" },
    { name: "João Cardoso", role: "Road", roleId: "road", shows: 14, image: "https://i.pravatar.cc/150?img=38" },
    { name: "Samuel Torres", role: "Road", roleId: "road", shows: 26, image: "https://i.pravatar.cc/150?img=39" },
  ];

  const roles = [
    { id: "produtor", title: "Produtor de estrada", icon: Settings, description: "Responsável pela organização da turnê" },
    { id: "tecnico-luz", title: "Técnico de Luz", icon: Camera, description: "Responsável pela iluminação do show" },
    { id: "tecnico-som", title: "Técnico de som", icon: Volume2, description: "Responsável pelo áudio e som ao vivo" },
    { id: "road", title: "Road", icon: Guitar, description: "Auxilia no transporte e montagem dos equipamentos" },
  ];

  useEffect(() => {
    listarBandas();
  }, [listarBandas]);

  // Carregar imagens das bandas
  useEffect(() => {
    const loadImages = async () => {
      const map = {};
      for (const b of bandas) {
        if (b.nomeFoto) {
          map[b.id] = await imagemService(b.nomeFoto);
        }
      }
      setFotosBandas(map);
    };

    loadImages();
  }, [bandas]);

  // Filtro por função
  const filteredAssociates = selectedRole
    ? associates.filter((a) => a.roleId === selectedRole)
    : [];

  // Selecionar associado
  const handleSelectAssociate = (associate) => {
    setSelectedAssociates((prev) => ({
      ...prev,
      [associate.roleId]: associate,
    }));
  };

  return (
    <Layout>
      <Sidebar />

      <div className="flex h-screen w-full bg-gray-50">

        <div className="flex-1 p-10">
          {/* SELECTOR OFICIAL */}
          <BandaDropdown
            selectedBand={selectedBand}
            onBandSelect={setSelectedBand}
            showAllOption={true}
          />

          {/* ETAPA */}
          <div className="mt-10">
            <StageCard
              number="1"
              title="1ª Etapa"
              description="Escolha as pessoas que irão contribuir com esse evento"
            />
          </div>

          {/* FUNÇÕES */}
          <RolesList
            roles={roles}
            selectedRole={selectedRole}
            onSelectRole={setSelectedRole}
          />
        </div>

        {/* SIDEBAR */}
        <AssociatesSidebar
          associates={filteredAssociates}
          selectedRole={selectedRole}
          onSelect={handleSelectAssociate}
          selectedAssociates={selectedAssociates}
        />
      </div>
    </Layout>
  );
};
