import { component$, useSignal, useVisibleTask$, $, useTask$ } from "@builder.io/qwik";
import { NoteList } from "~/components/NoteList";
import { NoteEditor } from "~/components/NoteEditor";
import type { Note } from "~/lib/notes";
import { listNotes, getNote, updateNote, deleteNote, createNote } from "~/lib/notes";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Main notes screen: list on the left, editor on the right. */
  const token = useSignal<string>("");
  const notes = useSignal<Note[]>([]);
  const activeId = useSignal<string | undefined>(undefined);
  const active = useSignal<Note | undefined>(undefined);
  const q = useSignal("");
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);

  const loadNotes$ = $(async () => {
    try {
      loading.value = true;
      error.value = null;
      notes.value = await listNotes(token.value, q.value.trim() || undefined);
      if (activeId.value) {
        const found = notes.value.find((n) => n.id === activeId.value);
        if (!found) {
          activeId.value = notes.value[0]?.id;
        }
      } else {
        activeId.value = notes.value[0]?.id;
      }
      if (activeId.value) {
        active.value = await getNote(token.value, activeId.value);
      } else {
        active.value = undefined;
      }
    } catch (e: any) {
      error.value = e?.message || "Failed to load notes";
    } finally {
      loading.value = false;
    }
  });

  useVisibleTask$(async () => {
    const t = localStorage.getItem("token");
    token.value = t || "";
    await loadNotes$();
  });

  useTask$(async ({ track }) => {
    track(() => activeId.value);
    if (activeId.value) {
      try {
        active.value = await getNote(token.value, activeId.value);
      } catch {
        // ignore
      }
    } else {
      active.value = undefined;
    }
  });

  const onSelect$ = $((e: Event) => {
    const id = (e as CustomEvent<{ id: string }>).detail.id;
    activeId.value = id;
  });

  const onSave$ = $(async (e: Event) => {
    const payload = (e as CustomEvent<{ title: string; content: string; tags?: string[] }>).detail;
    try {
      if (activeId.value) {
        const updated = await updateNote(token.value, activeId.value, payload);
        active.value = updated;
      } else {
        const created = await createNote(token.value, payload);
        activeId.value = created.id;
        active.value = created;
      }
      await loadNotes$();
    } catch (err: any) {
      error.value = err?.message || "Failed to save note";
    }
  });

  const onDelete$ = $(async () => {
    if (!activeId.value) return;
    try {
      await deleteNote(token.value, activeId.value);
      activeId.value = undefined;
      active.value = undefined;
      await loadNotes$();
    } catch (err: any) {
      error.value = err?.message || "Failed to delete note";
    }
  });

  const onNew$ = $(() => {
    activeId.value = undefined;
    active.value = undefined;
  });

  const onSearch$ = $(async () => {
    await loadNotes$();
  });

  return (
    <>
      <div class="card p-2" style={{ gridColumn: "1 / -1" }}>
        <div class="row space-between">
          <div class="row" style={{ gap: ".5rem" }}>
            <input
              class="input"
              placeholder="Search notes..."
              value={q.value}
              onInput$={(e) => (q.value = (e.target as HTMLInputElement).value)}
              onKeyDown$={(e) => {
                if ((e as KeyboardEvent).key === "Enter") onSearch$();
              }}
              style={{ minWidth: "260px" }}
            />
            <button onClick$={onSearch$}>Search</button>
          </div>
          <button class="primary" onClick$={onNew$}>New Note</button>
        </div>
      </div>

      <div onNote-select$={onSelect$}>
        <NoteList notes={notes.value} activeId={activeId.value} />
      </div>
      <div onNote-save$={onSave$} onNote-delete$={onDelete$}>
        <NoteEditor note={active.value} />
        {error.value && <div class="small mt-2" style={{ color: "crimson" }}>{error.value}</div>}
        {loading.value && <div class="small mt-2">Loading...</div>}
      </div>
    </>
  );
});
