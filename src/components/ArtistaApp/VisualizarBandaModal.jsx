import { Modal } from "../Modal";

export function VisualizarBandaModal({ banda, onClose }) {
  if (!banda) return null;
  return (
    <Modal
      isOpen={!!banda}
      onClose={onClose}
      title={`Detalhes da banda: ${banda.nome}`}
      showFooter={false}
    >
      <div className="space-y-4 p-4 flex flex-col items-center">
        {banda.imagemUrl && (
          <img src={banda.imagemUrl} alt={banda.nome} className="w-48 h-48 object-cover rounded mb-2" />
        )}
        <p><strong>Nome:</strong> {banda.nome}</p>
        <p><strong>Descrição:</strong> {banda.descricao}</p>
        <p><strong>Gênero:</strong> {banda.genero}</p>
        <p><strong>Representante:</strong> {banda.representante?.nome || "N/A"}</p>
        <p><strong>Integrantes:</strong></p>
        <ul className="list-disc ml-6">
          {Array.isArray(banda.integrantes) && banda.integrantes.length > 0 ? (
            banda.integrantes.map((int) => (
              <li key={int.id || int.nome}>
                {int.nome} {int.cpf ? `(${int.cpf})` : ""}
              </li>
            ))
          ) : (
            <li className="text-gray-400">Nenhum integrante cadastrado</li>
          )}
        </ul>
      </div>
    </Modal>
  );
}