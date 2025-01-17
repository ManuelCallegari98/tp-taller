'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sessionService } from '@/services/sessionService';

export function DrawerDialogDemo({ user, onUserUpdated }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    fullName: user.fullName,
    profilePicture: user.profilePicture,
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const activeUser = sessionService.getSession();
      if (!activeUser) {
        throw new Error('No hay usuario activo');
      }

      // Validar contraseñas si se está intentando cambiar
      if (formData.password || formData.confirmPassword) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
      }

      const response = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          fullName: formData.fullName,
          profilePicture: formData.profilePicture,
          password: formData.password || undefined, // Solo enviamos la contraseña si se modificó
          id: activeUser.id,
          isAdmin: activeUser.isAdmin
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar el usuario');
      }

      const updatedUser = await response.json();
      onUserUpdated(updatedUser);
      setOpen(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message || 'Error al actualizar el usuario');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Editar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Modifica los datos del usuario aquí. Haz clic en guardar cuando termines.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="profilePicture">Foto de perfil</Label>
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Nueva contraseña (opcional)</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <Label htmlFor="showPassword">Mostrar contraseña</Label>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}