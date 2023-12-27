import { Saving } from "../common/dataDTO/savingDTO";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  deleteSaving,
  resetSavingsFetchInfo,
  updateSaving,
} from "../store/reducers/savingSlice";

type Props = {
  close: () => void;
  saving: Saving;
};

const UpdateSavingForm = ({ close, saving }: Props) => {
  const initialFormData: Omit<Saving, "id"> = {
    amount: saving.amount,
    name: saving.name,
  };

  const savingsState = useAppSelector((state) => state.savings);

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const onSumChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (+e.target.value < 0) return;

    setFormData((prev) => ({ ...prev, amount: +e.target.value }));
  };

  const updatehandler = () => {
    if (!formData.name) {
      setError("Название не должно быть пустым");
      return;
    }

    dispatch(updateSaving({ ...formData, id: saving.id }) as any);
  };

  const deleteHandler = () => {
    if (savingsState.savings.length === 1) {
      setError("Невозможно удалить, у вас должен быть хотя бы 1 кошелёк");
      return;
    }
    if (!window.confirm("Уверены что хотите удалить?")) return;
    dispatch(deleteSaving(saving.id) as any);
  };

  useEffect(() => {
    if (!!savingsState.error) {
      String(JSON.parse(savingsState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(savingsState.error).message);
    }

    if (
      savingsState.status === "successfull put" ||
      savingsState.status === "successfull delete"
    ) {
      setError("");
      close();
    }

  }, [close, dispatch, savingsState.error, savingsState.status]);

  return (
    <Box component={Paper} elevation={10} sx={{ p: 2, maxWidth: 680 }}>
      <Box
        sx={{ textAlign: "right" }}
        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation();
          close();
        }}
      >
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Box>
      <FormControl sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Введите новое название:
        </Typography>
        <TextField
          autoComplete="off"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Сумма:
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
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent="space-around"
          sx={{ mt: 2 }}
        >
          <Button
            sx={{ my: 2 }}
            variant="contained"
            color="error"
            onClick={deleteHandler}
          >
            Удалить кошелёк
          </Button>
          <Button sx={{ my: 2 }} variant="contained" onClick={updatehandler}>
            Изменить
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
};

export default UpdateSavingForm;
