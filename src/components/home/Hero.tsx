import { PawPrint, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuickSearchBar } from "@/components/home/QuickSearchBar";

interface HeroProps {
  petCount: number;
}

export function Hero({ petCount }: HeroProps) {
  return (
    <section className="grid gap-10 pt-6 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="order-2 lg:order-1">
        <p className="text-[13px] font-bold uppercase tracking-[1px] text-brand">A local rescue</p>
        <h1 className="mt-3 text-[40px] leading-[1.02] sm:text-[70px]">
          Find your new best friend
        </h1>
        <p className="mt-4 max-w-md text-lg text-ink-2">
          Dogs, cats and bearded dragons waiting for a home. Meet them in person, no payment
          until after your meet and greet.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="/adopt">Browse pets</Button>
          <Button href="/how-it-works" variant="outline">
            How it works
          </Button>
        </div>
        <div className="mt-8">
          <QuickSearchBar />
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative mx-auto flex h-[280px] w-full max-w-md items-center justify-center rounded-t-[200px] rounded-b-[32px] bg-gradient-to-b from-dog-photo via-cat-photo to-dragon-photo sm:h-[420px]">
          <PawPrint className="h-16 w-16 text-ink/30" strokeWidth={1.2} />

          <div className="glass-strong absolute left-2 top-8 flex items-center gap-2 rounded-full px-4 py-3 sm:-left-6">
            <PawPrint className="h-4 w-4 text-brand" strokeWidth={2} />
            <span className="text-sm font-bold text-ink">{petCount} pets waiting</span>
          </div>

          <div className="glass-strong absolute bottom-8 right-2 flex items-center gap-2 rounded-full px-4 py-3 sm:-right-6">
            <MapPin className="h-4 w-4 text-brand" strokeWidth={2} />
            <span className="text-sm font-bold text-ink">Local pickup only</span>
          </div>
        </div>
      </div>
    </section>
  );
}
