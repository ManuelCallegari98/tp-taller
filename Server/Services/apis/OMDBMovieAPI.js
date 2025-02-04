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
    const response = await axios.get(
      `${this.baseUrl}?t=${formattedQuery}&type=${type}&apikey=${this.apiKey}`
    );
    return response.data;
  }

  async getMovieDetails(id) {
    const response = await axios.get(
      `${this.baseUrl}?i=${id}&apikey=${this.apiKey}`
    );
    return response.data;
  }
}