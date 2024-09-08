'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profile_picture, setProfilePicture] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, profile_picture }),
      });

      if (response.ok) {
        //window.location.href = '/login'; // Redirige a la página de inicio de sesión
        //setUsername('');
        //setEmail('');
        //setPassword('');
        //setProfilePicture('');
    } else {
        const text = await response.text(); // Verifica el contenido de la respuesta
        console.error('Error response:', text);
    }
} catch (error) {
    console.error('Error al registrar:', error);
}
};

return (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <Card className="mx-auto max-w-sm">
      <CardHeader className="flex flex-col items-center gap-2">
        <Image
          src="/1.png"
          alt="Image"
          width="300"
          height="300"
          className="h-32 w-42 object-cover rounded-md"
        />
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="User123"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="profile_picture">Profile Picture (URL)</Label>
            <Input
              id="profile_picture"
              type="text"
              placeholder="URL of the profile picture"
              value={profile_picture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </div>
          <Button type="button" className="w-full" onClick={handleRegister}>
            Register
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);
}



