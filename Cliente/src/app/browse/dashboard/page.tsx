'use client'
import React, { useEffect, useState } from "react";
import UserCard from "@/components/UsersCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          setFilteredUsers(data); // Inicialmente, todos los usuarios están filtrados
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      // Filtrar usuarios por término de búsqueda
      const filtered = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      // Si no hay término de búsqueda, mostrar todos los usuarios
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  return (
    <div className="flex flex-col h-[85vh]">
      <div className="relative w-full md:w-[200px] lg:w-[320px] m-2">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-grow overflow-y-scroll w-full">
        <div className="grid grid-cols-1 m-2 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </div>
      <div className="pt-6 text-center bottom-0 w-full">
        <Button>Register New User</Button>
      </div>
    </div>
  );
}
