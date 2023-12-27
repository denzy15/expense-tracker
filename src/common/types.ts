export type Transaction = "expense" | "income";

export type FetchStatus =
  | "idle"
  | "pending"
  | "successfull get"
  | "successfull post"
  | "successfull put"
  | "successfull delete";
