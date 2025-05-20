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
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

export const Lista1 = () => {
  return (
    <List>
      <ListItem key={1} disablePadding>
        <ListItemButton
          component={Link}
<<<<<<< HEAD
          to={"Comum/"}
=======
          to={"/Comum"}
>>>>>>> 06991008e3a2abf4c2e39ac67c1b4ed4ecea6f34
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<InsertInvitationIcon />}</ListItemIcon>
          <ListItemText primary={"Marcação de Consultas"} />
        </ListItemButton>
      </ListItem>
      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
<<<<<<< HEAD
          to={"Comum/Cadastros"}
=======
          to={"/Comum/Cadastros"}
>>>>>>> 06991008e3a2abf4c2e39ac67c1b4ed4ecea6f34
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
          <ListItemText primary={"Cadastros"} />
        </ListItemButton>
      </ListItem>
      <ListItem key={1} disablePadding>
        <ListItemButton
          component={Link}
<<<<<<< HEAD
          to={"Comum/ConsultarPessoas"}
=======
          to={"/Comum/ConsultarPessoas"}
>>>>>>> 06991008e3a2abf4c2e39ac67c1b4ed4ecea6f34
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<PersonSearchIcon />}</ListItemIcon>
          <ListItemText primary={"Registros"} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};
