import { component$, useSignal, $ } from "@builder.io/qwik";
import type { Note } from "~/lib/notes";

interface NoteEditorProps {
  note?: Note;
  onSave$?: (n: { title: string; content: string; tags?: string[] }) => void;
  onDelete$?: () => void;
}

export const NoteEditor = component$<NoteEditorProps>((props) => {
  const title = useSignal(props.note?.title || "");
  const content = useSignal(props.note?.content || "");
  const tags = useSignal((props.note?.tags || []).join(", "));

  const emitSave$ = $((host: HTMLElement) => {
    const detail = {
      title: title.value.trim(),
      content: content.value,
      tags:
        tags.value
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean) || [],
    };
    host.dispatchEvent(new CustomEvent("note-save", { detail, bubbles: true }));
  });

  const emitDelete$ = $((host: HTMLElement) => {
    host.dispatchEvent(new CustomEvent("note-delete", { bubbles: true }));
  });

  return (
    <div class="card note-editor" onNote-save$={(_, el) => emitSave$(el)} onNote-delete$={(_, el) => emitDelete$(el)}>
      <div class="row space-between mb-3">
        <input
          type="text"
          placeholder="Title"
          value={title.value}
          onInput$={(e) => (title.value = (e.target as HTMLInputElement).value)}
        />
        <div class="row">
          {props.onDelete$ && (
            <button class="ghost" onClick$={(_, el) => emitDelete$(el as HTMLElement)} aria-label="Delete note">
              Delete
            </button>
          )}
          <button
            class="primary"
            onClick$={(_, el) => emitSave$(el as HTMLElement)}
            aria-label="Save note"
          >
            Save
          </button>
        </div>
      </div>
      <textarea
        placeholder="Start writing..."
        value={content.value}
        onInput$={(e) => (content.value = (e.target as HTMLTextAreaElement).value)}
      />
      <div class="mt-2">
        <input
          type="text"
          placeholder="tags (comma separated)"
          value={tags.value}
          onInput$={(e) => (tags.value = (e.target as HTMLInputElement).value)}
        />
      </div>
    </div>
  );
});
