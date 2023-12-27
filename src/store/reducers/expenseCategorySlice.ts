import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../common/axiosInterceptor";
import { SERVER_URL } from "../../common/constants";
import { ExpenseCategory } from "../../common/dataDTO/expenseCategoryDTO";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { FetchStatus } from "../../common/types";

interface ExpenseCategoryInitialState {
  expenseCategories: ExpenseCategory[];
  status: FetchStatus;
  error: any;
  isLoading: boolean;
}

const initialState: ExpenseCategoryInitialState = {
  expenseCategories: [],
  error: "",
  status: "idle",
  isLoading: false,
};

export const fetchExpenseCategories = createAsyncThunk(
  "expense-categories/get",
  async () => {
    try {
      const response = await axiosInstance.get(
        `${SERVER_URL}/api/expense-categories`
      );
      return response.data;
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

export const postExpenseCategory = createAsyncThunk(
  "expense-categories/create",
  async (data: Pick<ExpenseCategory, "name">) => {
    try {
      const result: AxiosResponse<ExpenseCategory> = await axiosInstance.post(
        `${SERVER_URL}/api/expense-categories`,
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

export const updateExpenseCategory = createAsyncThunk(
  "expense-categories/update",
  async (data: ExpenseCategory) => {
    try {
      const result: AxiosResponse<ExpenseCategory> = await axiosInstance.put(
        `${SERVER_URL}/api/expense-categories/${data.id}`,
        { name: data.name }
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

export const deleteExpenseCategory = createAsyncThunk(
  "expense-categories/delete",
  async (id: number) => {
    try {
      await axiosInstance.delete(`${SERVER_URL}/api/expense-categories/${id}`);
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

export const expenseCategoriesSlice = createSlice({
  name: "expense-categories",
  initialState,
  reducers: {
    resetExpenseCategoriesFetchInfo: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchExpenseCategories.pending, (state, action) => {
        state.status = "pending";
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchExpenseCategories.fulfilled, (state, action) => {
        state.expenseCategories = action.payload;
        state.error = null;
        state.status = "successfull get";
        state.isLoading = false;
      })
      .addCase(fetchExpenseCategories.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
        state.expenseCategories = [];
      })

      .addCase(postExpenseCategory.pending, (state, action) => {
        state.status = "pending";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postExpenseCategory.fulfilled, (state, action) => {
        state.expenseCategories = [
          ...state.expenseCategories,
          action.payload.data,
        ];
        state.error = null;
        state.status = "successfull post";
        toast.success("Категория добавлена");
      })
      .addCase(postExpenseCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
      })

      .addCase(updateExpenseCategory.pending, (state, action) => {
        state.status = "pending";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExpenseCategory.fulfilled, (state, action) => {
        const updatedCategory: ExpenseCategory = action.payload.data;
        state.expenseCategories = state.expenseCategories.map((cat) =>
          cat.id === updatedCategory.id
            ? { id: cat.id, name: updatedCategory.name }
            : cat
        );
        state.error = null;
        state.status = "successfull put";
        state.isLoading = false;
        toast.success("Категория обновлена");
      })
      .addCase(updateExpenseCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
      })

      .addCase(deleteExpenseCategory.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExpenseCategory.fulfilled, (state, action) => {
        state.expenseCategories = state.expenseCategories.filter(
          (category) => category.id !== action.payload
        );
        state.error = null;
        state.status = "successfull delete";
        state.isLoading = false;
        toast.success("Категория удалена");
      })
      .addCase(deleteExpenseCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
      });
  },
});

export const { resetExpenseCategoriesFetchInfo } =
  expenseCategoriesSlice.actions;
export default expenseCategoriesSlice.reducer;
