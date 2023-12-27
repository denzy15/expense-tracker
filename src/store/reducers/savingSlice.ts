import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Saving } from "../../common/dataDTO/savingDTO";
import { FetchStatus } from "../../common/types";
import { SERVER_URL } from "../../common/constants";
import { AxiosResponse } from "axios";
import axiosInstance from "../../common/axiosInterceptor";
import { toast } from "react-toastify";

interface SavingsInitialState {
  savings: Saving[];
  isLoading: boolean;
  error: string | null | undefined;
  status: FetchStatus;
}

const initialState: SavingsInitialState = {
  savings: [],
  error: null,
  status: "idle",
  isLoading: false,
};

export const fetchSavings = createAsyncThunk("savings/get", async () => {
  try {
    const response: AxiosResponse<Saving[]> = await axiosInstance.get(
      `${SERVER_URL}/api/savings`
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
});

export const postSaving = createAsyncThunk(
  "savings/create",
  async (data: Pick<Saving, "name" | "amount">) => {
    try {
      const result: AxiosResponse<Saving> = await axiosInstance.post(
        `${SERVER_URL}/api/savings`,
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

export const updateSaving = createAsyncThunk(
  "savings/update",
  async (data: Saving) => {
    const { id, ...rest } = data;

    const reqBody = rest;

    try {
      const result: AxiosResponse<Saving> = await axiosInstance.put(
        `${SERVER_URL}/api/savings/${id}`,
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

export const deleteSaving = createAsyncThunk(
  "savings/delete",
  async (id: number) => {
    try {
      await axiosInstance.delete(`${SERVER_URL}/api/savings/${id}`);
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

export const savingSlice = createSlice({
  name: "savings",
  initialState,
  reducers: {
    resetSavingsFetchInfo: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSavings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(fetchSavings.fulfilled, (state, action) => {
        state.savings = action.payload;
        state.error = null;
        state.status = "successfull get";
        state.isLoading = false;
      })
      .addCase(fetchSavings.rejected, (state, action) => {
        state.error = action.error.message;
        state.savings = [];
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(postSaving.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(postSaving.fulfilled, (state, action) => {
        state.savings = [...state.savings, action.payload.data];
        toast.success("Кошелёк добавлен");
        state.error = null;
        state.isLoading = false;
        state.status = "successfull post";
      })
      .addCase(postSaving.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(updateSaving.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(updateSaving.fulfilled, (state, action) => {
        const updatedSaving: Saving = action.payload.data;
        state.savings = state.savings.map((sav) =>
          sav.id === updatedSaving.id ? updatedSaving : sav
        );
        state.error = null;
        state.isLoading = false;
        state.status = "successfull put";
        toast.success("Кошелёк обновлён");
      })
      .addCase(updateSaving.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      })

      .addCase(deleteSaving.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
        state.status = "pending";
      })
      .addCase(deleteSaving.fulfilled, (state, action) => {
        state.savings = state.savings.filter(
          (sav) => sav.id !== action.payload
        );
        state.error = null;
        state.isLoading = false;
        state.status = "successfull delete";
        toast.success("Кошелёк удалён");
      })
      .addCase(deleteSaving.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
        state.status = "idle";
      });
  },
});

export const { resetSavingsFetchInfo } = savingSlice.actions;
export default savingSlice.reducer;
