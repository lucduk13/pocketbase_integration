import { createSignal, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";

export default function Button(props) {
    const [color, setColor] = createSignal("bg-blue-400");

    onMount(() => {
        if (props.color) {
            setColor(props.color)
        }
    });

    return (
        <>
            <Show when={props.href}>
                <A class={`p-2 ${color()} text-gray-50 font-bold rounded hover:brightness-90`} href={props.href}>{props.label}</A>
            </Show>

            <Show when={!props.href}>
                <button class={`p-2 ${color()} text-gray-50 font-bold rounded hover:brightness-90 cursor-pointer`}>{props.label}</button>
            </Show>
        </>
    );

}