export function BlobBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="blob -top-24 -left-20 h-64 w-64 bg-blob-coral sm:h-[420px] sm:w-[420px]"
        style={{ animationDelay: "-2s" }}
      />
      <div
        className="blob top-1/3 -right-24 h-56 w-56 bg-blob-sage sm:h-[380px] sm:w-[380px]"
        style={{ animationDelay: "-9s" }}
      />
      <div
        className="blob bottom-0 left-1/4 hidden h-[340px] w-[340px] bg-blob-lilac sm:block"
        style={{ animationDelay: "-14s" }}
      />
      <div
        className="blob -bottom-20 right-10 hidden h-[300px] w-[300px] bg-blob-peach sm:block"
        style={{ animationDelay: "-5s" }}
      />
    </div>
  );
}
