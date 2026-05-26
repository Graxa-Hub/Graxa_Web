import { Camera } from "lucide-react";

export const ConfigPhoto = ({ onChange, src }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-28 h-28 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
        {src ? (
          <img
            src={src}
            className="w-full h-full object-cover"
            alt="Foto do usuário"
          />
        ) : (
          <Camera size={32} className="text-[var(--text-muted)]" />
        )}
      </div>

      <label className="cursor-pointer btn-primary inline-flex items-center gap-2">
        <Camera size={16} />
        <span>Alterar foto</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </label>
    </div>
  );
};
