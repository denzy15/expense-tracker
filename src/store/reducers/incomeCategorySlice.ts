import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../common/axiosInterceptor";
import { SERVER_URL } from "../../common/constants";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { IncomeCategory } from "../../common/dataDTO/incomeCategoryDTO";
import { FetchStatus } from "../../common/types";

interface IncomeCategoryInitialState {
  incomeCategories: IncomeCategory[];
  status: FetchStatus;
  error: any;
  isLoading: boolean;
}

const initialState: IncomeCategoryInitialState = {
  incomeCategories: [],
  error: "",
  status: "idle",
  isLoading: false,
};

export const fetchIncomeCategories = createAsyncThunk(
  "income-categories/get",
  async () => {
    try {
      const response = await axiosInstance.get(
        `${SERVER_URL}/api/income-categories`
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

export const postIncomeCategory = createAsyncThunk(
  "income-categories/create",
  async (data: Pick<IncomeCategory, "name">) => {
    try {
      const result: AxiosResponse<IncomeCategory> = await axiosInstance.post(
        `${SERVER_URL}/api/income-categories`,
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

export const updateIncomeCategory = createAsyncThunk(
  "income-categories/update",
  async (data: IncomeCategory) => {
    try {
      const result: AxiosResponse<IncomeCategory> = await axiosInstance.put(
        `${SERVER_URL}/api/income-categories/${data.id}`,
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

export const deleteIncomeCategory = createAsyncThunk(
  "income-categories/delete",
  async (id: number) => {
    try {
      await axiosInstance.delete(`${SERVER_URL}/api/income-categories/${id}`);
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

export const incomeCategoriesSlice = createSlice({
  name: "income-categories",
  initialState,
  reducers: {
    resetIncomeCategoriesFetchInfo: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchIncomeCategories.pending, (state, action) => {
        state.status = "pending";
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchIncomeCategories.fulfilled, (state, action) => {
        state.incomeCategories = action.payload;
        state.error = null;
        state.status = "successfull get";
        state.isLoading = false;
      })
      .addCase(fetchIncomeCategories.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
        state.incomeCategories = [];
      })

      .addCase(postIncomeCategory.pending, (state, action) => {
        state.status = "pending";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postIncomeCategory.fulfilled, (state, action) => {
        state.incomeCategories = [
          ...state.incomeCategories,
          action.payload.data,
        ];
        state.error = null;
        state.status = "successfull post";
        toast.success("Категория добавлена");
      })
      .addCase(postIncomeCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
      })

      .addCase(updateIncomeCategory.pending, (state, action) => {
        state.status = "pending";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateIncomeCategory.fulfilled, (state, action) => {
        const updatedCategory: IncomeCategory = action.payload.data;
        state.incomeCategories = state.incomeCategories.map((cat) =>
          cat.id === updatedCategory.id
            ? { id: cat.id, name: updatedCategory.name }
            : cat
        );
        state.error = null;
        state.status = "successfull put";
        state.isLoading = false;
        toast.success("Категория обновлена");
      })
      .addCase(updateIncomeCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
      })

      .addCase(deleteIncomeCategory.pending, (state) => {
        state.status = "pending";
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteIncomeCategory.fulfilled, (state, action) => {
        state.incomeCategories = state.incomeCategories.filter(
          (category) => category.id !== action.payload
        );
        state.error = null;
        state.status = "successfull delete";
        state.isLoading = false;
        toast.success("Категория удалена");
      })
      .addCase(deleteIncomeCategory.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "idle";
        state.isLoading = false;
      });
  },
});

export const { resetIncomeCategoriesFetchInfo } = incomeCategoriesSlice.actions;

export default incomeCategoriesSlice.reducer;
