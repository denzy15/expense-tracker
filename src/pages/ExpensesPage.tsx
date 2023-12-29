import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CategoryItem from "../components/CategoryItem";
import {
  openNewCategoryModal,
  openNewTransactionModal,
} from "../store/reducers/extraSlice";
import RecentTransactions from "../components/RecentTransactions";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

const ExpensesPage: React.FC = () => {
  const expenseCategoriesState = useAppSelector(
    (state) => state.expenseCategories
  );
  const expensesState = useAppSelector((state) => state.expenses);
  const { date } = useAppSelector((state) => state.extra);

  const dispatch: Dispatch<AnyAction> = useAppDispatch();

  const overallMonthExpensesAmount: number = expensesState.expenses
    .filter((exp) => new Date(exp.date).getMonth() === date.getMonth())
    .reduce((prev, exp) => prev + exp.amount, 0);

  return (
    <Box sx={{ bgcolor: "#fff", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} alignSelf="center">
          <Typography variant="h6">
            Всего потрачено за месяц:{" "}
            {overallMonthExpensesAmount.toLocaleString()}₸
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="contained"
            color="success"
            onClick={() => dispatch(openNewCategoryModal("expense"))}
          >
            Добавить категорию
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            onClick={() => dispatch(openNewTransactionModal("expense"))}
          >
            Добавить транзакцию
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {expenseCategoriesState.expenseCategories.map((category, i) => (
          <Grid item xs={12} md={6} key={category.name + i}>
            <CategoryItem type="expense" category={category} />
          </Grid>
        ))}
      </Grid>
      <RecentTransactions
        data={expensesState.expenses}
        type="expense"
        key={"expense"}
      />
    </Box>
  );
};

export default ExpensesPage;
