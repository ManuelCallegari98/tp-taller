// src/app/browse/page.tsx
'use client'
import { useEffect, useState } from 'react';
import { sessionService } from "@/services/sessionService";
import { User } from "@/types/user";

export default function Browse() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = sessionService.getSession() as User | null;
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
      <h1 className="text-4xl font-semibold">
        Bienvenido a TangoFlix{user ? `, ${user.username}` : ''}
      </h1>
      <p className="text-xl text-gray-500">
        Explora nuestra colección de películas y series
      </p>
    </div>
  );
}