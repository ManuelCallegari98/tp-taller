'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DrawerDialogDemo } from '@/components/EditUser';
import { UserCircle2 } from 'lucide-react';

interface User {
  username: string;
  fullName: string;
  profilePicture?: string;
  isAdmin: boolean;
}

interface UserCardProps {
  user: User;
  onUserUpdated: () => void;
}

export default function UserCard({ user, onUserUpdated }: UserCardProps) {
  const activeUserString = sessionStorage.getItem('user');
  const activeUser: User | null = activeUserString ? JSON.parse(activeUserString) : null;
  const isAdmin = activeUser?.isAdmin;

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 mt-4">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={`${user.username}'s avatar`}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserCircle2 className="w-8 h-8 text-gray-500" />
          )}
        </div>

        <div className="text-center">
          <div className="font-medium">{user.username}</div>
          <div className="text-sm text-muted-foreground">
            {user.fullName}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {user.isAdmin ? 'Administrator' : 'User'}
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <DrawerDialogDemo user={user} onUserUpdated={onUserUpdated} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}