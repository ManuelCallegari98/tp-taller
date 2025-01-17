'use client';
import React, { useEffect, useState } from 'react';
import { DrawerDialogDemo } from '@/components/EditUser';
import { sessionService } from '@/services/sessionService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(sessionService.getSession());
  const router = useRouter();

  useEffect(() => {
    // Si no hay usuario activo, redirigir al login
    if (!sessionService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const handleUserUpdate = (updatedUser: any) => {
    sessionService.setSession(updatedUser);
    setUser(updatedUser);
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.profilePicture} alt={user.username} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="space-y-4 w-full">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{user.fullName}</h3>
                  <p className="text-gray-500">@{user.username}</p>
                  <p className="text-sm text-gray-500">
                    {user.isAdmin ? 'Administrador' : 'Usuario'}
                  </p>
                </div>
                <DrawerDialogDemo user={user} onUserUpdated={handleUserUpdate} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}