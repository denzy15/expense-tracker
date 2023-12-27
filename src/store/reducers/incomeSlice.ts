import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Income } from "../../common/dataDTO/incomeDTO";
import axiosInstance from "../../common/axiosInterceptor";
import { SERVER_URL } from "../../common/constants";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { TransactionPutRequestDTO } from "../../common/dataDTO/transactionPutRequestDTO";
import { TransactionPostRequestDTO } from "../../common/dataDTO/transactionPostRequestDTO";
import { FetchStatus } from "../../common/types";


interface IncomeInitialState {
  incomes: Income[];
  isLoading: boolean;
  error: any;
  status: FetchStatus;
}

const initialState: IncomeInitialState = {
  incomes: [],
  error: null,
  status: "idle",
  isLoading: false,
};

export const fetchIncomes = createAsyncThunk("incomes/get", async () => {
  try {
    const response = await axiosInstance.get(`${SERVER_URL}/api/incomes`);
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

export const postIncome = createAsyncThunk(
  "incomes/create",
  async (data: TransactionPostRequestDTO) => {
    try {
      const result: AxiosResponse<Income> = await axiosInstance.post(
        `${SERVER_URL}/api/incomes`,
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

export const updateIncome = createAsyncThunk(
  "incomes/update",
  async (data: TransactionPutRequestDTO) => {
    const { id, ...rest } = data;

    const reqBody = rest;

    try {
      const result: AxiosResponse<Income> = await axiosInstance.put(
        `${SERVER_URL}/api/incomes/${id}`,
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

export const deleteIncome = createAsyncThunk(
  "incomes/delete",
  async (id: number) => {
    try {
      await axiosInstance.delete(`${SERVER_URL}/api/incomes/${id}`);
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

export const incomeSlice = createSlice({
  name: "incomes",
  initialState,
  reducers: {
    resetIncomesFetchInfo: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchIncomes.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(fetchIncomes.fulfilled, (state, action) => {
        state.incomes = action.payload;
        state.error = null;
        state.status = "successfull get";
        state.isLoading = false;
      })
      .addCase(fetchIncomes.rejected, (state, action) => {
        state.error = action.error.message;
        state.incomes = [];
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(postIncome.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(postIncome.fulfilled, (state, action) => {
        state.incomes = [...state.incomes, action.payload.data];
        toast.success("Транзакция добавлена");
        state.error = null;
        state.isLoading = false;
        state.status = "successfull post";
      })
      .addCase(postIncome.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(updateIncome.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(updateIncome.fulfilled, (state, action) => {
        const updatedIncome: Income = action.payload.data;
        state.incomes = state.incomes.map((exp) =>
          exp.id === updatedIncome.id ? updatedIncome : exp
        );
        state.error = null;
        state.isLoading = false;
        state.status = "successfull put";

        toast.success("Транзакция обновлена");
      })
      .addCase(updateIncome.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(deleteIncome.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(deleteIncome.fulfilled, (state, action) => {
        state.incomes = state.incomes.filter(
          (exp) => exp.id !== action.payload
        );
        state.error = null;
        state.isLoading = false;
        state.status = "successfull delete";
        toast.success("Транзакция удалена");
      })
      .addCase(deleteIncome.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      });
  },
});

export const { resetIncomesFetchInfo } = incomeSlice.actions;
export default incomeSlice.reducer;
