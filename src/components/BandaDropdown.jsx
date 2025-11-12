import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useBandas } from '../hooks/useBandas'

export function BandaDropdown({ selectedBand, onBandSelect, showAllOption = true }) {
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
            try {
              const imageUrl = await buscarImagem(banda.nomeFoto)
              return { ...banda, imageUrl }
            } catch (error) {
              console.error('Erro ao carregar imagem da banda:', error)
              return { ...banda, imageUrl: null }
            }
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
      if (selectedBand && selectedBand.nomeFoto) {
        try {
          const imageUrl = await buscarImagem(selectedBand.nomeFoto)
          setSelectedBandImage(imageUrl)
        } catch (error) {
          console.error('Erro ao carregar imagem da banda selecionada:', error)
          setSelectedBandImage(null)
        }
      } else {
        setSelectedBandImage(null)
      }
    }

    if (selectedBand && selectedBand.nomeFoto) {
      carregarImagemSelecionada()
    }
  }, [selectedBand, buscarImagem])

  const handleBandSelect = (banda) => {
    onBandSelect(banda)
    setIsOpen(false)
  }

  // Encontra a banda selecionada ou usa "Todas as bandas" como padrão
  const getSelectedDisplay = () => {
    if (!selectedBand) {
      return { name: 'Todas as bandas', initial: 'T' }
    }
    
    return { 
      name: selectedBand.nome, 
      initial: selectedBand.nome.charAt(0).toUpperCase() 
    }
  }

  const selectedDisplay = getSelectedDisplay()

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
                  alt={selectedDisplay.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{selectedDisplay.initial}</span>
              )}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {selectedDisplay.name}
              </div>
              <div className="text-sm text-gray-500">
                {selectedBand ? 'Banda' : 'Filtro'}
              </div>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-full z-10 max-h-60 overflow-y-auto">
          {/* Opção "Todas as bandas" se showAllOption for true */}
          {showAllOption && (
            <button
              onClick={() => handleBandSelect(null)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 ${
                !selectedBand ? 'bg-gray-50' : ''
              }`}
            >
              <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold">
                T
              </div>
              <div>
                <div className="font-semibold text-gray-900">Todas as bandas</div>
                <div className="text-sm text-gray-500">Ver todas as turnês</div>
              </div>
            </button>
          )}

          {bandasComImagens.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nenhuma banda disponível
            </div>
          ) : (
            bandasComImagens.map((banda) => (
              <button
                key={banda.id}
                onClick={() => handleBandSelect(banda)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3 ${
                  selectedBand?.id === banda.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden">
                  {banda.imageUrl ? (
                    <img
                      src={banda.imageUrl}
                      alt={banda.nome}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{banda.nome.charAt(0).toUpperCase()}</span>
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