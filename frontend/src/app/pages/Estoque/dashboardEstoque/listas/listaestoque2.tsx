import React, { useContext } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";

import InboxIcon from "@mui/icons-material/Inbox";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import MouseIcon from "@mui/icons-material/Mouse";
import LogoutIcon from "@mui/icons-material/Logout";
import { AppContext } from "../../../../shared/contexts/AppContext";
export const Lista1 = () => {
  return (
    <List>
      <ListItem key={1} disablePadding>
        <ListItemButton
          component={Link}
          to="/Estoque"
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary="Estoques" />
        </ListItemButton>
      </ListItem>

      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to="/Entrada"
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon><AllInboxIcon /></ListItemIcon>
          <ListItemText primary="Entrada e Saída" />
        </ListItemButton>
      </ListItem>

      <ListItem key={3} disablePadding>
        <ListItemButton
          component={Link}
          to="/Editar"
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon><MouseIcon /></ListItemIcon>
          <ListItemText primary="Edital" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export const Lista2 = () => {
  const { deslogar } = useContext(AppContext);

  return (
    <List>
      <ListItem key={4} disablePadding>
        <ListItemButton
          onClick={deslogar}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Deslogar" />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
