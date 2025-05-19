//mozda contacts promijenit s entries ak hoces
import { createSignal, onMount, For, Show } from "solid-js";
import { useAuth } from "../components/AuthProvider";
import { pb } from "../services/pocketbase";
import Button from "../components/Button";
import AlertMessage from "../components/AlertMessage";

export default function Home() {
  const user = useAuth();

  const [contacts, setContacts] = createSignal([]);
  const [error, setError] = createSignal(false);

  onMount(async () => {
    await loadContacts();
  });

  async function loadContacts() {
    setError(false);
    try {
      const result = await pb.collection("contacts").getFullList({
        sort: "-created",
      });
      setContacts(result);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  async function deleteContact(contactId) {
    setError(false);
    try {
      await pb.collection("contacts").delete(contactId);
      setContacts(old => old.filter(contact => contact.id !== contactId));
    } catch (error) {
      console.log(error);
      setError(true);
    }
  }

  return (
    <div class="p-2">
      <div class="text-3xl font-mono font-bold p-2">Unosi</div>

      <Show when={error()}>
        <AlertMessage type="error" message="Dogodila se greška, provjerite podatke." />
      </Show>

      <For each={contacts()}>
        {(contact) => (
          <div class="flex flex-row items-center gap-2 w-full p-4 rounded bg-amber-100 mb-2">
            <div class="flex-1">
              <div class="text-2xl">{contact.name}</div>
              <div class="line-clamp-3 text-xs">{contact.email}</div>
            </div>
            <div class="flex flex-row gap-1">
              <Button label="Uredi" />
              <span onClick={async () => await deleteContact(contact.id)}>
                <Button label="Obriši" color="bg-red-400" />
              </span>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
