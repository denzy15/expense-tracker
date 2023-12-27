import { useEffect, useState } from "react";
import { Alert, Backdrop, Box, Grid } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ExpensesPage from "./ExpensesPage";
import IncomesPage from "./IncomesPage";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchExpenses,
  resetExpensesFetchInfo,
} from "../store/reducers/expenseSlice";
import { fetchExpenseCategories } from "../store/reducers/expenseCategorySlice";
import MonthSwitcher from "../components/MonthSwitcher";
import { signOut } from "../store/reducers/authSlice";
import NewTransaction from "../components/NewTransaction";
import NewCategory from "../components/NewCategory";
import TransactionsByCategory from "./TransactionsByCategory";
import { fetchIncomeCategories } from "../store/reducers/incomeCategorySlice";
import {
  fetchIncomes,
  resetIncomesFetchInfo,
} from "../store/reducers/incomeSlice";
import {
  fetchSavings,
  resetSavingsFetchInfo,
} from "../store/reducers/savingSlice";

const Main = () => {
  const dispatch = useAppDispatch();
  const expensesState = useAppSelector((state) => state.expenses);
  const incomesState = useAppSelector((state) => state.incomes);
  const savingsState = useAppSelector((state) => state.savings);

  const { isNewCategoryModalOpen, isNewTransactionModalOpen, type } =
    useAppSelector((expensesState) => expensesState.extra);

  const [fetchError, setFetchError] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchExpenseCategories() as any);
    dispatch(fetchIncomeCategories() as any);
    dispatch(fetchExpenses() as any);
    dispatch(fetchIncomes() as any);
    dispatch(fetchSavings() as any);
  }, []);

  useEffect(() => {
    if (!!expensesState.error) {
      setFetchError(expensesState.error);
    }

    if (fetchError && fetchError.status === 401) {
      dispatch(signOut());
    }
  }, [
    dispatch,
    expensesState.error,
    fetchError,
    incomesState.error,
    savingsState.error,
  ]);

  useEffect(() => {
    if (
      type === "expense" &&
      (expensesState.status === "successfull put" ||
        expensesState.status === "successfull delete")
    )
      dispatch(resetExpensesFetchInfo());
    else if (
      incomesState.status === "successfull put" ||
      incomesState.status === "successfull delete"
    ) {
      dispatch(resetIncomesFetchInfo());
    }

    if (
      savingsState.status === "successfull put" ||
      savingsState.status === "successfull delete"
    ) {
      dispatch(resetSavingsFetchInfo());
    }
  }, [
    dispatch,
    expensesState.status,
    incomesState.status,
    savingsState.status,
    type,
  ]);

  return (
    <Grid container rowGap={2} sx={{ bgcolor: "#f1f6f9" }}>
      <Grid item xs={12}>
        <Navbar />
      </Grid>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} sx={{ pl: 1 }}>
        <MonthSwitcher />
        {expensesState.isLoading ? (
          <Box>Loading...</Box>
        ) : (
          <Routes>
            <Route index path="/" element={<HomePage />} />
            <Route index path="/incomes" element={<IncomesPage />} />
            <Route index path="/expenses" element={<ExpensesPage />} />
            <Route
              index
              path="/:type/:id"
              element={<TransactionsByCategory />}
            />
            <Route
              index
              path="*"
              element={
                <Alert severity="warning">Error 404: Страница не найдена</Alert>
              }
            />
          </Routes>
        )}
        {isNewTransactionModalOpen && (
          <Backdrop open={isNewTransactionModalOpen} sx={{ zIndex: 2 }}>
            <NewTransaction />
          </Backdrop>
        )}
        {isNewCategoryModalOpen && (
          <Backdrop open={isNewCategoryModalOpen} sx={{ zIndex: 2 }}>
            <NewCategory />
          </Backdrop>
        )}
      </Grid>
    </Grid>
  );
};

export default Main;
