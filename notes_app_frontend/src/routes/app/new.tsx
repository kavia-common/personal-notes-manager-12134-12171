import { component$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { createNote } from "~/lib/notes";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Simple new note screen */
  const title = useSignal("");
  const content = useSignal("");
  const tags = useSignal("");
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const nav = useNavigate();

  const onCreate$ = $(async () => {
    const token = localStorage.getItem("token") || "";
    try {
      loading.value = true;
      error.value = null;
      await createNote(token, {
        title: title.value.trim(),
        content: content.value,
        tags: tags.value.split(",").map((t) => t.trim()).filter(Boolean),
      });
      nav(`/app`);
    } catch (e: any) {
      error.value = e?.message || "Failed to create note";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div style={{ gridColumn: "1 / -1" }}>
      <div class="card p-4">
        <h2 style={{ marginTop: 0 }}>New Note</h2>
        {error.value && <div class="small" style={{ color: "crimson" }}>{error.value}</div>}
        <div class="mt-2">
          <label class="small">Title</label>
          <input value={title.value} onInput$={(e) => (title.value = (e.target as HTMLInputElement).value)} />
        </div>
        <div class="mt-2">
          <label class="small">Content</label>
          <textarea value={content.value} onInput$={(e) => (content.value = (e.target as HTMLTextAreaElement).value)} />
        </div>
        <div class="mt-2">
          <label class="small">Tags</label>
          <input value={tags.value} onInput$={(e) => (tags.value = (e.target as HTMLInputElement).value)} placeholder="e.g. work, ideas" />
        </div>
        <div class="mt-3 row" style={{ justifyContent: "flex-end" }}>
          <button class="primary" disabled={loading.value} onClick$={onCreate$}>
            {loading.value ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
});
