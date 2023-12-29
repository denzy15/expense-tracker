import { Income } from "../common/dataDTO/incomeDTO";
import { Expense } from "../common/dataDTO/expenseDTO";
import { Transaction } from "../common/types";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAppSelector } from "../store/hooks";
import { ExpenseCategory } from "../common/dataDTO/expenseCategoryDTO";
import { IncomeCategory } from "../common/dataDTO/incomeCategoryDTO";
import { Alert, Typography } from "@mui/material";

type Props = {
  propsData: Income[] | Expense[];
  type: Transaction;
};

interface PieChartData {
  id: number;
  value: number;
  label: string;
}

const PieChartComponent = ({ propsData, type }: Props) => {
  const { date } = useAppSelector((state) => state.extra);
  const expenseCategoriesState = useAppSelector(
    (state) => state.expenseCategories
  );
  const incomeCategoriesState = useAppSelector(
    (state) => state.incomeCategories
  );

  const fillPieChartData = (fnData: ExpenseCategory[] | IncomeCategory[]) => {
    const result: PieChartData[] = [];

    const overallMonthAmount: number = propsData
      .filter((item) => new Date(item.date).getMonth() === date.getMonth())
      .reduce((prev, item) => prev + item.amount, 0);

    if (!overallMonthAmount) {
      return result;
    }

    fnData.forEach((category, idx) => {
      const value: number = propsData
        .filter(
          (item) =>
            item.category.id === category.id &&
            date.getMonth() === new Date(item.date).getMonth()
        )
        .reduce((prev, curr) => prev + curr.amount, 0);

      const percent: string = ((value / overallMonthAmount) * 100).toFixed(2);

      result.push({
        id: idx,
        label: `${category.name} - ${percent}%`,
        value,
      });
    });

    return result;
  };

  const data: PieChartData[] =
    type === "expense"
      ? fillPieChartData(expenseCategoriesState.expenseCategories)
      : fillPieChartData(incomeCategoriesState.incomeCategories);

  return (
    <>
      <Typography variant="h6" textAlign={"center"}>
        {type === "expense" ? "Расходы" : "Доходы:"}
      </Typography>

      {!!propsData.length && !!data.length ? (
        <PieChart
          series={[
            {
              data,
              // highlightScope: { faded: "global", highlighted: "item" },
              // faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              innerRadius: 25,
            },
          ]}
          height={200}
        />
      ) : (
        <Alert severity="info">Пусто</Alert>
      )}
    </>
  );
};

export default PieChartComponent;
