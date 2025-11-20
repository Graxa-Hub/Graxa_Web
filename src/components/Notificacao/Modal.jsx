import { Footer } from "./Footer";
import { Header } from "./Header";
import { ListaNotificacao } from "./ListaNotificacao";

export const Modal = ({ isOpen, handleClose, notificacaoLista }) => {
  return (
    <>
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed top-20 right-8 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <Header handleClose={handleClose} />
            {/* Lista de notificações */}
            <ListaNotificacao notificacaoLista={notificacaoLista} />

            {/* Footer */}
            <Footer notificacaoLista={notificacaoLista} />
          </div>
        </>
      )}
    </>
  );
};
