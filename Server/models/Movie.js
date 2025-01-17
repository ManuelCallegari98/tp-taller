// models/Movie.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Movie = sequelize.define('Movie', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  year: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  rated: {
    type: DataTypes.STRING(10)
  },
  released: {
    type: DataTypes.STRING(50)
  },
  runtime: {
    type: DataTypes.STRING(50)
  },
  genre: {
    type: DataTypes.STRING(100)
  },
  director: {
    type: DataTypes.STRING(255)
  },
  writer: {
    type: DataTypes.STRING(255)
  },
  actors: {
    type: DataTypes.STRING(500)
  },
  plot: {
    type: DataTypes.TEXT
  },
  language: {
    type: DataTypes.STRING(100)
  },
  country: {
    type: DataTypes.STRING(100)
  },
  awards: {
    type: DataTypes.STRING(255)
  },
  poster: {
    type: DataTypes.TEXT
  },
  ratings: {
    type: DataTypes.JSONB
  },
  metascore: {
    type: DataTypes.STRING(10)
  },
  imdbRating: {
    type: DataTypes.STRING(10)
  },
  imdbVotes: {
    type: DataTypes.STRING(20)
  },
  imdbID: {
    type: DataTypes.STRING(20)
  },
  type: {
    type: DataTypes.ENUM('movie', 'series'),
    allowNull: false
  },
  boxOffice: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'movies'
});

export default Movie;