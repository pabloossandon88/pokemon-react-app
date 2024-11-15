// src/services/pokemonService.ts
import axios from 'axios';
import { Pokemon } from '../types/Pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export const fetchRandomPokemon = async (): Promise<Pokemon> => {
    try {
        const randomId = Math.floor(Math.random() * 898) + 1;
        const response = await axios.get<Pokemon>(`${API_BASE_URL}/${randomId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        throw error;
    }
};
