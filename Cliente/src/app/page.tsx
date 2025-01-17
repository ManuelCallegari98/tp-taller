import { ModeToggle } from "@/components/switch-mode";
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirigir a /browse
  redirect('/browse');
  
  return null;
}