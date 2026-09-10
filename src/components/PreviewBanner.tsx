export function PreviewBanner({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <span>
        <strong>Preview mode enabled</strong> — showing draft content from the
        Contentful Content Preview API.
      </span>
      <a href="/api/exit-preview" className="font-medium underline underline-offset-2">
        Exit preview
      </a>
    </div>
  );
}
