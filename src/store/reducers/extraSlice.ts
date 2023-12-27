import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Transaction } from "../../common/types";

interface ExtraInitialState {
  date: Date;
  isNewTransactionModalOpen: boolean;
  isNewCategoryModalOpen: boolean;
  isUpdateCategoryModalOpen: boolean;
  type: Transaction;
}

const initialState: ExtraInitialState = {
  date: new Date(),
  isNewTransactionModalOpen: false,
  isNewCategoryModalOpen: false,
  isUpdateCategoryModalOpen: false,
  type: "expense",
};

export const extraSlice = createSlice({
  name: "extra",
  initialState,
  reducers: {
    decreaseMonth: (state) => {
      const newDate = new Date(state.date);
      const currentMonth = newDate.getMonth();
      const currentYear = newDate.getFullYear();

      if (currentMonth === 0) {
        newDate.setFullYear(currentYear - 1);
        newDate.setMonth(11);
      } else {
        newDate.setMonth(currentMonth - 1);
      }
      state.date = newDate;
    },
    increaseMonth: (state) => {
      const newDate = new Date(state.date);
      const currentMonth = newDate.getMonth();
      const currentYear = newDate.getFullYear();
      if (currentMonth === 11) {
        newDate.setFullYear(currentYear + 1);
        newDate.setMonth(0);
      } else {
        newDate.setMonth(currentMonth + 1);
      }

      state.date = newDate;
    },

    openNewTransactionModal: (state, action: PayloadAction<Transaction>) => {
      state.isNewTransactionModalOpen = true;
      state.type = action.payload;
    },
    closeNewTransactionModal: (state) => {
      state.isNewTransactionModalOpen = false;
    },

    openNewCategoryModal: (state, action: PayloadAction<Transaction>) => {
      state.isNewCategoryModalOpen = true;
      state.type = action.payload;
    },
    closeNewCategoryModal: (state) => {
      state.isNewCategoryModalOpen = false;
    },

    openUpdateCategoryModal: (state, action: PayloadAction<Transaction>) => {
      state.isUpdateCategoryModalOpen = true;
      state.type = action.payload;
    },
    closeUpdateCategoryModal: (state) => {
      state.isUpdateCategoryModalOpen = false;
    },

    changeType: (state, action: PayloadAction<Transaction>) => {
      state.type = action.payload;
    },
  },
});

export const {
  decreaseMonth,
  increaseMonth,
  openNewTransactionModal,
  closeNewTransactionModal,
  openNewCategoryModal,
  closeNewCategoryModal,
  openUpdateCategoryModal,
  closeUpdateCategoryModal,
  changeType,
} = extraSlice.actions;

export default extraSlice.reducer;
