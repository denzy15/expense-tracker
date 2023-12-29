import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import extraReducer from "./reducers/extraSlice";
import expenseReducer from "./reducers/expenseSlice";
import incomeCategoryReducer from "./reducers/incomeCategorySlice";
import incomeReducer from "./reducers/incomeSlice";
import savingReducer from "./reducers/savingSlice";
import expenseCategoryReducer from "./reducers/expenseCategorySlice";
// import storage from "redux-persist/es/storage";
import storageSession from "redux-persist/lib/storage/session";
import { Persistor, persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  auth: authReducer,
  expenses: expenseReducer,
  expenseCategories: expenseCategoryReducer,
  incomeCategories: incomeCategoryReducer,
  incomes: incomeReducer,
  savings: savingReducer,
  extra: extraReducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  // storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor: Persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
