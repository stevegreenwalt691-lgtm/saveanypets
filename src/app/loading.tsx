export default function RootLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream" role="status" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink/15 border-t-brand" />
    </div>
  );
}
