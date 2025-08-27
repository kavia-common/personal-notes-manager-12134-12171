import { component$, Slot, useVisibleTask$, useSignal, $ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { TopBar } from "~/components/TopBar";
import { Sidebar } from "~/components/Sidebar";
import { logout } from "~/lib/auth";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Authenticated app layout with top bar and sidebar. */
  const nav = useNavigate();
  const userEmail = useSignal<string>("");

  useVisibleTask$(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/auth");
      return;
    }
    const u = localStorage.getItem("user");
    try {
      userEmail.value = u ? (JSON.parse(u).email || "") : "";
    } catch {
      userEmail.value = "";
    }
  });

  const onLogout$ = $(() => {
    logout();
    nav("/auth");
  });

  return (
    <div class="app-shell" onUser-logout$={onLogout$}>
      <Sidebar />
      <TopBar userEmail={userEmail.value} onLogout$={onLogout$} />
      <section class="main">
        <Slot />
      </section>
    </div>
  );
});
