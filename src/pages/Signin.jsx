import { createSignal, Show } from "solid-js";
import { pb } from "../services/pocketbase";
import { useNavigate } from "@solidjs/router";
import AlertMessage from "../components/AlertMessage";

export default function Signin() {
    const navigate = useNavigate();

    const [error, setError] = createSignal(false);

    async function formSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            await pb.collection("users").authWithPassword(email, password);
            navigate("/");
        } catch (error) {
            console.log("Error", error);
            setError(true);
        }
    }

    return (
        <>
            <div class="text-3xl font-mono font-bold p-2">Prijava korisnika</div>
            <form onSubmit={formSubmit} class="w-md">
                <div class="p-2 flex flex-col gap-1">
                    <label>E-mail</label>
                    <input class="border rounded p-2" type="email" name="email" required="true" />
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <label>Zaporka</label>
                    <input class="border rounded p-2" type="password" name="password" required="true" min="6" />
                </div>

                <div class="p-2 flex flex-col gap-1">
                    <input type="submit" value="Pošalji" class="bg-slate-600 text-white p-2 rounded" />
                </div>
            </form>
            <Show when={error()}>
                <AlertMessage type="error" message="Dogodila se greška prilikom prijave, provjerite svoju e-mail adresu i/ili zaporku." />
            </Show>
        </>);
}