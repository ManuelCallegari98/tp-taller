import { db } from "../database/connection.database.js";

import bcrypt from 'bcrypt';

const User = {
    // Método para crear un nuevo usuario
    create: async (username, name, password, profile_picture) => {
        try {
            // Verificar si la tabla 'public.users' existe, y crearla si no existe
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS public.users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(255) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    profile_picture TEXT,
                    is_admin BOOLEAN DEFAULT FALSE,
                    list TEXT[] DEFAULT '{}',
                    watched JSONB DEFAULT '[]',
                    created_at TIMESTAMP DEFAULT NOW()
                );
            `;
            await db.query(createTableQuery);
    
            // Encriptar la contraseña antes de guardarla
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Verificar si la tabla de usuarios está vacía
            const checkQuery = 'SELECT COUNT(*) FROM public.users';
            const { rows } = await db.query(checkQuery);
            const userCount = parseInt(rows[0].count, 10);
    
            // Si no hay usuarios, el primer usuario será administrador
            const isAdmin = userCount === 0;
    
            // Inserción en la base de datos
            const query = `
                INSERT INTO public.users (username, name, password, profile_picture, is_admin, list, watched, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) RETURNING *;
            `;
            const values = [
                username,
                name,
                hashedPassword,
                profile_picture,
                isAdmin,
                '{}', // lista vacía para el array de strings
                '[]'  // lista vacía para el array de objetos JSON
            ];
            const result = await db.query(query, values);
    
            return result.rows[0]; // Retorna el usuario creado
        } catch (err) {
            console.error('Error creating user:', err);
            throw err;
        }
    },    

    findAll: async () => {
        try {
          const query = 'SELECT * FROM users;';
          const result = await db.query(query);
          return result.rows;
        } catch (err) {
          throw err;
        }
      },

    // Método para encontrar un usuario por su nombre de usuario
    findByUsername: async (username) => {
        try {
            const query = `SELECT * FROM users WHERE username = $1;`;
            const result = await db.query(query, [username]);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    // Método para encontrar un usuario por su correo electrónico
    findByEmail: async (email) => {
        try {
            const query = `SELECT * FROM users WHERE email = $1;`;
            const result = await db.query(query, [email]);
            return result.rows[0];
        } catch (err) {
            throw err;
        }
    },

    // Método para validar la contraseña
    validatePassword: async (enteredPassword, storedPassword) => {
        try {
            return await bcrypt.compare(enteredPassword, storedPassword);
        } catch (err) {
            throw err;
        }
    },

    updateProfile: async (id, username, email, profile_picture) => {
        try {
            const query = `
                UPDATE users 
                SET username = $1, email = $2, profile_picture = $3
                WHERE id = $4 
                RETURNING *;
            `;
            const values = [username, email, profile_picture, id];
            const result = await db.query(query, values);

            return result.rows[0]; // Retorna el usuario actualizado
        } catch (err) {
            throw err;
        }
    },

    // Método para actualizar la contraseña del usuario
    updatePassword: async (id, newPassword) => {
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const query = `
                UPDATE users 
                SET password = $1
                WHERE id = $2 
                RETURNING *;
            `;
            const values = [hashedPassword, id];
            const result = await db.query(query, values);

            return result.rows[0]; // Retorna el usuario con la contraseña actualizada
        } catch (err) {
            throw err;
        }
    },

    // Método para eliminar un usuario por su ID
    deleteUser: async (id) => {
        try {
            const query = `
                DELETE FROM users 
                WHERE id = $1 
                RETURNING *;
            `;
            const result = await db.query(query, [id]);

            return result.rows[0]; // Retorna el usuario eliminado
        } catch (err) {
            throw err;
        }
    },

    updateUserList: async (userId, newItem) => {
        try {
            // Actualización del campo "list" usando ARRAY_APPEND
            const query = `
                UPDATE public.users
                SET list = ARRAY_APPEND(list, $1)
                WHERE id = $2
                RETURNING *;
            `;
            const values = [newItem, userId];
            const result = await db.query(query, values);
    
            if (result.rows.length === 0) {
                throw new Error(`User with ID ${userId} not found.`);
            }
    
            return result.rows[0]; // Retorna el usuario actualizado
        } catch (err) {
            console.error('Error adding item to list:', err);
            throw err;
        }
    }
    
};

export default User;
