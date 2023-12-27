import {
  Alert,
  Backdrop,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ExpenseCategory } from "../common/dataDTO/expenseCategoryDTO";
import { IncomeCategory } from "../common/dataDTO/incomeCategoryDTO";
import TransactionsByCategoryTable from "../components/TransactionsByCategoryTable";
import UpdateCategoryForm from "../components/UpdateCategoryForm";
import EditIcon from "@mui/icons-material/Edit";
import { openUpdateCategoryModal } from "../store/reducers/extraSlice";
import { Expense } from "../common/dataDTO/expenseDTO";
import { Income } from "../common/dataDTO/incomeDTO";

const TransactionsByCategory = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  const pathInfo = {
    path: pathname.split("/").slice(1, 3)[0],
    categoryId: +pathname.split("/").slice(1, 3)[1],
  };
  const { date, isUpdateCategoryModalOpen } = useAppSelector(
    (state) => state.extra
  );

  const expensesState = useAppSelector((state) => state.expenses);
  const expenseCategoriesState = useAppSelector(
    (state) => state.expenseCategories
  );
  const incomesState = useAppSelector((state) => state.incomes);
  const incomeCategoriesState = useAppSelector(
    (state) => state.incomeCategories
  );

  const currentCategory: ExpenseCategory | IncomeCategory | undefined =
    pathInfo.path === "expenses"
      ? expenseCategoriesState.expenseCategories.find(
          (c) => c.id === pathInfo.categoryId
        )
      : incomeCategoriesState.incomeCategories.find(
          (c) => c.id === pathInfo.categoryId
        );

  const data: Expense[] | Income[] =
    pathInfo.path === "expenses"
      ? expensesState.expenses.filter(
          (item) =>
            item.category.id === pathInfo.categoryId &&
            date.getMonth() === new Date(item.date).getMonth()
        )
      : incomesState.incomes.filter(
          (item) =>
            item.category.id === pathInfo.categoryId &&
            date.getMonth() === new Date(item.date).getMonth()
        );

  const filterAndCountByCategory = (): number => {
    return data
      .filter((item) => date.getMonth() === new Date(item.date).getMonth())
      .reduce((prev, curr) => prev + curr.amount, 0);
  };

  return (
    <Box>
      {!currentCategory ? (
        <Navigate to={`/${pathInfo.path}`}></Navigate>
      ) : (
        <>
          <Box bgcolor="white" p={2}>
            <Stack direction={"row"} justifyContent={"space-between"}>
              <Typography>
                Категория:{" "}
                <Typography
                  component={"span"}
                  sx={{ fontWeight: 500, fontSize: 18, mx: 1 }}
                >
                  {currentCategory.name}
                </Typography>
                <IconButton
                  onClick={() =>
                    dispatch(
                      openUpdateCategoryModal(
                        pathInfo.path === "expenses" ? "expense" : "income"
                      )
                    )
                  }
                >
                  <EditIcon />
                </IconButton>
              </Typography>
              <Typography variant="h5" sx={{ color: "Highlight" }}>
                {filterAndCountByCategory().toLocaleString()}₸
              </Typography>
            </Stack>
            <Divider sx={{ my: 2 }} />
            {!data.length ? (
              <Alert severity="info" sx={{ fontSize: 14 }}>
                Транзакций за этот месяц не найдено
              </Alert>
            ) : (
              <TransactionsByCategoryTable
                type={pathInfo.path === "expenses" ? "expense" : "income"}
                data={data}
              />
            )}
          </Box>
          {isUpdateCategoryModalOpen && (
            <Backdrop open={isUpdateCategoryModalOpen} sx={{ zIndex: 2 }}>
              <UpdateCategoryForm category={currentCategory} />
            </Backdrop>
          )}
        </>
      )}
    </Box>
  );
};

export default TransactionsByCategory;
