import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import CategoryItem from "../components/CategoryItem";
import {
  openNewCategoryModal,
  openNewTransactionModal,
} from "../store/reducers/extraSlice";
import RecentTransactions from "../components/RecentTransactions";

const IncomesPage = () => {
  const incomeCategoriesState = useAppSelector(
    (state) => state.incomeCategories
  );
  const incomesState = useAppSelector((state) => state.incomes);
  const { date } = useAppSelector((state) => state.extra);

  const dispatch = useAppDispatch();

  const overallMonthIncomesAmount = incomesState.incomes
    .filter((exp) => new Date(exp.date).getMonth() === date.getMonth())
    .reduce((prev, exp) => prev + exp.amount, 0);

  return (
    <Box sx={{ bgcolor: "#fff", p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} alignSelf="center">
          <Typography variant="h6">
            Всего получено за месяц:{" "}
            {overallMonthIncomesAmount.toLocaleString()}₸
          </Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="contained"
            color="success"
            onClick={() => dispatch(openNewCategoryModal("income"))}
          >
            Добавить категорию
          </Button>
        </Grid>
        <Grid item xs={6} md={3}>
          <Button
            variant="outlined"
            onClick={() => dispatch(openNewTransactionModal("income"))}
          >
            Добавить транзакцию
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {incomeCategoriesState.incomeCategories.map((category, i) => (
          <Grid item xs={12} md={6} key={category.name + i}>
            <CategoryItem type="income" category={category} />
          </Grid>
        ))}
      </Grid>
      <RecentTransactions data={incomesState.incomes} type="income" key={"income"}/>
    </Box>
  );
};

export default IncomesPage;
