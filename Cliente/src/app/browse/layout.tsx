'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function BrowseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
    profilePicture: string;
    createdAt: string;
    isAdmin: boolean;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar el estado de autenticación y obtener los datos del usuario
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const userDataString = sessionStorage.getItem('user');
    
    if (isLoggedIn !== 'true' || !userDataString) {
      // Redirigir al login si no está autenticado
      router.push('/login');
    } else {
      // Parsear los datos del usuario
      const userData = JSON.parse(userDataString);
      const user = userData.user;
      console.log('user:',user)
      setUser({
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profile_picture,
        createdAt: user.created_at,
        isAdmin: user.is_admin,
      });
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null; // O puedes retornar un mensaje de redirección o carga
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar isAdmin={user.isAdmin} />
      <div className="flex flex-col">
        <Header isAdmin={user.isAdmin}/>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
