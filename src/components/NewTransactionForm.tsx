import {
  Alert,
  Button,
  FormControl,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  postExpense,
  resetExpensesFetchInfo,
} from "../store/reducers/expenseSlice";
import { closeNewTransactionModal } from "../store/reducers/extraSlice";
import { TransactionPostRequestDTO } from "../common/dataDTO/transactionPostRequestDTO";
import {
  postIncome,
  resetIncomesFetchInfo,
} from "../store/reducers/incomeSlice";
import { Saving } from "../common/dataDTO/savingDTO";
import { updateSaving } from "../store/reducers/savingSlice";

interface FormData {
  amount: number;
  date: Dayjs;
  categoryId: number | string;
  description: string;
  savingId: number | string;
}

const NewTransactionForm = () => {
  const initialFormData: FormData = {
    amount: 0,
    date: dayjs(),
    categoryId: "",
    savingId: "",
    description: "",
  };

  const expensesState = useAppSelector((state) => state.expenses);
  const { expenseCategories } = useAppSelector(
    (state) => state.expenseCategories
  );

  const incomesState = useAppSelector((state) => state.incomes);
  const { incomeCategories } = useAppSelector(
    (state) => state.incomeCategories
  );

  const savingsState = useAppSelector((state) => state.savings);

  const { type } = useAppSelector((state) => state.extra);

  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<any>(null);

  const selectCategoryData = {
    categories: type === "expense" ? expenseCategories : incomeCategories,
  };

  const onSumChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (+e.target.value < 0) return;

    setFormData((prev) => ({ ...prev, amount: +e.target.value }));
  };

  const validate = (): boolean => {
    if (!formData.categoryId || typeof formData.categoryId === "string") {
      setError("Выберите категорию");
      return false;
    }

    if (!formData.description) {
      setError("Описание не должно быть пустым");
      return false;
    }

    if (!formData.savingId) {
      setError("Выберите кошелёк");
      return false;
    }

    return true;
  };

  const postTransaction = () => {
    if (!validate()) return;

    const requestData: TransactionPostRequestDTO = {
      amount: formData.amount,
      categoryId: +formData.categoryId,
      date: dayjs(formData.date).format("YYYY-MM-DD"),
      description: formData.description,
    };

    type === "expense"
      ? dispatch(postExpense(requestData) as any)
      : dispatch(postIncome(requestData) as any);

    const saving: Saving = savingsState.savings.find(
      (s) => s.id === formData.savingId
    )!;

    dispatch(
      updateSaving({
        ...saving,
        amount:
          type === "expense"
            ? saving.amount - formData.amount
            : saving.amount + formData.amount,
      }) as any
    );
  };

  useEffect(() => {
    if (type === "expense") {
      if (!!expensesState.error) {
        String(JSON.parse(expensesState.error).status).startsWith("5")
          ? setError("Ошибка на стороне сервера")
          : setError(JSON.parse(expensesState.error).message);
      }

      if (expensesState.status === "successfull post") {
        setError(null);
        dispatch(closeNewTransactionModal());
        dispatch(resetExpensesFetchInfo());
      }
    }

    if (!!incomesState.error) {
      String(JSON.parse(incomesState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(incomesState.error).message);
    }

    if (incomesState.status === "successfull post") {
      setError(null);
      dispatch(closeNewTransactionModal());
      dispatch(resetIncomesFetchInfo());
    }
  }, [
    expensesState.isLoading,
    expensesState.expenses.length,
    expensesState.error,
    expensesState.status,
    incomesState.isLoading,
    incomesState.incomes.length,
    incomesState.error,
    incomesState.status,
    type,
    dispatch,
  ]);

  return (
    <FormControl sx={{ p: 3 }}>
      <Typography variant="subtitle2">Категория</Typography>
      <Select
        key={1}
        required
        value={formData.categoryId}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
        }
      >
        {selectCategoryData.categories.map((category) => (
          <MenuItem value={category.id} key={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
      <FormControl sx={{ mt: 3 }}>
        <Typography variant="subtitle2">
          {type === "expense" ? "С какого кошелька" : "На какой кошелёк"}
        </Typography>
        <Select
          key={2}
          required
          value={formData.savingId}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, savingId: e.target.value }))
          }
        >
          {savingsState.savings.map((saving) => (
            <MenuItem value={saving.id} key={saving.id}>
              {saving.name} ({saving.amount.toLocaleString()}₸)
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography sx={{ mt: 3 }} variant="subtitle2">
        Выберите дату
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={formData.date}
          format="DD.MM.YYYY"
          onChange={(newVal) =>
            setFormData((prev) => ({ ...prev, date: newVal! }))
          }
        />
      </LocalizationProvider>
      <Typography sx={{ mt: 3 }} variant="subtitle2">
        Описание
      </Typography>
      <TextField
        multiline
        minRows={2}
        value={formData.description}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="Введите описание..."
      />
      <Typography sx={{ mt: 3 }} variant="subtitle2">
        Сумма
      </Typography>
      <TextField
        InputProps={{
          endAdornment: <InputAdornment position="end">₸</InputAdornment>,
        }}
        onFocus={(e) => e.currentTarget.select()}
        type="number"
        value={formData.amount}
        onChange={onSumChange}
      />{" "}
      {!!error && (
        <Alert sx={{ mt: 2 }} severity="error">
          {error}
        </Alert>
      )}
      <Button sx={{ my: 2 }} variant="contained" onClick={postTransaction}>
        Создать
      </Button>
    </FormControl>
  );
};

export default NewTransactionForm;
