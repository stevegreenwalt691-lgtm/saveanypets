import type { ReactNode } from "react";
import { BlobBackground } from "@/components/layout/BlobBackground";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { SpeciesTag } from "@/components/ui/SpeciesTag";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Stepper } from "@/components/ui/Stepper";
import { StatusPill } from "@/components/ui/StatusPill";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-2xl">{title}</h2>
        {description ? <p className="mt-1 text-sm text-ink-3">{description}</p> : null}
      </div>
      <GlassCard>{children}</GlassCard>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <BlobBackground />
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-14 px-4 py-16 sm:px-14">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-[1px] text-brand">
            Internal only
          </p>
          <h1 className="mt-2 text-[40px] sm:text-[52px]">Style guide</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-2">
            Every design token and component in one place. Delete or protect this page before
            launch.
          </p>
        </div>

        <Section title="Colour tokens">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {[
              { name: "cream", className: "bg-cream border border-ink/10" },
              { name: "ink", className: "bg-ink" },
              { name: "brand", className: "bg-brand" },
              { name: "dog", className: "bg-dog" },
              { name: "cat", className: "bg-cat" },
              { name: "dragon", className: "bg-dragon" },
              { name: "success", className: "bg-success" },
              { name: "warning", className: "bg-warning" },
              { name: "danger", className: "bg-danger" },
              { name: "blob-coral", className: "bg-blob-coral" },
              { name: "blob-sage", className: "bg-blob-sage" },
              { name: "blob-lilac", className: "bg-blob-lilac" },
            ].map((swatch) => (
              <div key={swatch.name} className="flex flex-col gap-2">
                <div className={`h-16 rounded-[14px] ${swatch.className}`} />
                <span className="text-xs font-bold text-ink-2">{swatch.name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Typography">
          <div className="flex flex-col gap-4">
            <h1 className="text-[52px] sm:text-[70px]">Fraunces display</h1>
            <h2 className="text-[40px]">Section heading</h2>
            <h3 className="text-2xl">Card title</h3>
            <p className="text-lg text-ink-2">
              Body copy in DM Sans, warm and plain. A dog, a cat and a bearded dragon are all
              waiting to meet you.
            </p>
            <p className="text-sm font-bold uppercase tracking-[1px] text-ink-3">Eyebrow label</p>
          </div>
        </Section>

        <Section title="Buttons">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Apply to adopt</Button>
            <Button variant="dark">Meet Spike</Button>
            <Button variant="outline">Learn more</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary" pill={false}>
              Save changes
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="dark" href="/adopt">
              Link styled as a button
            </Button>
          </div>
        </Section>

        <Section title="Chips">
          <div className="flex flex-wrap gap-2">
            <Chip active>All</Chip>
            <Chip>Dogs</Chip>
            <Chip>Cats</Chip>
            <Chip>Bearded dragons</Chip>
          </div>
        </Section>

        <Section title="Species tags">
          <div className="flex flex-wrap gap-3">
            <SpeciesTag species="dog" />
            <SpeciesTag species="cat" />
            <SpeciesTag species="bearded_dragon" />
            <div className="rounded-[14px] bg-dog-photo p-4">
              <SpeciesTag species="dog" onPhoto />
            </div>
          </div>
        </Section>

        <Section title="Status pills">
          <div className="flex flex-wrap gap-3">
            <StatusPill status="new" />
            <StatusPill status="in_review" />
            <StatusPill status="approved" />
            <StatusPill status="declined" />
          </div>
        </Section>

        <Section title="Stepper" description="5 step adoption application progress">
          <Stepper
            steps={["About you", "Home", "Experience", "Meet and greet", "Review"]}
            currentStep={3}
          />
        </Section>

        <Section title="Inputs and select">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Full name" placeholder="Jane Doe" />
            <Input label="Email" type="email" placeholder="jane@example.com" />
            <Input label="Phone" error="Enter a valid phone number" />
            <Select label="Species" defaultValue="">
              <option value="" disabled>
                Choose a species
              </option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bearded_dragon">Bearded Dragon</option>
            </Select>
          </div>
        </Section>

        <Section title="Glass card" description="glass vs glass-strong">
          <div className="grid gap-5 sm:grid-cols-2">
            <GlassCard>
              <p className="text-sm font-bold text-ink">glass</p>
              <p className="mt-1 text-sm text-ink-2">Default card surface.</p>
            </GlassCard>
            <GlassCard strong>
              <p className="text-sm font-bold text-ink">glass-strong</p>
              <p className="mt-1 text-sm text-ink-2">Used for the mobile nav sheet and modals.</p>
            </GlassCard>
          </div>
        </Section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl">Site footer</h2>
            <p className="mt-1 text-sm text-ink-3">Rendered below, in context.</p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
