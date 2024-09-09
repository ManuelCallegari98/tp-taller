'use client';
import { useState } from "react";
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
import { useRouter } from "next/navigation";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const router = useRouter();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, profile_picture: profilePicture }),
      });

      if (response.ok) {
        // Redirige a la página de inicio de sesión
        router.push("/browse/dashboard");
        setUsername("");
        setEmail("");
        setPassword("");
        setProfilePicture("");
      } else {
        const text = await response.text();
        console.error("Error response:", text);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
    }
  };

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
