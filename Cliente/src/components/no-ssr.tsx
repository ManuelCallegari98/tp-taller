import { Button } from "@/components/ui/button";
import { Menu } from 'lucide-react'
export default function NoSSR() {
    return (
        <Button
            variant="outline"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>

    );
}