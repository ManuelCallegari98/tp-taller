export class IMovieAPI {
  async searchMovie(query, type) {
    throw new Error('Method not implemented');
  }
  
  /*Este metodo protegido nos sirve para transformar la respuesta de cualquier API que usemos a nuestro formato, 
   para que sea mas facil manejarla. Esta transformacion esta basada en la clase Movie */
  _transformToMovieModel(data) {
    return {
      title: '',
      year: '',
      rated: '',
      released: '',
      runtime: '',
      genre: '',
      director: '',
      writer: '',
      actors: '',
      plot: '',
      language: '',
      country: '',
      awards: '',
      poster: '',
      ratings: [],
      metascore: '',
      imdbRating: '',
      imdbVotes: '',
      imdbID: '',
      type: '',
      boxOffice: ''
    };
  }
}