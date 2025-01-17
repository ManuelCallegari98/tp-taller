// src/app/browse/layout.tsx
'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { sessionService } from "@/services/sessionService";
import { User } from "@/types/user";

interface BrowseLayoutProps {
  children: React.ReactNode;
}

export default function BrowseLayout({
  children,
}: BrowseLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = sessionService.getSession() as User | null;
        
        if (!userData) {
          router.push('/login');
          return;
        }

        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="bg-gray-200 animate-pulse h-screen md:w-[220px] lg:w-[280px]"></div>
        <div className="flex flex-col w-full">
          <div className="bg-gray-200 animate-pulse h-[60px]"></div>
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="bg-gray-200 animate-pulse h-[200px]"></div>
            <div className="bg-gray-200 animate-pulse h-[200px] mt-4"></div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar user={user} />
      <div className="flex flex-col">
        <Header user={user} />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}