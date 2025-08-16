import * as React from "react";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselDemo() {
  const images = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
    "https://plus.unsplash.com/premium_photo-1661962871593-8c3dde633373?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDF8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1754206352604-0a4f13ca2a22?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDR8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D"
  ];

  return (
    <Carousel className="w-[75%] mx-auto">
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem
            key={index}
            className="basis-full max-w-full" // full width per slide
          >
            <div className="p-1">
              <Card>
                <CardContent className="flex items-center justify-center p-0">
                  <Image
                    src={src}
                    alt={`Slide ${index + 1}`}
                    width={700}
                    height={700}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
