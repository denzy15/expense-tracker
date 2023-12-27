import { Box, Paper, Typography } from "@mui/material";
import { ExpenseCategory } from "../common/dataDTO/expenseCategoryDTO";
import { IncomeCategory } from "../common/dataDTO/incomeCategoryDTO";
import { Transaction } from "../common/types";
import { getRandomColor } from "../common/utils";
import { useAppSelector } from "../store/hooks";

type Props = {
  category: ExpenseCategory | IncomeCategory;
  type: Transaction;
};

const MiniCategoryItem = ({ category, type }: Props) => {
  const expensesState = useAppSelector((state) => state.expenses);
  const incomesState = useAppSelector((state) => state.incomes);
  const { date } = useAppSelector((state) => state.extra);

  const filterAndCountByCategory = () => {
    if (type === "expense") {
      return expensesState.expenses
        .filter(
          (exp) =>
            exp.category.id === category.id &&
            date.getMonth() === new Date(exp.date).getMonth()
        )
        .reduce((prev, curr) => prev + curr.amount, 0);
    }
    return incomesState.incomes
      .filter(
        (inc) =>
          inc.category.id === category.id &&
          date.getMonth() === new Date(inc.date).getMonth()
      )
      .reduce((prev, curr) => prev + curr.amount, 0);
  };

  return (
    <Box
      sx={{
        p: 1,
        bgcolor: "#fafafa",
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          bgcolor: getRandomColor(),
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      ></Box>
      <Typography sx={{ fontSize: 14 }}>{category.name}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 500, fontSize: 16 }}>
        {filterAndCountByCategory().toLocaleString()} ₸
      </Typography>
    </Box>
  );
};

export default MiniCategoryItem;
