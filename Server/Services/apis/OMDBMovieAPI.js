// Services/apis/OMDBMovieAPI.js
import { IMovieAPI } from './IMovieAPI.js';
import axios from 'axios';

export class OMDBMovieAPI extends IMovieAPI {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
    this.baseUrl = 'http://www.omdbapi.com/';
  }

  async searchMovie(query, type) {
    const formattedQuery = query.trim().replace(/ /g, '+');
    console.log('formatedquery:',formattedQuery)
    const response = await axios.get(
      `${this.baseUrl}?t=${formattedQuery}&type=${type}&apikey=${this.apiKey}`
    );
    if (response.data.Response === "True") {
      return this._transformToMovieModel(response.data);
    }
    return null;
  }

  _transformToMovieModel(omdbData) {
    return {
      title: omdbData.Title,
      year: omdbData.Year,
      rated: omdbData.Rated,
      released: omdbData.Released,
      runtime: omdbData.Runtime,
      genre: omdbData.Genre,
      director: omdbData.Director,
      writer: omdbData.Writer,
      actors: omdbData.Actors,
      plot: omdbData.Plot,
      language: omdbData.Language,
      country: omdbData.Country,
      awards: omdbData.Awards,
      poster: omdbData.Poster,
      ratings: omdbData.Ratings,
      metascore: omdbData.Metascore,
      imdbRating: omdbData.imdbRating,
      imdbVotes: omdbData.imdbVotes,
      imdbID: omdbData.imdbID,
      type: omdbData.Type,
      boxOffice: omdbData.BoxOffice
    };
  }
}