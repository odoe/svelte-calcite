import { writable } from "svelte/store";

export const state = writable({
    view: null,
    item: {}
});