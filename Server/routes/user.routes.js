// routes/user.routes.js
import express from 'express';
import { createUser, loginUser, getUsersForAdmin, deleteUser, updateUser, getUserCount } from '../controllers/UserController.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/admin/users', getUsersForAdmin); // Solo para admins
router.delete('/admin/users/:userId', deleteUser); // Solo para admins
router.put('/:userId', updateUser); // Admin o usuario propio
router.get('/count', getUserCount);

export default router;

