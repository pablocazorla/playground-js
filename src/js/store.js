import { atom } from "nanostores";
import { DEFAULT_DATA } from "./constants";

export const CURRENT_SNIPPET = atom(0);

export const SNIPPETS = atom(DEFAULT_DATA);
