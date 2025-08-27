import { component$, $ } from "@builder.io/qwik";

interface TopBarProps {
  userEmail?: string;
  onLogout$?: () => void;
}

export const TopBar = component$<TopBarProps>((props) => {
  const emitLogout$ = $((host: HTMLElement) => {
    host.dispatchEvent(new CustomEvent("user-logout", { bubbles: true }));
  });

  return (
    <header class="topbar" onUser-logout$={(_, el) => emitLogout$(el)}>
      <div class="row">
        <strong>Notes</strong>
        <span class="badge" title="Light minimal style">v1</span>
      </div>
      <div class="row" style={{ gap: "0.75rem" }}>
        <span class="small">{props.userEmail || "Guest"}</span>
        {props.onLogout$ && (
          <button class="ghost" onClick$={(_, el) => emitLogout$(el as HTMLElement)} aria-label="Logout">
            Logout
          </button>
        )}
      </div>
    </header>
  );
});
