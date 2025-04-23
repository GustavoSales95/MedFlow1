import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { Link } from "react-router-dom";

//Icones
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';


export const ListaAdmin1 = () => {
  return (
    <List>
      <ListItem key={1} disablePadding>
        <ListItemButton
          component={Link}
          to={"/admin/ConsultarUsuarios"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<PersonSearchIcon/>}</ListItemIcon>
          <ListItemText primary={"Consultar usuários"} />
        </ListItemButton>
      </ListItem>
      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Admin/CadastrosUsuarios"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
          <ListItemText primary={"Gestão de Usuários"} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
