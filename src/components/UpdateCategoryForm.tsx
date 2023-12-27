import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteExpenseCategory,
  resetExpenseCategoriesFetchInfo,
  updateExpenseCategory,
} from "../store/reducers/expenseCategorySlice";
import { closeUpdateCategoryModal } from "../store/reducers/extraSlice";
import { IncomeCategory } from "../common/dataDTO/incomeCategoryDTO";
import { ExpenseCategory } from "../common/dataDTO/expenseCategoryDTO";
import CloseIcon from "@mui/icons-material/Close";
import {
  deleteIncomeCategory,
  resetIncomeCategoriesFetchInfo,
  updateIncomeCategory,
} from "../store/reducers/incomeCategorySlice";

type Props = {
  category: IncomeCategory | ExpenseCategory;
};

const UpdateCategoryForm = ({ category }: Props) => {
  const expenseCategoriesState = useAppSelector(
    (state) => state.expenseCategories
  );

  const incomeCategoriesState = useAppSelector(
    (state) => state.incomeCategories
  );
  const { type } = useAppSelector((state) => state.extra);
  const expensesState = useAppSelector((state) => state.expenses);
  const incomesState = useAppSelector((state) => state.incomes);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<string>(category.name);
  const [error, setError] = useState<any>(null);

  const validate = () => {
    if (!formData) {
      setError("Введите название категории");
      return false;
    }
    return true;
  };

  const updateCategory = () => {
    if (!validate()) return;

    if (type === "expense") {
      dispatch(
        updateExpenseCategory({ id: category.id, name: formData }) as any
      );
      return;
    }

    dispatch(updateIncomeCategory({ id: category.id, name: formData }) as any);
  };

  const deleteCategory = () => {
    if (
      !window.confirm(`Уверены что хотите удалить категорию ${category.name}?`)
    )
      return;

    if (type === "expense") {
      const exists = expensesState.expenses.some(
        (exp) => exp.category.id === category.id
      );

      if (exists) {
        setError(
          "Существуют транзакции с данной категорией. Поменяйте категорию у таких транзакций и попробуйте заново"
        );
        return;
      }

      dispatch(deleteExpenseCategory(category.id) as any);

      return;
    }

    const exists = incomesState.incomes.some(
      (inc) => inc.category.id === category.id
    );

    if (exists) {
      setError(
        "Существуют транзакции с данной категорией. Поменяйте категорию у таких транзакций и попробуйте заново"
      );
      return;
    }

    dispatch(deleteIncomeCategory(category.id) as any);
  };

  useEffect(() => {
    if (type === "expense") {
      if (!!expenseCategoriesState.error) {
        String(JSON.parse(expenseCategoriesState.error).status).startsWith("5")
          ? setError("Ошибка на стороне сервера")
          : setError(JSON.parse(expenseCategoriesState.error).message);
      }

      if (
        expenseCategoriesState.status === "successfull put" ||
        expenseCategoriesState.status === "successfull delete"
      ) {
        setError(null);
        dispatch(closeUpdateCategoryModal());
        dispatch(resetExpenseCategoriesFetchInfo());
      }
    }

    if (!!incomeCategoriesState.error) {
      String(JSON.parse(incomeCategoriesState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(incomeCategoriesState.error).message);
    }

    if (
      incomeCategoriesState.status === "successfull put" ||
      incomeCategoriesState.status === "successfull delete"
    ) {
      setError(null);
      dispatch(closeUpdateCategoryModal());
      dispatch(resetIncomeCategoriesFetchInfo());
    }
  }, [
    dispatch,
    type,
    expenseCategoriesState.isLoading,
    expenseCategoriesState.error,
    incomeCategoriesState.error,
    incomeCategoriesState.status,
    expenseCategoriesState.status,
  ]);

  return (
    <Box component={Paper} elevation={10} sx={{ p: 2, maxWidth: 680 }}>
      <Box sx={{ textAlign: "right" }}>
        <IconButton
          onClick={() => dispatch(closeUpdateCategoryModal())}
          sx={{ textAlign: "right" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <FormControl sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Введите новое название категории{" "}
          {type === "income" ? "доходов" : "расходов"}
        </Typography>
        <TextField
          autoComplete="off"
          value={formData}
          onChange={(e) => setFormData(e.target.value)}
        />
        {!!error && (
          <Alert sx={{ mt: 2 }} severity="error">
            {error}
          </Alert>
        )}
        <Stack direction={"row"} justifyContent="space-around">
          {/* <Button
            sx={{ my: 2 }}
            variant="outlined"
            onClick={() => dispatch(closeUpdateCategoryModal())}
          >
            Отмена
          </Button> */}
          <Button sx={{ my: 2 }} variant="contained" onClick={updateCategory}>
            Переименовать
          </Button>
          <Button
            sx={{ my: 2 }}
            variant="contained"
            color="error"
            onClick={deleteCategory}
          >
            Удалить категорию
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
};

export default UpdateCategoryForm;
