import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from "@mui/material";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import api from '../../../../services/api.js';
import { insertMaskCpf, insertMaskHora } from '../../../functions/InsertMasks';

interface UserData {
  id_usuario: number;
  nome: string;
  cpf: string;
  perfil: {
    tipo: string
  };
  medico: {
    id_medico: number
    crm: string;
    escala: {
        medico_id: number;
        segunda: string
        segunda_horario: string
        terca: string
        terca_horario: string
        quarta: string
        quarta_horario: string
        quinta: string
        quinta_horario: string
        sexta: string
        sexta_horario: string
        sabado: string
        sabado_horario: string
        domingo: string
        domingo_horario: string
    }
  }
}

export const EditarEscala = () => {
  // Estados para a pesquisa
  const [searchType, setSearchType] = useState<"cpf" | "crm" | "dia">("cpf");
  const [searchValue, setSearchValue] = useState(""); // campo para CPF ou CRM
  const [searchDay, setSearchDay] = useState(""); // para pesquisa por dia escalado
  const [startEdit, setStartEdit] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [formData, setFormData] = useState<UserData[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

async function getUsers(params: object) {
  try {
    const response = await api.get('/admin/EditarEscala', { params });
    if (response.data.message) {
      let returnedUsers: UserData[] = [];
      if (response.data.message.length === undefined) {
        returnedUsers = [response.data.message];
      } else if (response.data.message.length > 0) {
        returnedUsers = response.data.message;
      } else {
        setUsers([]);
        setSnackbarMessage("Nenhum usuário encontrado para os parâmetros informados.");
        setOpenSnackbar(true);
        return;
      }
      setUsers(returnedUsers);
      setFormData(returnedUsers.map(user => ({ ...user })));
    } else {
      setUsers([]);
      setSnackbarMessage("Nenhum usuário encontrado para os parâmetros informados.");
      setOpenSnackbar(true);
    }
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    setSnackbarMessage("Erro ao consultar usuários. Tente novamente.");
    setOpenSnackbar(true);
  }
}

  // Handler para atualizar campo do CPF ou CRM
  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (searchType === "cpf") {
      setSearchValue(e.target.value.replace(/\D/g, ''));
    } else {
      setSearchValue(e.target.value);
    }
  };

  // Função de pesquisa, que usa o critério selecionado para definir os parâmetros
  const handleSearch = async () => {
    let params: any = {};
    setStartEdit(false);

    if (searchType === "cpf") {
      if (searchValue.replace(/\D/g, '').length !== 11) {
        setSnackbarMessage("CPF inválido! Por favor, digite um CPF válido com 11 dígitos.");
        setOpenSnackbar(true);
        return;
      }
      params.cpf = searchValue.replace(/\D/g, '');
    } else if (searchType === "crm") {
      if (searchValue.trim() === "") {
        setSnackbarMessage("CRM inválido! Por favor, digite um CRM válido.");
        setOpenSnackbar(true);
        return;
      }
      params.crm = searchValue;
    } else if (searchType === "dia") {
      if (searchDay === "") {
        setSnackbarMessage("Selecione um dia de escala para buscar os usuários.");
        setOpenSnackbar(true);
        return;
      }
      params.dia = searchDay;
    }

    await getUsers(params);
  };

  // Atualiza o formData para o usuário com o userId que corresponde ao id
const handleEdit = (userId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  setFormData((prevFormData) => {
    const updatedFormData = prevFormData.map((user) => {
      if (user.id_usuario === userId) {
        return {
          ...user,
          medico: {
            ...user.medico,
            escala: {
              ...user.medico.escala,
              [name]: value, // atualiza a propriedade com o novo valor
            },
          },
        };
      }
      return user;
    });
    console.log("Updated formData:", updatedFormData);
    return updatedFormData;
  });
};

const handleEditEscala = (userId: number, dia: string) => (e: SelectChangeEvent) => {
  const selectedValue = e.target.value;
  
  setFormData((prevFormData) =>
    prevFormData.map((user) => {
      if (user.id_usuario === userId) {
        return {
          ...user,
          medico: {
            ...user.medico,
            escala: {
              ...user.medico.escala,
              [dia]: selectedValue, // atualiza dinamicamente, por exemplo, "segunda", "terca", etc.
            },
          },
        };
      }
      return user;
    })
  );
};

const handleSave = async (e: React.FormEvent, user: any) => {
  e.preventDefault();
  
  try {
    
  const currentData = formData.find(item => item.id_usuario === user.id_usuario);

  if (!currentData) {
      console.error("Dados do usuário não encontrados.");
      setSnackbarMessage("Dados do usuário não encontrados.");
      setOpenSnackbar(true);
      return;
    }

  const tranformedData = {
    segunda: currentData.medico.escala.segunda,
    segunda_horario: currentData.medico.escala.segunda_horario,
    terca: currentData.medico.escala.terca,
    terca_horario: currentData.medico.escala.terca_horario,
    quarta: currentData.medico.escala.quarta,
    quarta_horario: currentData.medico.escala.quarta_horario,
    quinta: currentData.medico.escala.quinta,
    quinta_horario: currentData.medico.escala.quinta_horario,
    sexta: currentData.medico.escala.sexta,
    sexta_horario: currentData.medico.escala.sexta_horario,
    sabado: currentData.medico.escala.sabado,
    sabado_horario: currentData.medico.escala.sabado_horario,
    domingo: currentData.medico.escala.domingo,
    domingo_horario: currentData.medico.escala.domingo_horario,
    id_medico: currentData.medico.id_medico
  };

  const response = await api.put('/Admin/EditarEscala', tranformedData);

    getUsers(currentData)
    setStartEdit(false)
    console.log('Escala atualizada com sucesso:', response.data);
    setSnackbarMessage("Escala atualizada com sucesso.");
    setOpenSnackbar(true);
  } catch (error) {
    console.error('Erro ao atualizar escala:', error);
    setSnackbarMessage("Erro ao atualizar escala.");
    setOpenSnackbar(true);
  }
};


  function corEscala(escala: string) {
    if(escala == "Escalado") {
      return "green";
    } else {
      return "red";
    }
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
        Consulta de Escala
      </Typography>

      {/* Controles para seleção do tipo de busca */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Tipo de Busca</InputLabel>
            <Select
              value={searchType}
              label="Tipo de Busca"
              onChange={(e) => {
                const value = e.target.value as "cpf" | "crm" | "dia";
                setSearchType(value);
                // Limpa os campos ao trocar o tipo de busca
                setSearchValue("");
                setSearchDay("");
              }}
            >
              <MenuItem value="cpf">CPF</MenuItem>
              <MenuItem value="crm">CRM</MenuItem>
              <MenuItem value="dia">Dia Escalado</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Renderiza o campo de busca de acordo com o tipo */}
        {searchType === "dia" ? (
          <Grid item xs={12} sm={8}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Dia</InputLabel>
              <Select
                value={searchDay}
                label="Dia"
                onChange={(e) => setSearchDay(e.target.value)}
              >
                <MenuItem value="segunda">Segunda</MenuItem>
                <MenuItem value="terca">Terça</MenuItem>
                <MenuItem value="quarta">Quarta</MenuItem>
                <MenuItem value="quinta">Quinta</MenuItem>
                <MenuItem value="sexta">Sexta</MenuItem>
                <MenuItem value="sabado">Sábado</MenuItem>
                <MenuItem value="domingo">Domingo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <Grid item xs={12} sm={8}>
            <TextField
              label={searchType === "cpf" ? "Digite o CPF" : "Digite o CRM"}
              variant="outlined"
              fullWidth
              inputProps={{ maxLength: searchType === "cpf" ? 14 : 6 }}
              value={searchType === "cpf" ? insertMaskCpf(searchValue) : searchValue}
              onChange={handleSearchValueChange}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            sx={{ marginBottom: "20px" }}
            startIcon={<PersonSearchIcon />}
          >
            Pesquisar
          </Button>
        </Grid>
      </Grid>

      {/* Tabela de Resultados da Busca */}
      {users.length > 0 && startEdit == false && (   
        <>
          {users.map((user) => (
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
              
              <Typography variant="h4" align="center" marginBottom={1.5}>{user.nome}</Typography>
              <Typography variant="h5" marginTop={3} marginBottom={1}>Dados Pessoais</Typography>
              <Grid container spacing={2}>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18, }}>CPF</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskCpf(user.cpf)}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>CRM</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{user.medico.crm}</Typography>
                  </Grid>
              </Grid>
              <Typography variant="h5" marginTop={3} marginBottom={1}>Escala Semanal</Typography>
              <Grid container spacing={2}>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Segunda-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.segunda) }}>{user.medico.escala?.segunda ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.segunda_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Terça-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.terca) }}>{user.medico.escala?.terca ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.terca_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Quarta-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.quarta) }}>{user.medico.escala?.quarta ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.quarta_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Quinta-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.quinta ) }}>{user.medico.escala?.quinta ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.quinta_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Sexta-Feira</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.sexta) }}>{user.medico.escala?.sexta ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.sexta_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Sábado</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.sabado) }}>{user.medico.escala?.sabado ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.sabado_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Domingo</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black', color: corEscala(user.medico.escala?.domingo) }}>{user.medico.escala?.domingo ?? "Não definido"}</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}>{user.medico.escala?.domingo_horario ?? "Não definido"}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6} sx={{ alignContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={()=>setStartEdit(true)}
                      fullWidth
                      startIcon={<EditIcon />}
                    >
                      Editar
                    </Button>

                  </Grid>
              </Grid>
              </Paper>
          ))}
        </>
      )}

      {/* Quando o botão Editar for pressionado*/}
      {users.length > 0 && startEdit && (   
        <>
          {users.map((user) => (
            <Paper elevation={3} sx={{ padding: 3, marginTop: 3, backgroundColor: '#f2f4ff' }}>
              
              <Typography variant="h4" align="center" marginBottom={1.5}>{user.nome}</Typography>
              <Typography variant="h5" marginTop={3} marginBottom={1}>Dados Pessoais</Typography>
              <Grid container spacing={2}>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18, }}>CPF</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskCpf(user.cpf)}</Typography>
                  </Grid>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>CRM</Typography>
                      <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{user.medico.crm}</Typography>
                  </Grid>
              </Grid>
              <Typography variant="h5" marginTop={3} marginBottom={1}>Escala Semanal</Typography>
              <Grid container spacing={2}>
                  <Grid item sm={6} md={6}>
                      <Typography sx={{ fontSize: 18 }}>Segunda-Feira</Typography>
                      <FormControl fullWidth variant="standard">
                        <Select
                          name="segunda"
                          value={formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.segunda || ""}
                          onChange={handleEditEscala(user.id_usuario, "segunda")}
                          sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                        >
                          <MenuItem value="Escalado">Escalado</MenuItem>
                          <MenuItem value="Folga">Folga</MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        name="segunda_horario"
                        variant="standard"
                        fullWidth
                        size="small"
                        inputProps={{ maxLength: 13 }}
                        sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                        value={
                          insertMaskHora(formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.segunda_horario || "")
                        }
                        onChange={handleEdit(user.id_usuario)}
                      />
                  </Grid>
                  <Grid item sm={6} md={6}>
                    <Typography sx={{ fontSize: 18 }}>Terça-Feira</Typography>
                    <FormControl fullWidth variant="standard">
                      <Select
                        name="terca"
                        value={formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.terca || ""}
                        onChange={handleEditEscala(user.id_usuario, "terca")}
                        sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      >
                        <MenuItem value="Escalado">Escalado</MenuItem>
                        <MenuItem value="Folga">Folga</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      name="terca_horario"
                      variant="standard"
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 13 }}
                      sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      value={
                        insertMaskHora(formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.terca_horario || "")
                      }
                      onChange={handleEdit(user.id_usuario)}
                    />
                  </Grid>
                  <Grid item sm={6} md={6}>
                    <Typography sx={{ fontSize: 18 }}>Quarta-Feira</Typography>
                    <FormControl fullWidth variant="standard">
                      <Select
                        name="quarta"
                        value={formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.quarta || ""}
                        onChange={handleEditEscala(user.id_usuario, "quarta")}
                        sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      >
                        <MenuItem value="Escalado">Escalado</MenuItem>
                        <MenuItem value="Folga">Folga</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      name="quarta_horario"
                      variant="standard"
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 13 }}
                      sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      value={
                        insertMaskHora(formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.quarta_horario || "")
                      }
                      onChange={handleEdit(user.id_usuario)}
                    />
                  </Grid>
                  <Grid item sm={6} md={6}>
                    <Typography sx={{ fontSize: 18 }}>Quinta-Feira</Typography>
                    <FormControl fullWidth variant="standard">
                      <Select
                        name="quinta"
                        value={formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.quinta || ""}
                        onChange={handleEditEscala(user.id_usuario, "quinta")}
                        sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      >
                        <MenuItem value="Escalado">Escalado</MenuItem>
                        <MenuItem value="Folga">Folga</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      name="quinta_horario"
                      variant="standard"
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 13 }}
                      sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      value={
                        insertMaskHora(formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.quinta_horario || "")
                      }
                      onChange={handleEdit(user.id_usuario)}
                    />
                  </Grid>
                  <Grid item sm={6} md={6}>
                    <Typography sx={{ fontSize: 18 }}>Sexta-Feira</Typography>
                    <FormControl fullWidth variant="standard">
                      <Select
                        name="sexta"
                        value={formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.sexta || ""}
                        onChange={handleEditEscala(user.id_usuario, "sexta")}
                        sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      >
                        <MenuItem value="Escalado">Escalado</MenuItem>
                        <MenuItem value="Folga">Folga</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      name="sexta_horario"
                      variant="standard"
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 13 }}
                      sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      value={
                        insertMaskHora(formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.sexta_horario || "")
                      }
                      onChange={handleEdit(user.id_usuario)}
                    />
                  </Grid>
                  <Grid item sm={6} md={6}>
                    <Typography sx={{ fontSize: 18 }}>Sábado</Typography>
                    <FormControl fullWidth variant="standard">
                      <Select
                        name="sabado"
                        value={formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.sabado || ""}
                        onChange={handleEditEscala(user.id_usuario, "sabado")}
                        sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      >
                        <MenuItem value="Escalado">Escalado</MenuItem>
                        <MenuItem value="Folga">Folga</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      name="sabado_horario"
                      variant="standard"
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 13 }}
                      sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      value={
                        insertMaskHora(formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.sabado_horario || "")
                      }
                      onChange={handleEdit(user.id_usuario)}
                    />
                  </Grid>
                  <Grid item sm={6} md={6}>
                    <Typography sx={{ fontSize: 18 }}>Domingo</Typography>
                    <FormControl fullWidth variant="standard">
                      <Select
                        name="domingo"
                        value={formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.domingo || ""}
                        onChange={handleEditEscala(user.id_usuario, "domingo")}
                        sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      >
                        <MenuItem value="Escalado">Escalado</MenuItem>
                        <MenuItem value="Folga">Folga</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      name="domingo_horario"
                      variant="standard"
                      fullWidth
                      size="small"
                      inputProps={{ maxLength: 13 }}
                      sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                      value={
                        insertMaskHora(formData.find((item) => item.id_usuario === user.id_usuario)?.medico.escala.domingo_horario || "")
                      }
                      onChange={handleEdit(user.id_usuario)}
                    />
                  </Grid>
                  <Grid item sm={6} md={6} sx={{ alignContent: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => handleSave(e, user)}
                      fullWidth
                      startIcon={<SaveAltIcon />}
                    >
                      Salvar
                    </Button>

                  </Grid>
              </Grid>
              </Paper>
          ))}
        </>
      )}

      {/* Snackbar para mensagens de feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};