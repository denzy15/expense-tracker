import { IncomeCategory } from "./incomeCategoryDTO";

export interface Income {
  id: number;
  description: string;
  date: string;
  amount: number;
  category: IncomeCategory;
}
