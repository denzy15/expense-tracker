import React, { useState } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import MailIcon from "@mui/icons-material/Mail";
import UserIcon from "@mui/icons-material/Person";
import PasswordIcon from "@mui/icons-material/Password";

interface CustomInputProps extends Omit<TextFieldProps, "onChange" | "value"> {
  type: string;
  value: string;
  name: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type,
  value,
  name,

  onChangeHandler,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField

      {...rest}
      sx={{
        width: { sm: "90%", md: "60%" },
        bgcolor: "#e5e4e2",
        
      }}
      type={showPassword ? "text" : type}
      name={name}
      value={value}
      onChange={onChangeHandler}
      
      InputProps={{
        endAdornment: type === "password" && (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
        startAdornment: (
          <InputAdornment position="start">
            {name === "password" || name ==="passwordConfirm" ? (
              <PasswordIcon />
            ) : name === "email" ? (
              <MailIcon />
            ) : (
              <UserIcon sx={{ color: "" }} />
            )}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomInput;
