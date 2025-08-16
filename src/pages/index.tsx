import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarouselDemo } from "@/components/ui/CarouselDemo";




export default function Home() {
  return (
   <div>
    
      <br />
      <br />
      <section className="flex flex-col items-center justify-center text-center px-4 py-20">
        <TypewriterEffect
          className="typewriter-text"
          words={[
            { text: "Plan" },
            { text: "your" },
            { text: "next" },
            { text: "adventure" },
             { text: "with" },
              { text: " us!" }
          ]}
        />
        <br />
     
    
        
        <p className="mt-4 text-lg text-gray-600 max-w-lg">
          Discover amazing destinations, create unforgettable experiences, and
          make your journey unique.
        </p>
        
        <p className="mt-4 text-lg text-gray-600 max-w-lg">
        Try It for free
        </p>



        <Link href={"/ai"}>
          {" "}
          <Button variant={'outline'} className="mt-8 px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition">
             Start
          </Button>
        </Link>
        <br />

         <CarouselDemo/>
      </section>
    
 
   </div>
  );
}
