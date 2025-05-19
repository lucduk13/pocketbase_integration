import { createContext, createSignal, useContext, Show, onMount } from "solid-js";
import { pb } from "../services/pocketbase";

// context
const AuthContext = createContext();

// helper
export function useAuth() {
    return useContext(AuthContext);
}

// component
export function AuthProvider(props) {
    const [user, setUser] = createSignal(null);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        try {
            const result = await pb.collection("users").authRefresh();
            const userData = result.record;
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    });

    pb.authStore.onChange((token, model) => {
        setUser(model);
    });

    return (
        <Show when={!loading()}>
            <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
        </Show>
    );
}