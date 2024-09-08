import React from 'react'
import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export default function UserCard() {
  return (

            <Card>
              <CardContent className="flex flex-col items-center gap-4">
                <Image
                src="/logo.png"
                alt="logo"
                width={100}
                height={100}
                className="rounded-full h-16 w-16"
                />
                <div className="text-center">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-muted-foreground">Admin</div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
            
  )
}
