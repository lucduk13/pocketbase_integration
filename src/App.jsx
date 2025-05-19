import { A, Navigate, Route, Router } from "@solidjs/router";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { Show } from "solid-js";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signout from "./pages/Signout";
import Signup from "./pages/Signup";
import Error from "./pages/Error";
import Button from "./components/Button";

export default function App() {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Home} />
        <Route path="/signin" component={Signin} />
        <Route path="/signout" component={Signout} />
        <Route path="/signup" component={Signup} />
        <Route path="/error" component={Error} />
        <Route path="*" component={() => <Navigate href="/error" />} />
      </Router>
    </AuthProvider>
  );
}

function Layout(props) {
  const appName = import.meta.env.VITE_APP_NAME;
  const user = useAuth();
  return (
    <div class="min-h-screen flex flex-col">
      <header class="flex flex-row flex-wrap gap-2 items-center p-2 flex-none">
        <div class="flex-none">
          <A class="text-4xl font-bold font-sans uppercase text-cyan-600" href="/">{appName}</A>
        </div>
        <nav class="flex-1 flex gap-2 justify-end">
          <Show when={user()}>
            <Button href="/" label="Kontakti" />
            <Button href="/signout" label="Odjava" color="bg-pink-500" />
          </Show>
          <Show when={!user()}>
            <Button href="/signin" label="Prijava" color="bg-amber-500" />
            <Button href="/signup" label="Registracija" />
          </Show>
        </nav>
      </header>

      <main class="flex-1">{props.children}</main>
      <footer class="flex-none py-6 px-2 bg-cyan-700 text-white text-sm text-center">
        Copyright {appName}
      </footer>
    </div>
  );
}
