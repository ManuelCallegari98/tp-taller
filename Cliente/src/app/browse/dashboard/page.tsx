'use client';

import React, { useEffect, useState } from "react";
import UserCard from "@/components/UsersCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from 'axios';

interface User {
  id: number;
  username: string;
  fullName: string;
  isAdmin: boolean;
  profilePicture: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const activeUserString = sessionStorage.getItem('user');
  const activeUser = activeUserString ? JSON.parse(activeUserString) : null;
  const isAdmin = activeUser?.isAdmin;

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users/admin/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      window.location.href = '/browse';
      return;
    }
    fetchUsers();
  }, [isAdmin]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  if (loading) {
    return <div className="flex justify-center items-center h-[85vh]">Cargando...</div>;
  }

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="relative w-full md:w-[200px] lg:w-[320px] m-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar usuarios..."
          className="w-full rounded-lg bg-background pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-grow overflow-y-scroll w-full">
        <div className="grid grid-cols-1 m-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onUserUpdated={handleUserUpdate} />
          ))}
        </div>
      </div>
      
      <div className="pt-6 text-center bottom-0 w-full">
        {isAdmin && (
          <Link href="/register">
            <Button>Registrar Nuevo Usuario</Button>
          </Link>
        )}
      </div>
    </div>
  );
}