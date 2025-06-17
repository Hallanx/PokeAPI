
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { PokemonService } from '../services/pokemonService';
import { FavoritesService } from '../services/favoritesService';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Heart, HeartOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      loadPokemon(id);
      setIsFavorite(FavoritesService.isFavorite(parseInt(id)));
    }
  }, [id]);

  const loadPokemon = async (pokemonId: string) => {
    try {
      setLoading(true);
      const pokemonData = await PokemonService.getPokemon(pokemonId);
      setPokemon(pokemonData);
    } catch (error) {
      console.error('Error loading pokemon:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar os detalhes do Pokémon.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = () => {
    if (pokemon) {
      const newFavoriteStatus = FavoritesService.toggleFavorite(pokemon.id);
      setIsFavorite(newFavoriteStatus);
      
      toast({
        title: newFavoriteStatus ? "Adicionado aos favoritos!" : "Removido dos favoritos",
        description: `${pokemon.name} ${newFavoriteStatus ? 'foi adicionado aos' : 'foi removido dos'} seus favoritos.`,
      });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Pokémon não encontrado</h2>
          <Button onClick={() => navigate('/')}>Voltar à lista</Button>
        </div>
      </div>
    );
  }

  const maxStat = Math.max(...pokemon.stats.map(stat => stat.base_stat));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={handleFavoriteToggle}
            className="flex items-center gap-2"
          >
            {isFavorite ? <Heart className="w-4 h-4 fill-current" /> : <HeartOff className="w-4 h-4" />}
            {isFavorite ? 'Favorito' : 'Adicionar aos Favoritos'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagem e Informações Básicas */}
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold capitalize mb-2">
                {pokemon.name}
              </CardTitle>
              <div className="flex justify-center gap-2 mb-4">
                {pokemon.types.map((type) => (
                  <Badge 
                    key={type.type.name}
                    className="capitalize"
                    style={{ 
                      backgroundColor: PokemonService.getTypeColor(type.type.name),
                      color: 'white'
                    }}
                  >
                    {type.type.name}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <img
                src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-64 h-64 mx-auto mb-4"
              />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Altura</p>
                  <p>{pokemon.height / 10} m</p>
                </div>
                <div>
                  <p className="font-semibold">Peso</p>
                  <p>{pokemon.weight / 10} kg</p>
                </div>
                <div>
                  <p className="font-semibold">Experiência Base</p>
                  <p>{pokemon.base_experience}</p>
                </div>
                <div>
                  <p className="font-semibold">ID</p>
                  <p>#{pokemon.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="capitalize font-medium">
                      {stat.stat.name.replace('special-', 'sp. ')}
                    </span>
                    <span className="font-bold">{stat.base_stat}</span>
                  </div>
                  <Progress 
                    value={(stat.base_stat / maxStat) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Habilidades */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <Badge 
                  key={ability.ability.name}
                  variant="secondary"
                  className="capitalize"
                >
                  {ability.ability.name.replace('-', ' ')}
                  {ability.is_hidden && ' (Oculta)'}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sprites Adicionais */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Imagens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pokemon.sprites.front_default && (
                <div className="text-center">
                  <img 
                    src={pokemon.sprites.front_default} 
                    alt={`${pokemon.name} frente`}
                    className="w-24 h-24 mx-auto"
                  />
                  <p className="text-sm mt-2">Frente</p>
                </div>
              )}
              {pokemon.sprites.back_default && (
                <div className="text-center">
                  <img 
                    src={pokemon.sprites.back_default} 
                    alt={`${pokemon.name} costas`}
                    className="w-24 h-24 mx-auto"
                  />
                  <p className="text-sm mt-2">Costas</p>
                </div>
              )}
              {pokemon.sprites.front_shiny && (
                <div className="text-center">
                  <img 
                    src={pokemon.sprites.front_shiny} 
                    alt={`${pokemon.name} shiny frente`}
                    className="w-24 h-24 mx-auto"
                  />
                  <p className="text-sm mt-2">Shiny Frente</p>
                </div>
              )}
              {pokemon.sprites.back_shiny && (
                <div className="text-center">
                  <img 
                    src={pokemon.sprites.back_shiny} 
                    alt={`${pokemon.name} shiny costas`}
                    className="w-24 h-24 mx-auto"
                  />
                  <p className="text-sm mt-2">Shiny Costas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
