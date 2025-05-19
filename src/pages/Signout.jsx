import { onMount } from "solid-js";
import { pb } from "../services/pocketbase";
import AlertMessage from "../components/AlertMessage";

export default function Signout() {

    onMount(async () => {
        pb.authStore.clear();
    });

    return (
        <AlertMessage message="Uspješno ste se odjavili." />
    );
}