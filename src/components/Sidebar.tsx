import { Box, List } from "@mui/material";
import React from "react";
import SidebarItem from "./SidebarItem";

import DashboardIcon from "@mui/icons-material/Dashboard";
import SavingsIcon from "@mui/icons-material/Savings";
import CreditCardIcon from "@mui/icons-material/CreditCard";

const sidebarData = [
  { text: "Обзор", path: "/", Icon: DashboardIcon },
  { text: "Траты", path: "/expenses", Icon: CreditCardIcon },
  { text: "Доходы", path: "/incomes", Icon: SavingsIcon },
];

const Sidebar = () => {
  return (
    <List sx={{ p: 3, bgcolor: "white", height: "100%" }}>
      {sidebarData.map((vals, i) => (
        <SidebarItem key={i} {...vals} />
      ))}
    </List>
  );
};

export default Sidebar;
