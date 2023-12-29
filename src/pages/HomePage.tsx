import {
  Backdrop,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { countBalance } from "../common/utils";
import MiniCategoryItem from "../components/MiniCategoryItem";
import AddIcon from "@mui/icons-material/AddBox";
import SavingItem from "../components/SavingItem";
import { useState } from "react";
import NewSavingForm from "../components/NewSavingForm";
import { openNewTransactionModal } from "../store/reducers/extraSlice";
import PieChartComponent from "../components/PieChartComponent";

const HomePage = () => {
  const savingsState = useAppSelector((state) => state.savings);
  const expensesState = useAppSelector((state) => state.expenses);
  const expenseCategoriesState = useAppSelector(
    (state) => state.expenseCategories
  );

  const dispatch = useAppDispatch();
  const incomeCategoriesState = useAppSelector(
    (state) => state.incomeCategories
  );
  const incomesState = useAppSelector((state) => state.incomes);
  const { date } = useAppSelector((state) => state.extra);

  const overallMonthExpensesAmount: number = expensesState.expenses
    .filter((exp) => new Date(exp.date).getMonth() === date.getMonth())
    .reduce((prev, exp) => prev + exp.amount, 0);

  const overallMonthIncomesAmount: number = incomesState.incomes
    .filter((exp) => new Date(exp.date).getMonth() === date.getMonth())
    .reduce((prev, exp) => prev + exp.amount, 0);

  const [newSavingModal, setNewSavingModal] = useState(false);

  return (
    <Box sx={{ bgcolor: "#fff", p: 2 }}>
      <Box>
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{ mb: 2 }}
          spacing={2}
          justifyContent={"center"}
        >
          <Typography variant="h6">
            Кошелёк: {countBalance(savingsState.savings).toLocaleString()} ₸
          </Typography>
          <IconButton onClick={() => setNewSavingModal(true)}>
            <AddIcon />
          </IconButton>
        </Stack>
        <Stack
          direction={"row"}
          gap={2}
          sx={{ flexWrap: "wrap", justifyContent: "center" }}
        >
          {savingsState.savings.map((s) => (
            <SavingItem saving={s} key={s.id} />
          ))}
        </Stack>
      </Box>
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-evenly"
        sx={{ my: 5 }}
      >
        <Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            justifyContent={"center"}
            mb={2}
          >
            <Typography
              variant="h6"
              sx={{ "& span": { borderBottom: "3px solid red", px: 1 } }}
            >
              Расходы:{" "}
              <span> {overallMonthExpensesAmount.toLocaleString()} ₸</span>
            </Typography>
            <IconButton
              onClick={() => dispatch(openNewTransactionModal("expense"))}
            >
              <AddIcon />
            </IconButton>
          </Stack>
          {expenseCategoriesState.expenseCategories.map((cat, i) => (
            <MiniCategoryItem key={i} type="expense" category={cat} />
          ))}
        </Box>
        <Box>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            justifyContent={"center"}
            mb={2}
          >
            <Typography
              variant="h6"
              mb={2}
              sx={{ "& span": { borderBottom: "3px solid #34C716", px: 1 } }}
            >
              Доходы:{" "}
              <span>{overallMonthIncomesAmount.toLocaleString()} ₸</span>
            </Typography>
            <IconButton
              onClick={() => dispatch(openNewTransactionModal("income"))}
            >
              <AddIcon />
            </IconButton>
          </Stack>
          {incomeCategoriesState.incomeCategories.map((cat, i) => (
            <MiniCategoryItem key={i} type="income" category={cat} />
          ))}
        </Box>
      </Stack>
      {newSavingModal && (
        <Backdrop open={newSavingModal} sx={{ zIndex: 2 }}>
          <NewSavingForm close={() => setNewSavingModal(false)} />
        </Backdrop>
      )}
      <Divider />
      <Typography sx={{ textAlign: "center", my: 2 }} variant="h5">
        Статистика:
      </Typography>
      <Stack
        direction={{ xs: "column" }}
        spacing={1}
        // justifyContent={"center"}
        // alignItems={"center"}
      >
        <PieChartComponent type="expense" propsData={expensesState.expenses} />
        <Divider sx={{ py: 2 }} />
        <PieChartComponent type="income" propsData={incomesState.incomes} />
      </Stack>
    </Box>
  );
};

export default HomePage;
