
import React from 'react';
import { Pokemon } from '../types/pokemon';
import { PokemonCard } from './PokemonCard';

interface PokemonGridProps {
  pokemons: Pokemon[];
  onPokemonClick: (pokemon: Pokemon) => void;
  onFavoriteToggle?: () => void;
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({ 
  pokemons, 
  onPokemonClick, 
  onFavoriteToggle 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onClick={() => onPokemonClick(pokemon)}
          onFavoriteToggle={onFavoriteToggle}
        />
      ))}
    </div>
  );
};
