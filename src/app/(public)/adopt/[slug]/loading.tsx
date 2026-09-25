export default function PetProfileLoading() {
  return (
    <main className="mx-auto w-full max-w-[1280px] animate-pulse px-4 py-10 sm:px-14">
      <div className="h-4 w-28 rounded-full bg-ink/10" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-h-[320px] rounded-[28px] bg-ink/10 sm:min-h-[500px]" />
        <div className="glass flex flex-col gap-5 rounded-[28px] p-7 sm:p-9">
          <div className="h-6 w-24 rounded-full bg-ink/10" />
          <div className="h-9 w-2/3 rounded-full bg-ink/10" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 rounded-[12px] bg-ink/10" />
            ))}
          </div>
          <div className="h-28 rounded-[20px] bg-ink/10" />
        </div>
      </div>
    </main>
  );
}
