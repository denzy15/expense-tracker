import React, { useState } from "react";
import { Alert, Button, Paper, Typography } from "@mui/material";
import CustomInput from "./CustomInput";
import { UserLoginDTO } from "../common/authDTO/UserLoginDTO";
import { loginUserAndGetToken } from "../API/authAPI";
import { useAppDispatch } from "../store/hooks";
import { login } from "../store/reducers/authSlice";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";

const initialLoginData: UserLoginDTO = {
  email: "",
  password: "",
};

const LoginForm: React.FC = () => {
  const [loginData, setLoginData] = useState<UserLoginDTO>(initialLoginData);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch: Dispatch<AnyAction> = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = (): void => {
    if (!loginData.email || !loginData.password) {
      setError("Не все поля заполнены");
      return;
    }

    setLoading(true);

    loginUserAndGetToken(loginData)
      .then((data) => {
        dispatch(login({ token: data.token, email: data.email }));
        setError("");
        navigate("/");
      })
      .catch((e) => {
        setError(e);
      })
      .finally(() => setLoading(false));
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
        Вход
      </Typography>
      <CustomInput
        onChangeHandler={onChangeHandler}
        type="email"
        name="email"
        label="Почта"
        value={loginData.email}
        key={1}
      />
      <CustomInput
        onChangeHandler={onChangeHandler}
        label="Пароль"
        type="password"
        name="password"
        value={loginData.password}
        key={2}
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
        disabled={loading}
      >
        Войти
      </Button>
      {loading && <Loader />}

      <Link to="/registration">
        <Typography
          sx={{
            color: "GrayText",
            "&:hover": {
              color: "#1976d2",
            },
          }}
        >
          Нет аккаунта? Зарегистрироваться
        </Typography>
      </Link>
    </Paper>
  );
};

export default LoginForm;
