import axios from 'axios';

// URL base de la API de Pokémon
const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

// Función para obtener un Pokémon aleatorio por ID
export const fetchRandomPokemon = async () => {
    // Generar un ID aleatorio (1 a 898, cantidad de Pokémon en la API)
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await axios.get(`${API_URL}${randomId}`);
    return response.data;
};
