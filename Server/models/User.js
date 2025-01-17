import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  profilePicture: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'users',
  schema: 'public',
  timestamps: true, // Agregar timestamps
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    },
    beforeUpdate: async (user) => {
      // Solo encriptar si la contraseña fue modificada
      const passwordChanged = user.changed('password');
      console.log('¿La contraseña cambió?', passwordChanged);
      
      if (passwordChanged && user.password) {
        console.log('Encriptando nueva contraseña...');
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Agregar método para validar contraseña
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User;