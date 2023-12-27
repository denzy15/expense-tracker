import { Box, Paper, Typography } from "@mui/material";
import { ExpenseCategory } from "../common/dataDTO/expenseCategoryDTO";
import { useAppSelector } from "../store/hooks";
import { getRandomColor } from "../common/utils";
import { useNavigate } from "react-router-dom";
import { IncomeCategory } from "../common/dataDTO/incomeCategoryDTO";
import { Transaction } from "../common/types";

type Props = {
  category: ExpenseCategory | IncomeCategory;
  type: Transaction;
};

const CategoryItem = ({ category, type }: Props) => {
  const expensesState = useAppSelector((state) => state.expenses);
  const incomesState = useAppSelector((state) => state.incomes);
  const { date } = useAppSelector((state) => state.extra);

  const navigate = useNavigate();

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
    <Paper
      elevation={2}
      sx={{
        p: 1,
        bgcolor: "#fafafa",
        cursor: "pointer",
        display: "flex",
        gap: 2,
        alignItems: "center",
      }}
      onClick={() => navigate(`${category.id}`)}
    >
      <Box
        sx={{
          bgcolor: getRandomColor(),
          width: 10,
          height: 10,
          borderRadius: "50%",
        }}
      ></Box>
      <Box>
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
          {category.name}
        </Typography>
        <Typography variant="body1">
          {filterAndCountByCategory().toLocaleString()} ₸
        </Typography>
      </Box>
    </Paper>
  );
};

export default CategoryItem;
