'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Avatar } from '@radix-ui/react-avatar';

export default function UserCard({ user }) {
  const activeUserString = sessionStorage.getItem('user');
  
  // Parsear el string JSON en un objeto
  const activeUser = activeUserString ? JSON.parse(activeUserString) : null;
  
  // Determinar si el usuario activo es un administrador
  const isAdmin = activeUser?.user.is_admin;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24 rounded-full">
          <Image
          src={user.profile_picture}
          alt="profile picture"
          width={100}
          height={100}
          className="object-cover rounded-full h-16 w-16"
        />
        </Avatar>
        <div className="text-center">
          <div className="font-medium">{user.username}</div>
          <div className="text-sm text-muted-foreground">{user.is_admin ? 'Admin' : 'User'}</div>
        </div>
        <div className="flex gap-2">
          
          {isAdmin && (
            <>
              <Button variant="outline" size="sm">
                View
              </Button>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
