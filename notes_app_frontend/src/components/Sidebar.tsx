import { component$, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export const Sidebar = component$(() => {
  return (
    <aside class="sidebar">
      <div class="row space-between mb-3">
        <div style={{ fontWeight: 600, color: "var(--color-secondary)" }}>
          Navigation
        </div>
      </div>
      <div class="card p-2">
        <nav class="row" style={{ flexDirection: "column", gap: ".25rem" }}>
          <Link href="/app" class="row">All Notes</Link>
          <Link href="/app/new" class="row">New Note</Link>
          <Link href="/app/search" class="row">Search</Link>
        </nav>
      </div>
      <Slot />
    </aside>
  );
});
