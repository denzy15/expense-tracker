import { ExpenseCategory } from "./expenseCategoryDTO";

export interface Expense {
  id: number;
  description: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
}
