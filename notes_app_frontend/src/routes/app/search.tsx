import { component$, useSignal, $ } from "@builder.io/qwik";
import { listNotes } from "~/lib/notes";
import type { Note } from "~/lib/notes";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Dedicated search page for notes. */
  const q = useSignal("");
  const results = useSignal<Note[]>([]);
  const error = useSignal<string | null>(null);
  const loading = useSignal(false);

  const onSearch$ = $(async () => {
    const token = localStorage.getItem("token") || "";
    try {
      loading.value = true;
      error.value = null;
      results.value = await listNotes(token, q.value.trim() || undefined);
    } catch (e: any) {
      error.value = e?.message || "Search failed";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <div class="card p-3">
        <div class="row" style={{ gap: ".5rem" }}>
          <input
            class="input"
            placeholder="Search notes..."
            value={q.value}
            onInput$={(e) => (q.value = (e.target as HTMLInputElement).value)}
            onKeyDown$={(e) => {
              if ((e as KeyboardEvent).key === "Enter") onSearch$();
            }}
          />
          <button onClick$={onSearch$}>Search</button>
        </div>
        {error.value && <div class="small mt-2" style={{ color: "crimson" }}>{error.value}</div>}
      </div>
      <div class="card p-2 mt-3">
        {loading.value && <div class="small p-2">Searching...</div>}
        {!loading.value && results.value.length === 0 && (
          <div class="small p-2">No results.</div>
        )}
        {results.value.map((n) => (
          <div key={n.id} class="item">
            <div>
              <div style={{ fontWeight: 600 }}>{n.title || "(Untitled)"}</div>
              <div class="small">{(n.content || "").slice(0, 120)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
