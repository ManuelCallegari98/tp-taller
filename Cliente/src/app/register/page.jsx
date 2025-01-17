'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sessionService } from "@/services/sessionService";
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
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [canRegister, setCanRegister] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/users/count');
        const { count } = await response.json();
        const user = sessionService.getSession();

        // Verificar si hay usuarios registrados

        // Permitir registro solo si es admin o no hay usuarios
        if (count === 0 || user.isAdmin ) {
          console.log("Puede registrar");
          setCanRegister(true);
        } else {
          router.push('/browse/dashboard');
        }
      } catch (error) {
        console.error('Error:', error);
        router.push('/login');
      }
    };

    checkAccess();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          fullName: name,
          profilePicture
        }),
      });

      if (response.ok) {
        router.push("/browse/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error en el registro. Por favor, intenta de nuevo.");
    }
  };

  if (!canRegister) {
    return null; // o un componente de carga
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="flex flex-col items-center gap-2">
          <img
            src={profilePicture || "/1.png"}
            alt="Profile"
            width="150"
            height="150"
            className="h-24 w-24 object-cover rounded-full"
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              <Label htmlFor="profile_picture">Profile Picture</Label>
              <Input
                id="profile_picture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
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