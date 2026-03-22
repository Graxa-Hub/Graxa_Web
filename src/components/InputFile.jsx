import React, { useState, useRef, useEffect } from "react";
import { Upload, Edit2 } from "lucide-react";

export function InputFile({
  label,
  onFileSelect,
  accept = "image/jpeg, image/png, image/webp",
  maxSize = 50 * 1024 * 1024,
  required = false,
  className = "",
  disabled,
  currentImage,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (currentImage) {
      setSelectedFile(currentImage);
      setFileName("Imagem atual");
    }
  }, [currentImage]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getAcceptedFormats = () => {
    if (accept === "image/*") return "JPEG, PNG, GIF e WebP";
    return accept.replace(/\./g, "").toUpperCase();
  };

  const handleFileSelection = (file) => {
    if (file.size > maxSize) {
      alert(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(maxSize)}`);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setSelectedFile(reader.result);
    reader.readAsDataURL(file);

    if (onFileSelect) onFileSelect(file);
  };

  const handleEdit = () => fileInputRef.current?.click();
  const handleBrowseClick = () => fileInputRef.current?.click();

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          {label}
          {required && <span className="text-[var(--accent)] ml-1">*</span>}
        </label>
      )}

      {selectedFile ? (
        <div className="relative w-full h-40 border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden bg-[var(--surface)]">
          <img src={selectedFile} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleEdit}
            disabled={disabled}
            className="absolute top-2 right-2 h-9 w-9 flex items-center justify-center rounded-full bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors disabled:opacity-50"
            title="Editar foto"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {fileName && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/45 text-white text-xs p-2 truncate">
              {fileName}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
            className="hidden"
            required={required}
            disabled={disabled}
          />
        </div>
      ) : (
        <div
          className={`border rounded-[var(--radius-md)] px-6 py-8 text-center transition-colors cursor-pointer shadow-[var(--shadow-soft)] bg-[var(--surface)] ${
            isDragOver ? "border-[var(--border-hover)] bg-[var(--surface-hover)]" : "border-[var(--border)] hover:border-[var(--border-hover)]"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files.length > 0) handleFileSelection(e.dataTransfer.files[0]);
          }}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={(e) => e.target.files?.[0] && handleFileSelection(e.target.files[0])}
            className="hidden"
            required={required}
            disabled={disabled}
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center">
              <Upload className="w-5 h-5 text-[var(--text-secondary)]" />
            </div>

            <div>
              <p className="font-medium text-[var(--text-primary)] mb-1">Escolha um arquivo ou arraste até aqui</p>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                {getAcceptedFormats()}, até {formatFileSize(maxSize)}
              </p>
            </div>

            <button
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
            >
              Procurar arquivo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
