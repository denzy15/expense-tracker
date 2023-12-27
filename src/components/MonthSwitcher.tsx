import { IconButton, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getMonthName } from "../common/utils";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { decreaseMonth, increaseMonth } from "../store/reducers/extraSlice";

const MonthSwitcher = () => {
  const { date } = useAppSelector((state) => state.extra);
  const dispatch = useAppDispatch();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ bgcolor: "white", mb: 1, py: 1 }}
    >
      <IconButton onClick={() => dispatch(decreaseMonth())}>
        <ArrowBackIcon />
      </IconButton>
      <Typography sx={{ fontSize: 18 }}>
        {getMonthName(date.getMonth() + 1)} {date.getFullYear()}
      </Typography>
      <IconButton onClick={() => dispatch(increaseMonth())}>
        <ArrowForwardIcon />
      </IconButton>
    </Stack>
  );
};

export default MonthSwitcher;
