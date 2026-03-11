import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ghost } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-bounce duration-[3000ms]">
          <Ghost className="w-16 h-16 text-primary" />
        </div>
        <div className="absolute -top-2 -right-2 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          404
        </div>
      </div>
      
      <h1 className="font-display text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary via-purple-electric to-pink-accent bg-clip-text text-transparent">
        Whoops! Lost in Space?
      </h1>
      
      <p className="text-secondary max-w-xs mb-10 text-lg leading-relaxed">
        The page you're looking for has drifted away or never existed. Let's get you back to Trendle.
      </p>

      <Link href="/">
        <Button className="btn-primary gap-2 h-12 px-8 text-lg font-bold group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Earth
        </Button>
      </Link>

      <div className="mt-12 opacity-30">
        <p className="text-xs uppercase tracking-[0.2em]">Trendle Beta Navigation</p>
      </div>
    </div>
  );
}
