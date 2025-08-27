import { component$, useSignal, $ } from "@builder.io/qwik";
import { Form, Link, useNavigate } from "@builder.io/qwik-city";
import { register } from "~/lib/auth";

// PUBLIC_INTERFACE
export default component$(() => {
  /** Registration page for new users. */
  const name = useSignal("");
  const email = useSignal("");
  const password = useSignal("");
  const error = useSignal<string | null>(null);
  const loading = useSignal(false);
  const nav = useNavigate();

  const onSubmit$ = $(async () => {
    try {
      loading.value = true;
      error.value = null;
      const res = await register(name.value.trim(), email.value.trim(), password.value);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      nav("/app");
    } catch (e: any) {
      error.value = e?.message || "Registration failed";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="page-container" style={{ flexDirection: "column", gap: "1rem" }}>
      <h1 class="main-title">Create your account</h1>
      <div class="card p-4" style={{ minWidth: "320px", maxWidth: "420px" }}>
        {error.value && <div class="small" style={{ color: "crimson" }}>{error.value}</div>}
        <Form preventdefault:submit onSubmit$={onSubmit$}>
          <div class="mt-2">
            <label class="small">Name</label>
            <input
              type="text"
              value={name.value}
              onInput$={(e) => (name.value = (e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <div class="mt-2">
            <label class="small">Email</label>
            <input
              type="email"
              value={email.value}
              onInput$={(e) => (email.value = (e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <div class="mt-2">
            <label class="small">Password</label>
            <input
              type="password"
              value={password.value}
              onInput$={(e) => (password.value = (e.target as HTMLInputElement).value)}
              required
            />
          </div>
          <div class="mt-3 row" style={{ justifyContent: "flex-end" }}>
            <button class="primary" type="submit" disabled={loading.value}>
              {loading.value ? "Creating..." : "Create account"}
            </button>
          </div>
        </Form>
        <div class="separator" />
        <div class="small">
          Already have an account? <Link href="/auth">Sign in</Link>
        </div>
      </div>
    </div>
  );
});
