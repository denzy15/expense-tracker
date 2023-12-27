import { Box, IconButton, Paper, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  changeType,
  closeNewCategoryModal,
} from "../store/reducers/extraSlice";
import CategoryForm from "./CategoryForm";

const NewCategory = () => {
  const { type } = useAppSelector((state) => state.extra);
  const dispatch = useAppDispatch();

  const [value, setValue] = React.useState(type === "income" ? 1 : 0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    dispatch(changeType(newValue === 1 ? "income" : "expense"));
  };

  return (
    <Paper
      elevation={5}
      sx={{ position: "relative", zIndex: 5, width: { xs: "100%", md: 600 } }}
    >
      <Box sx={{ textAlign: "right" }}>
        <IconButton
          onClick={() => dispatch(closeNewCategoryModal())}
          sx={{ textAlign: "right" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        Новая категория
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Категория расходов" />
          <Tab label="Категория доходов" />
        </Tabs>
      </Box>
      <Box hidden={value !== 0} sx={{ textAlign: "center" }}>
        <CategoryForm key={1} />
      </Box>
      <Box hidden={value !== 1} sx={{ textAlign: "center" }}>
        <CategoryForm key={2} />
      </Box>
    </Paper>
  );
};

export default NewCategory;
