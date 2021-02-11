import * as z from "zod";

export interface FirebaseDoc<T> {
  id: string;
  data: T;
}

export const DocumentID = z.string();

export type DocumentID = z.infer<typeof DocumentID>;
