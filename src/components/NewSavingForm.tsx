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
  postSaving,
  resetSavingsFetchInfo,
} from "../store/reducers/savingSlice";

type Props = {
  close: () => void;
};

const NewSavingForm = ({ close }: Props) => {
  const initialFormData: Omit<Saving, "id"> = {
    amount: 0,
    name: "",
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

  const createHandler = () => {
    if (!formData.name) {
      setError("Название не должно быть пустым");
      return;
    }

    dispatch(postSaving(formData) as any);
  };

  useEffect(() => {
    if (!!savingsState.error) {
      String(JSON.parse(savingsState.error).status).startsWith("5")
        ? setError("Ошибка на стороне сервера")
        : setError(JSON.parse(savingsState.error).message);
    }

    if (savingsState.status === "successfull post") {
      setError("");
      dispatch(resetSavingsFetchInfo());
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
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        Новый кошелёк
      </Typography>
      <FormControl sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Введите название:
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
          <Button sx={{ my: 2 }} variant="contained" onClick={createHandler}>
            Создать
          </Button>
        </Stack>
      </FormControl>
    </Box>
  );
};

export default NewSavingForm;
