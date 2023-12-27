import React, { useState } from "react";
import { Alert, Button, Paper, Typography } from "@mui/material";
import CustomInput from "./CustomInput";
import { loginUserAndGetToken, registerUser } from "../API/authAPI";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/reducers/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { UserRegisterDTO } from "../common/authDTO/UserRegisterDTO";
import Loader from "./Loader";
import { postExpenseCategory } from "../store/reducers/expenseCategorySlice";
import { postSaving } from "../store/reducers/savingSlice";
import { postIncomeCategory } from "../store/reducers/incomeCategorySlice";

const initialRegisterData: UserRegisterDTO = {
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
};

const RegistrationForm = () => {
  const [registerData, setRegisterData] =
    useState<UserRegisterDTO>(initialRegisterData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = () => {
    if (!validate()) return;

    setLoading(true);
    registerUser({
      email: registerData.email,
      password: registerData.password,
      username: registerData.username,
    })
      .then(() => {
        loginUserAndGetToken({
          email: registerData.email,
          password: registerData.password,
        }).then((data) => {
          dispatch(login({ token: data.token, email: data.email }));
          dispatch(postSaving({ amount: 0, name: "Карта" }) as any);
          dispatch(postExpenseCategory({ name: "Продукты" }) as any);
          dispatch(postExpenseCategory({ name: "Транспорт" }) as any);
          dispatch(postExpenseCategory({ name: "Кафе и рестораны" }) as any);
          dispatch(postIncomeCategory({ name: "Зарплата" }) as any);
          setError("");
          navigate("/");
        });
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => setLoading(false));
  };

  const validate = (): boolean => {
    if (!registerData.username) {
      setError("Имя пользователя не должно быть пустым");
      return false;
    }

    if (!registerData.email.includes("@")) {
      setError("Неверный адрес электронной почты");
      return false;
    }

    if (!registerData.password) {
      setError("Придумайте пароль");
      return false;
    }

    if (registerData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return false;
    }

    if (registerData.password !== registerData.passwordConfirm) {
      setError("Пароли не совпадают");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        p: 3,
        maxWidth: 500,
        mx: "auto",
        bgcolor: "ButtonShadow",
      }}
    >
      <Typography sx={{ fontSize: 26, color: "#008dcc", fontWeight: 500 }}>
        Регистрация
      </Typography>
      <CustomInput
        onChangeHandler={onChangeHandler}
        type="text"
        name="username"
        label="Имя пользователя"
        autoComplete="off"
        value={registerData.username}
        key={1}
      />
      <CustomInput
        onChangeHandler={onChangeHandler}
        label="Почта"
        type="email"
        name="email"
        value={registerData.email}
        key={2}
      />
      <CustomInput
        onChangeHandler={onChangeHandler}
        label="Пароль"
        type="password"
        name="password"
        value={registerData.password}
        key={3}
      />
      <CustomInput
        onChangeHandler={onChangeHandler}
        label="Подтвердите пароль"
        type="password"
        name="passwordConfirm"
        value={registerData.passwordConfirm}
        key={4}
      />

      {!!error && (
        <Alert
          severity="error"
          variant="outlined"
          color="error"
          sx={{ fontSize: 16, bgcolor: "#3d2323", color: "#d6aeae" }}
        >
          {error}
        </Alert>
      )}
      <Button
        variant="contained"
        sx={{ mt: 2, fontSize: 15, width: { sm: "90%", md: "60%" } }}
        size="large"
        onClick={submitHandler}
      >
        Зарегистрироваться
      </Button>
      {loading && <Loader />}
      <Link to="/login">
        <Typography
          sx={{
            color: "GrayText",
            "&:hover": {
              color: "#1976d2",
            },
          }}
        >
          Уже есть аккаунт? Войти
        </Typography>
      </Link>
    </Paper>
  );
};

export default RegistrationForm;
