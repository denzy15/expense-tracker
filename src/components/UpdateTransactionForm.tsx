import React, { useEffect, useState } from "react";
import { Expense } from "../common/dataDTO/expenseDTO";
import { Income } from "../common/dataDTO/incomeDTO";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import dayjs, { Dayjs } from "dayjs";
import {
  deleteExpense,
  resetExpensesFetchInfo,
  updateExpense,
} from "../store/reducers/expenseSlice";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TransactionPutRequestDTO } from "../common/dataDTO/transactionPutRequestDTO";
import CloseIcon from "@mui/icons-material/Close";
import { deleteIncome, updateIncome } from "../store/reducers/incomeSlice";

type Props = {
  transaction: Expense | Income;
  close: () => void;
};

interface FormData {
  amount: number;
  date: Dayjs;
  categoryId: number | string;
  description: string;
}

const UpdateTransactionForm = ({ transaction, close }: Props) => {
  const initialFormData: FormData = {
    amount: transaction.amount,
    date: dayjs(transaction.date),
    categoryId: transaction.category.id,
    description: transaction.description,
  };

  const expensesState = useAppSelector((state) => state.expenses);
  const { expenseCategories } = useAppSelector(
    (state) => state.expenseCategories
  );

  const incomesState = useAppSelector((state) => state.incomes);
  const { incomeCategories } = useAppSelector(
    (state) => state.incomeCategories
  );

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
    return true;
  };

  const updateTransaction = () => {
    if (!validate()) return;

    const requestData: TransactionPutRequestDTO = {
      id: transaction.id,
      amount: formData.amount,
      categoryId: +formData.categoryId,
      date: dayjs(formData.date).format("YYYY-MM-DD"),
      description: formData.description,
    };

    type === "income"
      ? dispatch(updateIncome(requestData) as any)
      : dispatch(updateExpense(requestData) as any);
  };

  const deleteTransaction = () => {
    if (!window.confirm("Уверены что хотите удалить?")) return;
    type === "expense"
      ? dispatch(deleteExpense(transaction.id) as any)
      : dispatch(deleteIncome(transaction.id) as any);
  };

  useEffect(() => {
    if (!!expensesState.error) {
      String(JSON.parse(expensesState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(expensesState.error).message);
    }

    if (
      expensesState.status === "successfull put" ||
      expensesState.status === "successfull delete"
    ) {
      dispatch(resetExpensesFetchInfo());
      setError(null);
      close();
    }

    if (!!incomesState.error) {
      String(JSON.parse(incomesState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(incomesState.error).message);
    }

    if (
      incomesState.status === "successfull put" ||
      incomesState.status === "successfull delete"
    ) {
      setError(null);
      close();
    }
  }, [
    expensesState.error,
    expensesState.status,
    expensesState.expenses.length,
    type,
    incomesState.error,
    incomesState.status,
    dispatch,
    close,
  ]);

  return (
    <Box component={Paper} elevation={10} sx={{ p: 2 }}>
      <Box sx={{ textAlign: "right" }}>
        <IconButton onClick={() => close()}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Редактирование
        </Typography>
      </Box>
      <FormControl sx={{ p: 3 }}>
        <Typography variant="subtitle2">Категория</Typography>
        <Select
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

        <Typography sx={{ mt: 3 }} variant="subtitle2">
          Выберите дату
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            format="DD.MM.YYYY"
            value={formData.date}
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
        />
        {!!error && (
          <Alert sx={{ mt: 2 }} severity="error">
            {error}
          </Alert>
        )}

        <Stack sx={{ mt: 4 }} direction={"row"} justifyContent="space-evenly">
          <Button variant="contained" onClick={deleteTransaction} color="error">
            Удалить
          </Button>

          <Button variant="contained" onClick={updateTransaction}>
            Изменить
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
};

export default UpdateTransactionForm;
