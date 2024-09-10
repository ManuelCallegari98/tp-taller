import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DrawerDialogDemo({ user }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    name: user.name,
    profile_picture: user.profile_picture || "/default-avatar.png",
  });
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const router = useRouter();
  // Función para manejar la carga de imágenes
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profile_picture: reader.result, // Base64 string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Error updating profile");
      }

      const updatedUser = await res.json();
      console.log("Profile updated", updatedUser);
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4">
          <div className="flex justify-center">
            <img
              src={formData.profile_picture}
              alt="Profile"
              width="150"
              height="150"
              className="h-24 w-24 object-cover rounded-full"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              value={formData.name}
              onChange={handleInputChange}
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
        </form>
        <Button onClick={handleSave} className="w-full mt-4">
          Save changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
