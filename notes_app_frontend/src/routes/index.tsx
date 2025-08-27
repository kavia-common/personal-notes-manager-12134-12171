import { component$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { DocumentHead } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export default component$(() => {
  const nav = useNavigate();
  useVisibleTask$(() => {
    const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    nav(token ? "/app" : "/auth");
  });
  return <div />;
});

export const head: DocumentHead = {
  title: "Notes App",
  meta: [
    {
      name: "description",
      content: "Minimalistic notes app in Qwik",
    },
  ],
};
