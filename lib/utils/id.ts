import { nanoid } from "nanoid";

// 32-char nanoid for session IDs — long enough for private-by-obscurity
export function createSessionId() {
  return nanoid(32);
}

// 21-char nanoid for internal records (generations, events)
export function createId() {
  return nanoid();
}
