import React, { useState, useRef, useEffect } from 'react'
import { Upload, Edit2 } from 'lucide-react'

export function InputFile({ 
  label, 
  onFileSelect, 
  accept = "image/*",
  maxSize = 50 * 1024 * 1024, // 50MB default
  required = false,
  className = "",
  disabled,
  currentImage
}) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)

  // Atualiza o preview quando currentImage mudar
  useEffect(() => {
    if (currentImage) {
      setSelectedFile(currentImage)
      setFileName('Imagem atual')
    }
  }, [currentImage])

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getAcceptedFormats = () => {
    if (accept === "image/*") {
      return "JPEG, PNG, GIF, and WebP formats"
    }
    return accept.replace(/\./g, '').toUpperCase()
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = (file) => {
    if (file.size > maxSize) {
      alert(`Arquivo muito grande. Tamanho máximo: ${formatFileSize(maxSize)}`)
      return
    }

    setFileName(file.name)
    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedFile(reader.result)
    }
    reader.readAsDataURL(file)

    if (onFileSelect) {
      onFileSelect(file)
    }
  }

  const handleEdit = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      handleFileSelection(files[0])
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {selectedFile ? (
        <div className="relative w-full h-40 border-2 border-gray-300 rounded-lg overflow-hidden group">
          <img
            src={selectedFile}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleEdit}
            disabled={disabled}
            className="absolute top-2 right-2 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 shadow-md"
            title="Editar foto"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {fileName && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
              {fileName}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            required={required}
            disabled={disabled}
          />
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer shadow-lg bg-white ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInputChange}
            className="hidden"
            required={required}
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-fit rounded-full bg-gray-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-500" />
            </div>
            
            <div>
              <p className="font-medium text-gray-700 mb-1">
                Choose a file or drag & drop it here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {getAcceptedFormats()}, up to {formatFileSize(maxSize)}
              </p>
            </div>
            
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                handleBrowseClick()
              }}
            >
              Browse File
            </button>
          </div>
        </div>
      )}
    </div>
  )
}