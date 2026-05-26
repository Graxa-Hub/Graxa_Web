import React, { useState, useRef } from "react";
import { Upload, Camera } from "lucide-react";

export const InputFile = ({
  label,
  required,
  value,
  onChange,
  accept = "image/*",
  disabled = false,
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onChange?.({ target: { files: [file] } });
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
          {label}
          {required && <span className="text-[var(--accent)] ml-1">*</span>}
        </label>
      )}
      {value ? (
        <div className="relative w-full h-40 border border-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden group">
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="absolute top-2 right-2 h-9 w-9 flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors disabled:opacity-50"
          >
            <Camera size={15} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/45 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
            {typeof value === "string"
              ? value.split("/").pop()
              : "Imagem carregada"}
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-[var(--radius-sm)] px-10 py-8 text-center transition-colors cursor-pointer ${isDragging ? "border-[var(--accent)] bg-[rgba(200,80,60,0.05)]" : "border-[var(--border)] hover:border-[var(--border-hover)]"}`}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center mx-auto mb-3">
            <Upload className="w-5 h-5 text-[var(--text-muted)]" />
          </div>
          <p className="font-medium text-[var(--text-secondary)] mb-1 text-sm">
            Arraste e solte ou clique para selecionar
          </p>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            PNG, JPG, WEBP até 5MB
          </p>
          <button
            type="button"
            className="btn-secondary px-4 py-1.5 text-sm rounded-[var(--radius-sm)]"
            onClick={(e) => e.stopPropagation()}
          >
            Escolher arquivo
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />
      {error && <p className="mt-1 text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
};
export default InputFile;
