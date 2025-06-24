import React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { Link } from "react-router-dom";

//Icones
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CreateIcon from "@mui/icons-material/Create";

export const ListaMedico1 = () => {
  return (
    <List>
      {/*       <ListItem key={1} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Medico"}
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
      </ListItem> */}
      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Medico/ConsultarProntuarios"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<PersonAddIcon />}</ListItemIcon>
          <ListItemText primary={"Consultar Prontuario"} />
        </ListItemButton>
      </ListItem>
      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Medico/Agendamentos"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<PendingActionsIcon />}</ListItemIcon>
          <ListItemText primary={"Meus Agendamentos"} />
        </ListItemButton>
      </ListItem>

      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Medico/FinalizarConsulta"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<ContentPasteIcon />}</ListItemIcon>
          <ListItemText primary={"Finalizar Consulta"} />
        </ListItemButton>
      </ListItem>

      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Medico/ConsultarEscala"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<CalendarMonthIcon />}</ListItemIcon>
          <ListItemText primary={"Minha Escala"} />
        </ListItemButton>
      </ListItem>
      <ListItem key={2} disablePadding>
        <ListItemButton
          component={Link}
          to={"/Medico/CriarReceita"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<CreateIcon />}</ListItemIcon>
          <ListItemText primary={"Criar Receita"} />
        </ListItemButton>
      </ListItem>

      {/*      <ListItem key={1} disablePadding>
        <ListItemButton
          component={Link}
          to={"/"}
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
      </ListItem> */}
    </List>
  );
};
