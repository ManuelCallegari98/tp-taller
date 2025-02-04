import { OMDBMovieAPI } from './OMDBMovieAPI.js';

export class MovieAPIFactory {
  static getMovieAPI(provider = 'omdb') {
    switch (provider) {
      case 'omdb':
        return new OMDBMovieAPI(process.env.OMDB_API_KEY);
      // Aca se pueden agregar más APIS en el futuro
      default:
        throw new Error(`Provider ${provider} not supported`);
    }
  }
}