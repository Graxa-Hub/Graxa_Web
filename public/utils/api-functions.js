// Funções de API para busca de aeroportos, restaurantes e mapas

// Função para obter coordenadas de um endereço usando OpenStreetMap Nominatim
async function getCoordinates(address) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon),
                display_name: data[0].display_name
            };
        }
        throw new Error('Endereço não encontrado');
    } catch (error) {
        console.error('Erro ao obter coordenadas:', error);
        throw error;
    }
}

// Função para calcular distância entre dois pontos (fórmula de Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Função para buscar aeroportos próximos
async function buscarAeroportoReal(endereco) {
    try {
        // Obter coordenadas do endereço
        const coords = await getCoordinates(endereco);
        
        // Lista de aeroportos principais do Brasil com coordenadas
        const aeroportos = [
            { nome: "Aeroporto Internacional de São Paulo/Guarulhos", sigla: "GRU", lat: -23.4356, lon: -46.4731 },
            { nome: "Aeroporto de São Paulo/Congonhas", sigla: "CGH", lat: -23.6266, lon: -46.6554 },
            { nome: "Aeroporto Internacional do Rio de Janeiro/Galeão", sigla: "GIG", lat: -22.8099, lon: -43.2505 },
            { nome: "Aeroporto Santos Dumont", sigla: "SDU", lat: -22.9105, lon: -43.1634 },
            { nome: "Aeroporto Internacional de Brasília", sigla: "BSB", lat: -15.8711, lon: -47.9172 },
            { nome: "Aeroporto Internacional de Belo Horizonte/Confins", sigla: "CNF", lat: -19.6244, lon: -43.9719 },
            { nome: "Aeroporto Internacional de Salvador", sigla: "SSA", lat: -12.9086, lon: -38.3225 },
            { nome: "Aeroporto Internacional de Recife", sigla: "REC", lat: -8.1265, lon: -34.9236 },
            { nome: "Aeroporto Internacional de Fortaleza", sigla: "FOR", lat: -3.7763, lon: -38.5326 },
            { nome: "Aeroporto Internacional de Porto Alegre", sigla: "POA", lat: -29.9939, lon: -51.1711 }
        ];
        
        // Calcular distâncias e encontrar o mais próximo
        let aeroportoMaisProximo = null;
        let menorDistancia = Infinity;
        
        aeroportos.forEach(aeroporto => {
            const distancia = calculateDistance(coords.lat, coords.lon, aeroporto.lat, aeroporto.lon);
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                aeroportoMaisProximo = { ...aeroporto, distancia };
            }
        });
        
        if (aeroportoMaisProximo) {
            return `
                <div class="result-item">
                    <h4>${aeroportoMaisProximo.nome}</h4>
                    <p><strong>Sigla:</strong> ${aeroportoMaisProximo.sigla}</p>
                    <p><strong>Distância:</strong> ${aeroportoMaisProximo.distancia.toFixed(1)} km</p>
                    <p><strong>Endereço pesquisado:</strong> ${coords.display_name}</p>
                </div>
            `;
        } else {
            throw new Error('Nenhum aeroporto encontrado');
        }
        
    } catch (error) {
        console.error('Erro na busca de aeroporto:', error);
        throw new Error('Erro ao buscar aeroporto: ' + error.message);
    }
}

// Função para buscar restaurantes próximos usando Overpass API (OpenStreetMap)
async function buscarRestaurantesReal(endereco) {
    try {
        // Obter coordenadas do endereço
        const coords = await getCoordinates(endereco);
        
        // Buscar restaurantes próximos usando Overpass API
        const overpassQuery = `
            [out:json][timeout:25];
            (
                node["amenity"="restaurant"](around:5000,${coords.lat},${coords.lon});
                way["amenity"="restaurant"](around:5000,${coords.lat},${coords.lon});
                relation["amenity"="restaurant"](around:5000,${coords.lat},${coords.lon});
            );
            out center meta;
        `;
        
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: overpassQuery
        });
        
        const data = await response.json();
        
        if (data.elements && data.elements.length > 0) {
            // Processar e limitar a 3 restaurantes
            const restaurantes = data.elements
                .filter(element => element.tags && element.tags.name)
                .slice(0, 3)
                .map(element => {
                    const lat = element.lat || element.center?.lat;
                    const lon = element.lon || element.center?.lon;
                    const distancia = lat && lon ? calculateDistance(coords.lat, coords.lon, lat, lon) : 0;
                    
                    return {
                        nome: element.tags.name,
                        endereco: element.tags['addr:street'] && element.tags['addr:housenumber'] 
                            ? `${element.tags['addr:street']}, ${element.tags['addr:housenumber']}`
                            : 'Endereço não disponível',
                        distancia: distancia
                    };
                });
            
            if (restaurantes.length > 0) {
                return restaurantes.map(rest => `
                    <div class="result-item">
                        <h4>${rest.nome}</h4>
                        <p><strong>Endereço:</strong> ${rest.endereco}</p>
                        <p><strong>Distância:</strong> ${rest.distancia.toFixed(1)} km</p>
                    </div>
                `).join('');
            }
        }
        
        // Fallback com dados simulados se não encontrar restaurantes
        return `
            <div class="result-item">
                <h4>Restaurante Bella Vista</h4>
                <p><strong>Endereço:</strong> Rua das Flores, 123 - Centro</p>
                <p><strong>Distância:</strong> 1.2 km</p>
            </div>
            <div class="result-item">
                <h4>Pizzaria do João</h4>
                <p><strong>Endereço:</strong> Av. Principal, 456 - Jardim</p>
                <p><strong>Distância:</strong> 2.1 km</p>
            </div>
            <div class="result-item">
                <h4>Churrascaria Gaúcha</h4>
                <p><strong>Endereço:</strong> Rua do Comércio, 789 - Vila Nova</p>
                <p><strong>Distância:</strong> 3.5 km</p>
            </div>
            <p><em>Nota: Dados de exemplo para ${coords.display_name}</em></p>
        `;
        
    } catch (error) {
        console.error('Erro na busca de restaurantes:', error);
        throw new Error('Erro ao buscar restaurantes: ' + error.message);
    }
}

// Função para buscar rota entre dois endereços
async function buscarRotaReal(origem, destino) {
    try {
        // Obter coordenadas dos dois endereços
        const coordsOrigem = await getCoordinates(origem);
        const coordsDestino = await getCoordinates(destino);
        
        // Calcular distância direta
        const distancia = calculateDistance(
            coordsOrigem.lat, coordsOrigem.lon,
            coordsDestino.lat, coordsDestino.lon
        );
        
        // Estimar tempo (assumindo velocidade média de 40 km/h no trânsito urbano)
        const tempoEstimado = Math.round((distancia / 40) * 60); // em minutos
        
        // Buscar rota usando OSRM (Open Source Routing Machine)
        try {
            const routeResponse = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${coordsOrigem.lon},${coordsOrigem.lat};${coordsDestino.lon},${coordsDestino.lat}?overview=false&steps=false`
            );
            const routeData = await routeResponse.json();
            
            if (routeData.routes && routeData.routes.length > 0) {
                const route = routeData.routes[0];
                const distanciaRota = (route.distance / 1000).toFixed(1); // converter para km
                const tempoRota = Math.round(route.duration / 60); // converter para minutos
                
                return `
                    <div class="map-container">
                        <div class="map-placeholder">
                            <i class="fas fa-map-marked-alt fa-3x"></i>
                            <p>Rota de <strong>${origem}</strong> até <strong>${destino}</strong></p>
                            <p><strong>Distância:</strong> ${distanciaRota} km</p>
                            <p><strong>Tempo estimado:</strong> ${tempoRota} minutos</p>
                            <p><strong>Origem:</strong> ${coordsOrigem.display_name}</p>
                            <p><strong>Destino:</strong> ${coordsDestino.display_name}</p>
                        </div>
                    </div>
                `;
            }
        } catch (routeError) {
            console.log('Erro na API de rota, usando cálculo direto:', routeError);
        }
        
        // Fallback com cálculo direto
        return `
            <div class="map-container">
                <div class="map-placeholder">
                    <i class="fas fa-map-marked-alt fa-3x"></i>
                    <p>Rota de <strong>${origem}</strong> até <strong>${destino}</strong></p>
                    <p><strong>Distância direta:</strong> ${distancia.toFixed(1)} km</p>
                    <p><strong>Tempo estimado:</strong> ${tempoEstimado} minutos</p>
                    <p><strong>Origem:</strong> ${coordsOrigem.display_name}</p>
                    <p><strong>Destino:</strong> ${coordsDestino.display_name}</p>
                </div>
            </div>
        `;
        
    } catch (error) {
        console.error('Erro na busca de rota:', error);
        throw new Error('Erro ao buscar rota: ' + error.message);
    }
}

