
import React from 'react';
import { Pokemon } from '../types/pokemon';
import { FavoritesService } from '../services/favoritesService';
import { PokemonService } from '../services/pokemonService';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, HeartOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
  onFavoriteToggle?: () => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  onClick, 
  onFavoriteToggle 
}) => {
  const { toast } = useToast();
  const isFavorite = FavoritesService.isFavorite(pokemon.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavoriteStatus = FavoritesService.toggleFavorite(pokemon.id);
    
    toast({
      title: newFavoriteStatus ? "Adicionado aos favoritos!" : "Removido dos favoritos",
      description: `${pokemon.name} ${newFavoriteStatus ? 'foi adicionado aos' : 'foi removido dos'} seus favoritos.`,
    });

    if (onFavoriteToggle) {
      onFavoriteToggle();
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <CardContent className="p-4" onClick={onClick}>
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-0 right-0 z-10"
            onClick={handleFavoriteClick}
          >
            {isFavorite ? (
              <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            ) : (
              <HeartOff className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
            )}
          </Button>
          
          <div className="text-center">
            <img
              src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-32 h-32 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            
            <h3 className="text-lg font-bold capitalize mb-2 text-gray-800">
              {pokemon.name}
            </h3>
            
            <p className="text-sm text-gray-500 mb-3">
              #{pokemon.id.toString().padStart(3, '0')}
            </p>
            
            <div className="flex justify-center gap-1 flex-wrap">
              {pokemon.types.map((type) => (
                <Badge
                  key={type.type.name}
                  className="text-xs capitalize text-white"
                  style={{ 
                    backgroundColor: PokemonService.getTypeColor(type.type.name) 
                  }}
                >
                  {type.type.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
