import { Box, IconButton, Paper, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import NewTransactionForm from "./NewTransactionForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  changeType,
  closeNewTransactionModal,
} from "../store/reducers/extraSlice";

const NewTransaction = () => {
  const { type } = useAppSelector((state) => state.extra);
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState(type === "income" ? 1 : 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    dispatch(changeType(newValue === 1 ? "income" : "expense"));
  };

  return (
    <Paper
      elevation={2}
      sx={{ position: "relative", zIndex: 5, width: { xs: "100%", md: 600 } }}
    >
      <Box sx={{ textAlign: "right" }}>
        <IconButton
          onClick={() => dispatch(closeNewTransactionModal())}
          sx={{ textAlign: "right" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        Новая транзакция
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Расходы" />
          <Tab label="Доходы" />
        </Tabs>
      </Box>
      <Box hidden={value !== 0} sx={{ textAlign: "center" }}>
        <NewTransactionForm key={1} />
      </Box>
      <Box hidden={value !== 1} sx={{ textAlign: "center" }}>
        <NewTransactionForm key={2} />
      </Box>
    </Paper>
  );
};

export default NewTransaction;
