import { component$, $ } from "@builder.io/qwik";
import type { Note } from "~/lib/notes";

interface NoteListProps {
  notes: Note[];
  activeId?: string;
  onSelect$?: (id: string) => void;
}

export const NoteList = component$<NoteListProps>((props) => {
  const handleSelect$ = $((host: HTMLElement, id: string) => {
    host.dispatchEvent(new CustomEvent("note-select", { detail: { id }, bubbles: true }));
  });

  return (
    <div class="card note-list">
      {props.notes.length === 0 && <div class="p-3 small">No notes yet.</div>}
      {props.notes.map((n) => (
        <div
          key={n.id}
          class={"item " + (props.activeId === n.id ? "active" : "")}
          onClick$={(_, el) => handleSelect$(el as HTMLElement, n.id)}
        >
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{n.title || "(Untitled)"}</div>
            <div class="small">{(n.content || "").slice(0, 80)}</div>
          </div>
        </div>
      ))}
    </div>
  );
});
