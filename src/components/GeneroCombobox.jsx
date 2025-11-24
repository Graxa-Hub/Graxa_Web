import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const GENEROS = [
  // Rock e derivados
  { value: 'rock', label: 'Rock' },
  { value: 'rock_alternativo', label: 'Rock Alternativo' },
  { value: 'hard_rock', label: 'Hard Rock' },
  { value: 'punk_rock', label: 'Punk Rock' },
  { value: 'pop_rock', label: 'Pop Rock' },
  { value: 'indie_rock', label: 'Indie Rock' },
  
  // Metal
  { value: 'metal', label: 'Metal' },
  { value: 'heavy_metal', label: 'Heavy Metal' },
  { value: 'death_metal', label: 'Death Metal' },
  { value: 'black_metal', label: 'Black Metal' },
  { value: 'thrash_metal', label: 'Thrash Metal' },
  { value: 'metalcore', label: 'Metalcore' },
  
  // Pop
  { value: 'pop', label: 'Pop' },
  { value: 'synth_pop', label: 'Synth Pop' },
  { value: 'electropop', label: 'Electropop' },
  { value: 'k_pop', label: 'K-Pop' },
  
  // Eletrônica
  { value: 'eletronica', label: 'Eletrônica' },
  { value: 'house', label: 'House' },
  { value: 'techno', label: 'Techno' },
  { value: 'trance', label: 'Trance' },
  { value: 'dubstep', label: 'Dubstep' },
  { value: 'drum_and_bass', label: 'Drum and Bass' },
  { value: 'edm', label: 'EDM' },
  
  // Hip Hop e Rap
  { value: 'hip_hop', label: 'Hip Hop' },
  { value: 'rap', label: 'Rap' },
  { value: 'trap', label: 'Trap' },
  { value: 'drill', label: 'Drill' },
  
  // Brasileiros
  { value: 'mpb', label: 'MPB' },
  { value: 'samba', label: 'Samba' },
  { value: 'pagode', label: 'Pagode' },
  { value: 'bossa_nova', label: 'Bossa Nova' },
  { value: 'forro', label: 'Forró' },
  { value: 'sertanejo', label: 'Sertanejo' },
  { value: 'sertanejo_universitario', label: 'Sertanejo Universitário' },
  { value: 'funk_carioca', label: 'Funk Carioca' },
  { value: 'axe', label: 'Axé' },
  { value: 'forro_eletronico', label: 'Forró Eletrônico' },
  { value: 'piseiro', label: 'Piseiro' },
  { value: 'arrocha', label: 'Arrocha' },
  
  // Jazz e Blues
  { value: 'jazz', label: 'Jazz' },
  { value: 'blues', label: 'Blues' },
  { value: 'soul', label: 'Soul' },
  { value: 'funk', label: 'Funk' },
  { value: 'rnb', label: 'R&B' },
  
  // Clássicos e Tradicionais
  { value: 'classica', label: 'Clássica' },
  { value: 'gospel', label: 'Gospel' },
  { value: 'country', label: 'Country' },
  { value: 'folk', label: 'Folk' },
  
  // Reggae
  { value: 'reggae', label: 'Reggae' },
  { value: 'reggaeton', label: 'Reggaeton' },
  { value: 'ska', label: 'Ska' },
  
  // Outros
  { value: 'alternativo', label: 'Alternativo' },
  { value: 'indie', label: 'Indie' },
  { value: 'experimental', label: 'Experimental' },
  { value: 'instrumental', label: 'Instrumental' },
  { value: 'acustico', label: 'Acústico' },
  { value: 'lo_fi', label: 'Lo-Fi' },
  { value: 'ambiente', label: 'Ambiente' },
  { value: 'new_wave', label: 'New Wave' },
  { value: 'grunge', label: 'Grunge' },
  { value: 'emo', label: 'Emo' },
  { value: 'hardcore', label: 'Hardcore' },
  { value: 'post_rock', label: 'Post Rock' },
  { value: 'shoegaze', label: 'Shoegaze' },
  { value: 'world_music', label: 'World Music' },
  { value: 'latin', label: 'Latin' },
  { value: 'salsa', label: 'Salsa' },
  { value: 'merengue', label: 'Merengue' },
  { value: 'bachata', label: 'Bachata' },
  { value: 'flamenco', label: 'Flamenco' },
  { value: 'tango', label: 'Tango' },
].sort((a, b) => a.label.localeCompare(b.label)); // Ordem alfabética

export function GeneroCombobox({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);

  const selectedGenero = GENEROS.find(g => g.value === value);

  const filteredGeneros = GENEROS.filter(genero =>
    genero.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (generoValue) => {
    onChange(generoValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gênero Musical <span className="text-red-500">*</span>
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 flex items-center justify-between bg-white ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <span className={selectedGenero ? 'text-gray-900' : 'text-gray-400'}>
          {selectedGenero ? selectedGenero.label : 'Selecione um gênero'}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {error && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar gênero..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              autoFocus
            />
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredGeneros.length > 0 ? (
              filteredGeneros.map((genero) => (
                <button
                  key={genero.value}
                  type="button"
                  onClick={() => handleSelect(genero.value)}
                  className={`w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors text-sm ${
                    genero.value === value ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-900'
                  }`}
                >
                  {genero.label}
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                Nenhum gênero encontrado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}