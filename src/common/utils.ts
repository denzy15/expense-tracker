import React from "react";
import { Expense } from "./dataDTO/expenseDTO";
import { Income } from "./dataDTO/incomeDTO";
import { Saving } from "./dataDTO/savingDTO";

export function onChangeHandler(
  e: React.ChangeEvent<HTMLInputElement>,
  setState: React.Dispatch<React.SetStateAction<any>>
) {
  const { name, value } = e.target;
  setState((prev: any) => ({ ...prev, [name]: value }));
}

export const getMonthName = (monthNumber: number): string => {
  const months = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  if (monthNumber >= 1 && monthNumber <= 12) {
    return months[monthNumber - 1];
  } else {
    return "Неверный номер месяца";
  }
};

export const getRandomColor = (): string => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const sortTransactionsByDate = (data: Expense[] | Income[]) => {
  return data
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const countBalance = (balance: Saving[]) => {
  return balance.reduce((prev, curr) => prev + curr.amount, 0);
};
