// src/app/dashboard/movies/page.tsx
"use client";
import { CarouselSize } from "@/components/Carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function MoviesPage() {
  return (
    <div>
      <h1>Movies & Series</h1>
      <div className="w-full h-full flex items-center justify-center lg:ml-8 display-fle">
      <Carousel className="w-full sm:max-w-sm md:max-w-xl"
      opts={{
        loop: true,
        align: "start",
      }}>
      <CarouselContent className="-ml-1 h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="pl-1 md:basis-1/3 lg:basis-1/5">
            <div className="p-1 justify-center items-center flex  bg-red-500 h-80">
              <Image src="/logo.png" alt="logo" width={100} height={100}></Image>
              <h3>{index + 1}</h3>
              {/* <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-2xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card> */}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex justify-center items-center " />
      <CarouselNext className="hidden sm:flex justify-center items-center "/>
    </Carousel>
        {/* <CarouselSize></CarouselSize> */}
      </div>
    </div>
  );
}
