
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pokemon } from '../types/pokemon';
import { PokemonService } from '../services/pokemonService';
import { FavoritesService } from '../services/favoritesService';
import { PokemonGrid } from '../components/PokemonGrid';
import { Pagination } from '../components/Pagination';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 20;

export const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [favoritePokemons, setFavoritePokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadPokemons();
  }, [currentPage]);

  useEffect(() => {
    if (activeTab === 'favorites') {
      loadFavoritePokemons();
    }
  }, [activeTab]);

  const loadPokemons = async () => {
    try {
      setLoading(true);
      const offset = (currentPage - 1) * ITEMS_PER_PAGE;
      const listResponse = await PokemonService.getPokemonList(offset, ITEMS_PER_PAGE);
      
      const pokemonDetails = await Promise.all(
        listResponse.results.map(pokemon => PokemonService.getPokemonDetails(pokemon))
      );

      setPokemons(pokemonDetails);
      setTotalCount(listResponse.count);
      setHasNext(listResponse.next !== null);
      setHasPrevious(listResponse.previous !== null);
    } catch (error) {
      console.error('Error loading pokemons:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar a lista de Pokémons. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFavoritePokemons = async () => {
    try {
      setLoading(true);
      const favoriteIds = FavoritesService.getFavorites();
      
      if (favoriteIds.length === 0) {
        setFavoritePokemons([]);
        setLoading(false);
        return;
      }

      const favoriteDetails = await Promise.all(
        favoriteIds.map(id => PokemonService.getPokemon(id))
      );

      setFavoritePokemons(favoriteDetails);
    } catch (error) {
      console.error('Error loading favorite pokemons:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar os Pokémons favoritos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  const handleFavoriteToggle = () => {
    if (activeTab === 'favorites') {
      loadFavoritePokemons();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const filteredPokemons = pokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFavorites = favoritePokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Pokédex
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore o mundo dos Pokémons! Descubra suas habilidades, tipos e estatísticas.
          </p>
        </header>

        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-center"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="all" className="flex items-center gap-2">
              Todos
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Favoritos ({FavoritesService.getFavorites().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <PokemonGrid
                  pokemons={filteredPokemons}
                  onPokemonClick={handlePokemonClick}
                  onFavoriteToggle={handleFavoriteToggle}
                />
                {!searchTerm && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hasNext={hasNext}
                    hasPrevious={hasPrevious}
                  />
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {loading ? (
              <LoadingSpinner />
            ) : favoritePokemons.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Nenhum favorito ainda
                </h3>
                <p className="text-gray-500 mb-6">
                  Adicione Pokémons aos seus favoritos clicando no coração!
                </p>
                <Button onClick={() => setActiveTab('all')}>
                  Explorar Pokémons
                </Button>
              </div>
            ) : (
              <PokemonGrid
                pokemons={filteredFavorites}
                onPokemonClick={handlePokemonClick}
                onFavoriteToggle={handleFavoriteToggle}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
