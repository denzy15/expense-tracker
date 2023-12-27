import {
  Alert,
  Button,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  postExpenseCategory,
  resetExpenseCategoriesFetchInfo,
} from "../store/reducers/expenseCategorySlice";
import { closeNewCategoryModal } from "../store/reducers/extraSlice";
import {
  postIncomeCategory,
  resetIncomeCategoriesFetchInfo,
} from "../store/reducers/incomeCategorySlice";

const CategoryForm = () => {
  const { type } = useAppSelector((state) => state.extra);
  const expenseCategoriesState = useAppSelector(
    (state) => state.expenseCategories
  );
  const incomeCategoriesState = useAppSelector(
    (state) => state.incomeCategories
  );

  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<string>("");
  const [error, setError] = useState<any>(null);

  const validate = () => {
    if (!formData) {
      setError("Введите название категории");
      return false;
    }
    return true;
  };

  const postCategory = () => {
    if (!validate()) return;

    if (type === "expense") {
      dispatch(postExpenseCategory({ name: formData }) as any);
      return;
    }
    dispatch(postIncomeCategory({ name: formData }) as any);
  };

  useEffect(() => {
    if (!!expenseCategoriesState.error) {
      String(JSON.parse(expenseCategoriesState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(expenseCategoriesState.error).message);
    }

    if (expenseCategoriesState.status === "successfull post") {
      setError(null);
      dispatch(closeNewCategoryModal());
      dispatch(resetExpenseCategoriesFetchInfo());
    }

    if (!!incomeCategoriesState.error) {
      String(JSON.parse(incomeCategoriesState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(incomeCategoriesState.error).message);
    }

    if (incomeCategoriesState.status === "successfull post") {
      setError(null);
      dispatch(closeNewCategoryModal());
      dispatch(resetIncomeCategoriesFetchInfo());
    }
  }, [
    expenseCategoriesState.isLoading,
    expenseCategoriesState.error,
    expenseCategoriesState.expenseCategories.length,
    expenseCategoriesState.status,
    incomeCategoriesState.isLoading,
    incomeCategoriesState.error,
    incomeCategoriesState.incomeCategories.length,
    incomeCategoriesState.status,
    dispatch,
  ]);

  return (
    <FormControl sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Введите название новой категории{" "}
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
      <Button sx={{ my: 2 }} variant="contained" onClick={postCategory}>
        Создать
      </Button>
    </FormControl>
  );
};

export default CategoryForm;
