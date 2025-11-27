import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const UserConfigModal = ({ open, onClose }) => {
  const { usuario, token, loginToContext } = useAuth();
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    if (usuario) {
      setForm({ nome: usuario.nome || '', email: usuario.email || '', telefone: usuario.telefone || '' });
      // se o usuário tiver url de foto, usa como preview
      if (usuario.urlFoto) setImagePreview(usuario.urlFoto);
    }
  }, [open, usuario]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // somente front: atualiza contexto e localStorage
    const updated = { ...usuario, ...form };
    // se houver imagem selecionada, adiciona um placeholder (front-only)
    if (imageFile) {
      updated.urlFoto = imagePreview; // preview URL (blob) — front-only
    }
    loginToContext({ token: token, usuario: updated });
    if (onClose) onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Editar perfil</h3>
        <form onSubmit={handleSave} className="md:flex md:gap-6">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current && fileRef.current.click()}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current && fileRef.current.click()}
              className="h-40 w-40 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center cursor-pointer"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="h-full w-full object-cover" />
              ) : (
                <div className="text-gray-500">Foto</div>
              )}
            </div>
            <input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={handleFile} />
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <label className="block text-sm">Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} className="w-full border rounded p-2 mt-1" />
            </div>

            <div className="mb-3">
              <label className="block text-sm">E-mail</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded p-2 mt-1" />
            </div>

            <div className="mb-3">
              <label className="block text-sm">Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handleChange} className="w-full border rounded p-2 mt-1" />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded border">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Salvar</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserConfigModal;
