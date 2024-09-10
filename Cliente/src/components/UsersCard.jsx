'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DrawerDialogDemo } from '@/components/EditUser';

export default function UserCard({ user }) {
  const activeUserString = sessionStorage.getItem('user');

  // Parsear el string JSON en un objeto
  const activeUser = activeUserString ? JSON.parse(activeUserString) : null;

  // Determinar si el usuario activo es un administrador
  const isAdmin = activeUser?.user.is_admin;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        {/* Div con tamaño fijo de 40px x 40px */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 mt-4">
          {/* Imagen con tamaño fijo de 40px x 40px */}
          <img
            src={user.profile_picture}
            alt="profile picture"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center">
          <div className="font-medium">{user.username}</div>
          <div className="text-sm text-muted-foreground">
            {user.is_admin ? 'Admin' : 'User'}
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <Button variant="outline" size="md">
                View
              </Button>
              <DrawerDialogDemo user={user} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
