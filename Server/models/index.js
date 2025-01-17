import User from './User.js';
import Movie from './Movie.js';
import WatchList from './WatchList.js';
import Rating from './Rating.js';
import sequelize from '../config/database.js'; // Asegúrate de que este archivo existe y está configurado correctamente


// Asociaciones User-Movie a través de WatchList
User.belongsToMany(Movie, { through: WatchList });
Movie.belongsToMany(User, { through: WatchList });

// Asociaciones User-Movie a través de Rating
User.belongsToMany(Movie, { through: Rating });
Movie.belongsToMany(User, { through: Rating });

// Asociaciones directas con WatchList y Rating
User.hasMany(WatchList);
WatchList.belongsTo(User);
Movie.hasMany(WatchList);
WatchList.belongsTo(Movie);

User.hasMany(Rating);
Rating.belongsTo(User);
Movie.hasMany(Rating);
Rating.belongsTo(Movie);

export {
  User,
  Movie,
  WatchList,
  Rating,
  sequelize
};