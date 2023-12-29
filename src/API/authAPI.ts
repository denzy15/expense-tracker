import axios from "axios";
import { SERVER_URL } from "../common/constants";
import { UserRegisterDTO } from "../common/authDTO/UserRegisterDTO";
import { UserLoginDTO } from "../common/authDTO/UserLoginDTO";

export const checkAuthUser = (): boolean => {
  return !!localStorage.getItem("jwt");
};

export const registerUser = async (
  registerData: Omit<UserRegisterDTO, "passwordConfirm">
) => {
  try {
    const data = await axios.post(
      `${SERVER_URL}/auth/registration`,
      registerData
    );
    return data.data;
  } catch (error: any) {
    throw new Error("Что-то пошло не так, попробуйте позже");
  }
};

export const loginUserAndGetToken = async (loginData: UserLoginDTO) => {
  try {
    const data = await axios.post(`${SERVER_URL}/auth/login`, loginData);
    return data.data;
  } catch (error: any) {
    throw new Error("Что-то пошло не так, попробуйте позже");
  }
};
