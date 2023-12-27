import { Box, Stack, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import DeblurIcon from "@mui/icons-material/Deblur";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signOut } from "../store/reducers/authSlice";
import { countBalance } from "../common/utils";

const Navbar = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { email } = useAppSelector((state) => state.auth);
  const { savings } = useAppSelector((state) => state.savings);

  const signOutHandler = () => {
    dispatch(signOut());
  };



  return (
    <Box
      component="nav"
      sx={{
        bgcolor: "white",
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack
        onClick={() => navigate("/")}
        direction={"row"}
        spacing={2}
        sx={{ cursor: "pointer", pl: 3 }}
      >
        <DeblurIcon />
        <Typography sx={{ fontWeight: 500 }}>Expense Tracker</Typography>
      </Stack>

      <Typography
        variant="h6"
        color="GrayText"
        sx={{
          borderBottom: "1px solid #34C716",
          "& span": {
            color: "CaptionText",
          },
        }}
      >
        Баланс: <span>{countBalance(savings).toLocaleString()}₸</span>
      </Typography>

      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Typography>{email}</Typography>

        <Button color="secondary" variant="contained" onClick={signOutHandler}>
          Выйти
        </Button>
      </Stack>
    </Box>
  );
};

export default Navbar;
