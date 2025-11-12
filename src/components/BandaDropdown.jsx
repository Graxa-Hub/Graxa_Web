import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useBandas } from '../hooks/useBandas'

export function BandaDropdown({ selectedBand, onBandSelect }) {
  const [isOpen, setIsOpen] = useState(false)
  const { bandas, loading, listarBandas, buscarImagem } = useBandas()
  const [bandasComImagens, setBandasComImagens] = useState([])
  const [selectedBandImage, setSelectedBandImage] = useState(null)

  // Carrega as bandas quando o componente montar
  useEffect(() => {
    listarBandas()
  }, [listarBandas])

  // Carrega imagens das bandas
  useEffect(() => {
    const carregarImagens = async () => {
      const bandasComImg = await Promise.all(
        bandas.map(async (banda) => {
          if (banda.nomeFoto) {
            const imageUrl = await buscarImagem(banda.nomeFoto)
            return { ...banda, imageUrl }
          }
          return { ...banda, imageUrl: null }
        })
      )
      setBandasComImagens(bandasComImg)
    }

    if (bandas.length > 0) {
      carregarImagens()
    }
  }, [bandas, buscarImagem])

  // Carrega imagem da banda selecionada
  useEffect(() => {
    const carregarImagemSelecionada = async () => {
      if (selectedBand?.nomeFoto) {
        const imageUrl = await buscarImagem(selectedBand.nomeFoto)
        setSelectedBandImage(imageUrl)
      } else {
        setSelectedBandImage(null)
      }
    }

    if (selectedBand) {
      carregarImagemSelecionada()
    }
  }, [selectedBand, buscarImagem])

  const handleBandSelect = (banda) => {
    onBandSelect(banda)
    setIsOpen(false)
  }

  if (loading) {
    return (
      <div className="max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative max-w-md min-w-110">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-lg shadow-sm p-4 w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
              {selectedBandImage ? (
                <img
                  src={selectedBandImage}
                  alt={selectedBand?.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{selectedBand?.nome?.charAt(0) || 'B'}</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {selectedBand?.nome || 'Selecione uma banda'}
              </div>
              <div className="text-sm text-gray-500">Banda</div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-full z-10 max-h-60 overflow-y-auto">
          {bandasComImagens.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nenhuma banda disponível
            </div>
          ) : (
            bandasComImagens.map((banda) => (
              <button
                key={banda.id}
                onClick={() => handleBandSelect(banda)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                  {banda.imageUrl ? (
                    <img
                      src={banda.imageUrl}
                      alt={banda.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{banda.nome.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{banda.nome}</div>
                  <div className="text-sm text-gray-500">Banda</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}