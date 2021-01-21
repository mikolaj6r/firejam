export interface ClientRecord {
  disabled: boolean;
  role: "admin" | "client" | "teacher" | "public";
  token: string;
}