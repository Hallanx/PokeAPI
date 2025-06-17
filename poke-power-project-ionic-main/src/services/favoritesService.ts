
export class FavoritesService {
  private static readonly STORAGE_KEY = 'pokemon-favorites';

  static getFavorites(): number[] {
    const favorites = localStorage.getItem(this.STORAGE_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  static addToFavorites(pokemonId: number): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(pokemonId)) {
      favorites.push(pokemonId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    }
  }

  static removeFromFavorites(pokemonId: number): void {
    const favorites = this.getFavorites();
    const updatedFavorites = favorites.filter(id => id !== pokemonId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedFavorites));
  }

  static isFavorite(pokemonId: number): boolean {
    return this.getFavorites().includes(pokemonId);
  }

  static toggleFavorite(pokemonId: number): boolean {
    if (this.isFavorite(pokemonId)) {
      this.removeFromFavorites(pokemonId);
      return false;
    } else {
      this.addToFavorites(pokemonId);
      return true;
    }
  }
}
