export const GENEROS = [
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
].sort((a, b) => a.label.localeCompare(b.label));