import { createSignal, Show, For, onMount, createEffect } from "solid-js";
import { pb } from "../services/pocketbase";
import { useAuth } from "../components/AuthProvider";
import AlertMessage from "../components/AlertMessage";
import Button from "../components/Button";
import { A } from "@solidjs/router";

export default function Tasks() {
    const user = useAuth();

    const [success, setSuccess] = createSignal(false);
    const [error, setError] = createSignal(false);
    const [tasks, setTasks] = createSignal([]);
    const [selectedTask, setSelectedTask] = createSignal(null);

    onMount(async () => {
        await loadTasks();
    });

    createEffect(() => {
        if (success() === true) {
            setTimeout(() => setSuccess(false), 3000);
        }
    });

    async function loadTasks() {
        setError(false);
        try {
            const result = await pb.collection("tasks").getFullList({
                sort: "-created",
            });
            setTasks(result);
        } catch (error) {
            console.log(error);
            setError(true);
        }
    }

    async function deleteTask(task) {
        setError(false);
        try {
            await pb.collection("tasks").delete(task.id);
            await loadTasks();
        } catch (error) {
            console.log(error);
            setError(true);
        }
    }

    function editTask(task) {
        setSelectedTask(task);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setSuccess(false);
        setError(false);

        const formData = new FormData(event.target);
        const title = formData.get("title");
        const description = formData.get("description");
        const dueDate = formData.get("dueDate");
        const priority = formData.get("priority");

        try {
            const taskData = {
                title,
                description,
                dueDate: new Date(dueDate),
                priority,
                author: user().id,
            };

            if (selectedTask()) {
                await pb.collection("tasks").update(selectedTask().id, taskData);
                setSelectedTask(null);
            } else {
                await pb.collection("tasks").create(taskData);
            }

            await loadTasks();
            setSuccess(true);

            event.target.reset();
        } catch (error) {
            console.log(error);
            setError(true);
        }
    }

    return (
        <>
            <div class="text-3xl font-mono font-bold p-2">Zadaci</div>

            <Show when={success()}>
                <AlertMessage message="Operacija uspješno izvršena" />
            </Show>

            <Show when={error()}>
                <AlertMessage type="error" message="Dogodila se greška, provjerite podatke." />
            </Show>

            <div class="flex flex-row flex-wrap-reverse gap-2">

                <form onSubmit={handleSubmit} class="w-md flex-none">
                    <div class="p-2 flex flex-col gap-1">
                        <label>Naziv</label>
                        <input class="border rounded p-2" type="text" name="title" required value={selectedTask()?.title || ""} />
                    </div>

                    <div class="p-2 flex flex-col gap-1">
                        <label>Opis</label>
                        <textarea class="border rounded p-2 h-40" name="description" required value={selectedTask()?.description || ""}></textarea>
                    </div>

                    <div class="p-2 flex flex-col gap-1">
                        <label>Rok</label>
                        <input class="border rounded p-2" type="datetime-local" name="dueDate" required value={selectedTask() ? new Date(selectedTask().dueDate).toISOString().slice(0, 16) : ""} />
                    </div>

                    <div class="p-2 flex flex-col gap-1">
                        <label>Prioritet</label>
                        <input class="border rounded p-2" type="number" name="priority" step="1" min="1" required value={selectedTask()?.priority || ""} />
                    </div>

                    <div class="p-2 flex flex-row gap-1">
                        <input type="submit" value="Pošalji" class="flex-1 bg-slate-600 text-white p-2 rounded" />
                        <input type="reset" value="Poništi" class="flex-1 bg-slate-300 text-white p-2 rounded" />
                    </div>
                </form>

                <div class="flex-1 p-2">
                    <For each={tasks()}>
                        {(task) => (
                            <div class="flex flex-row items-center gap-2 w-full p-4 rounded bg-amber-100 mb-2">
                                <div class="flex-1">
                                    <div class="text-2xl">{task.title}</div>
                                    <div class="line-clamp-3 text-xs">{task.description}</div>
                                </div>
                                <div class="flex flex-col">
                                    <div>{new Date(task.dueDate).toLocaleDateString("hr")}</div>
                                    <div class="text-[0.5em]">Rok</div>
                                </div>
                                <div class="flex flex-row gap-1">
                                    <span onClick={() => editTask(task)}><Button label="Uredi" /></span>
                                    <span onClick={() => deleteTask(task)}><Button label="Obriši" color="bg-red-400" /></span>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </div>
        </>
    );
}
