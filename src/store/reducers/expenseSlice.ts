import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Expense } from "../../common/dataDTO/expenseDTO";
import { TransactionPostRequestDTO } from "../../common/dataDTO/transactionPostRequestDTO";
import axiosInstance from "../../common/axiosInterceptor";
import { SERVER_URL } from "../../common/constants";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { TransactionPutRequestDTO } from "../../common/dataDTO/transactionPutRequestDTO";
import { FetchStatus } from "../../common/types";

interface ExpenseInitialState {
  expenses: Expense[];
  isLoading: boolean;
  error: any;
  status: FetchStatus;
}

const initialState: ExpenseInitialState = {
  expenses: [],
  error: null,
  status: "idle",
  isLoading: false,
};

export const fetchExpenses = createAsyncThunk("expenses/get", async () => {
  try {
    const response = await axiosInstance.get(`${SERVER_URL}/api/expenses`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      JSON.stringify({
        message: error.response.data,
        status: error.response.status,
      })
    );
  }
});

export const postExpense = createAsyncThunk(
  "expenses/create",
  async (data: TransactionPostRequestDTO) => {
    try {
      const result: AxiosResponse<Expense> = await axiosInstance.post(
        `${SERVER_URL}/api/expenses`,
        data
      );
      return result;
    } catch (error: any) {
      throw new Error(
        JSON.stringify({
          message: error.response.data,
          status: error.response.status,
        })
      );
    }
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/update",
  async (data: TransactionPutRequestDTO) => {
    const { id, ...rest } = data;

    const reqBody = rest;

    try {
      const result: AxiosResponse<Expense> = await axiosInstance.put(
        `${SERVER_URL}/api/expenses/${id}`,
        reqBody
      );
      return result;
    } catch (error: any) {
      throw new Error(
        JSON.stringify({
          message: error.response.data,
          status: error.response.status,
        })
      );
    }
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id: number) => {
    try {
      await axiosInstance.delete(`${SERVER_URL}/api/expenses/${id}`);
      return id;
    } catch (error: any) {
      throw new Error(
        JSON.stringify({
          message: error.response.data,
          status: error.response.status,
        })
      );
    }
  }
);

export const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    resetExpensesFetchInfo: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchExpenses.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.expenses = action.payload;
        state.error = null;
        state.status = "successfull get";
        state.isLoading = false;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.error = action.error.message;
        state.expenses = [];
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(postExpense.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(postExpense.fulfilled, (state, action) => {
        state.expenses = [...state.expenses, action.payload.data];
        toast.success("Транзакция добавлена");
        state.error = null;
        state.isLoading = false;
        state.status = "successfull post";
      })
      .addCase(postExpense.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(updateExpense.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const updatedExpense: Expense = action.payload.data;
        state.expenses = state.expenses.map((exp) =>
          exp.id === updatedExpense.id ? updatedExpense : exp
        );
        state.error = null;
        state.isLoading = false;
        state.status = "successfull put";
        
        toast.success("Транзакция обновлена");
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(deleteExpense.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(
          (exp) => exp.id !== action.payload
        );
        state.error = null;
        state.isLoading = false;
        state.status = "successfull delete";
        toast.success("Транзакция удалена");
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      });
  },
});

export const { resetExpensesFetchInfo } = expenseSlice.actions;
export default expenseSlice.reducer;
