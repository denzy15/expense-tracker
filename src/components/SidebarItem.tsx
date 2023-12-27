import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const SidebarItem = ({ text, path, Icon }: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <ListItemButton onClick={() => navigate(path)} selected={pathname === path}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={text} />
    </ListItemButton>
  );
};

export default SidebarItem;
