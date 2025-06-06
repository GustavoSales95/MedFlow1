import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import InboxIcon from '@mui/icons-material/Inbox';
import { Link } from "react-router-dom";

//Icones
// import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
// import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AllInboxIcon from '@mui/icons-material/AllInbox';

import MouseIcon from '@mui/icons-material/Mouse';


export const Lista1 = () => {
  return (
    <List>
      <ListItem key={3} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Estoque/Cadastro"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<InboxIcon />}</ListItemIcon>
          <ListItemText primary={"Cadastrar Produto"} />
        </ListItemButton>
      </ListItem>

      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Estoque/entrada"}  
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<AllInboxIcon/>}</ListItemIcon>
          <ListItemText primary={"Registro"} />
        </ListItemButton>
      </ListItem>

      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Estoque/Editar"}  
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<MouseIcon/>}</ListItemIcon>
          <ListItemText primary={"Editar"} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
