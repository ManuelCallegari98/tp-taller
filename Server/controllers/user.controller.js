import User from '../models/user.model.js';

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    const { username, email, password, profile_picture } = req.body;

    try {
        const user = await User.create(username, email, password, profile_picture);
        console.log(`User created: ${user.id}`);
        res.status(201).json(user);
    } catch (err) {
        console.log(`Error creating user: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

// Iniciar sesión de un usuario
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValidPassword = await User.validatePassword(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        console.log(`User logged in: ${user.id}`);
        res.status(200).json({ user });
    } catch (err) {
        console.log(`Error logging in: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar el perfil de un usuario
export const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, email, profile_picture } = req.body;

    try {
        const updatedUser = await User.updateProfile(id, username, email, profile_picture);
        console.log(`User profile updated: ${id}`);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(`Error updating profile: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

// Actualizar la contraseña del usuario
export const updateUserPassword = async (req, res) => {
    const { id , password } = req.params;
    //const { newPassword } = req.body;

    try {
        const updatedUser = await User.updatePassword(id, password);
        console.log(`User password updated: ${id}`);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(`Error updating password: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.deleteUser(id);
        console.log(`User deleted: ${id}`);
        res.status(200).json(deletedUser);
    } catch (err) {
        console.log(`Error deleting user: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll(); // Asumiendo que tienes un método getAll en tu modelo
      res.status(200).json(users);
    } catch (err) {
      console.error('Error retrieving users:', err);
      res.status(500).json({ error: err.message });
    }
  };