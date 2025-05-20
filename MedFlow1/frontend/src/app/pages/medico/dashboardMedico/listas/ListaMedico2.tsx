import React, { useContext } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { AppContext } from "../../../../shared/contexts/AppContext";
import { Link } from "react-router-dom";
import { DialogConfigPerfilMedico } from "../Dialogs/DialogConfigPerfilMedico";
import { useState } from "react";
//Icones
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export const ListaMedico2 = () => {
  const [openDialogConfigPerfilMedico, setOpenDialogConfigPerfilMedico] = useState(false);
  const { deslogar } = useContext(AppContext); //Função de deslogar importada do appContext e usada ao clicar em deslogar

  return (
    <List>
      <ListItem key={1} disablePadding>
              <ListItemButton
                onClick={() => {
                  setOpenDialogConfigPerfilMedico(true);
                }}
                sx={{
                  transition: "0.8s",
                  "&:hover": {
                    backgroundColor: "#019C9B",
                    color: "white",
                  },
                }}
              >
                <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
                <ListItemText primary={"Seus dados"} />
              </ListItemButton>
            </ListItem>
      <ListItem key={1} disablePadding>
        <ListItemButton
          onClick={deslogar}
          component={Link}
          to={"/Login"}
          sx={{
            transition: "0.8s",
            "&:hover": {
              backgroundColor: "#019C9B",
              color: "white",
            },
          }}
        >
          <ListItemIcon>{<LogoutIcon />}</ListItemIcon>
          <ListItemText primary={"Deslogar"} />
        </ListItemButton>
      </ListItem>

      <DialogConfigPerfilMedico
        open={openDialogConfigPerfilMedico}
        setOpen={setOpenDialogConfigPerfilMedico}
      ></DialogConfigPerfilMedico>
    </List>
  );
};
