
import { Pokemon, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonService {
  static async getPokemonList(offset: number = 0, limit: number = 20): Promise<PokemonListResponse> {
    const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch Pokemon list');
    }
    return response.json();
  }

  static async getPokemon(nameOrId: string | number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${nameOrId}`);
    }
    return response.json();
  }

  static async getPokemonDetails(pokemon: { name: string; url: string }): Promise<Pokemon> {
    const response = await fetch(pokemon.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon details: ${pokemon.name}`);
    }
    return response.json();
  }

  static getPokemonIdFromUrl(url: string): number {
    const matches = url.match(/\/pokemon\/(\d+)\//);
    return matches ? parseInt(matches[1]) : 0;
  }

  static getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return typeColors[type] || '#68A090';
  }
}
