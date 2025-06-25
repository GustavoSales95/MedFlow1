import React, { useState, useEffect } from "react";
import api from "../../../../services/api";
import { insertMaskCpf, insertMaskTel, insertMaskCep, insertMaskSus, formatarDataHora } from '../../../functions/InsertMasks';
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
  FormControlLabel,
  Checkbox,
  Grid2,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { useNavigate } from "react-router-dom";

interface Pacientes {
  id_paciente: number;
  nome: string;
  cpf: string;
  cartao_sus: string;
  telefone: string;
  cep: string;
  endereco: string;
  data_nascimento: string;
}

interface Consulta {
  id_consulta: number;
  agendamento_id: number;
  prontuario_id: number;
  descricao: string;
  receita: string;
  observacoes?: string;
  data_consulta: string;
}

interface Prontuario {
  prontuario_id: number;
  paciente_id?: number;
  alergias?: string;
  tipo_sanguineo?: string;
  medicamentos?: string;
  cirurgias?: string;
  doencas_infecciosas?: string;
  consultas: Consulta[];
}

export const ConsultarProntuario = () => {
  const navigate = useNavigate();
  const [cpf, setCpf] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [Pacientes, setPacientes] = useState<Pacientes[]>([]);
  const [prontuario, setProntuario] = useState<Prontuario | null>(null);
  const [startEdit, setStartEdit] = useState(false);
  const [formData, setFormData] = useState<Prontuario | null>(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(e.target.value.replace(/\D/g, ""));
  };

  const handleSearch = async () => {
    if (cpf.length !== 11) {
      setSnackbarMessage(
        "CPF inválido! Por favor, digite um CPF válido com 11 dígitos."
      );
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await api.get("Medico/ConsultarProntuarios", {
        params: { cpf },
      });

      console.log("Resposta da API:", response.data);

      if (!response.data.message || !response.data.paciente) {
        setSnackbarMessage(
          "Nenhum prontuário encontrado para o CPF informado."
        );
        setOpenSnackbar(true);
        return;
      }

      setPacientes([response.data.paciente]);
      setProntuario(response.data.message);
      setFormData(response.data.message);
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
      setSnackbarMessage("Erro ao buscar prontuário. Tente novamente.");
      setOpenSnackbar(true);
    }
  };

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!formData) { return }

    setFormData({ ...formData, [name]: value });
  }

  const handleSave = async (e: React.FormEvent, user: any) => {
    try {
      const cpf = Pacientes[0].cpf;
      const response = await api.put('/Medico/ConsultarProntuarios', formData);
      const paciente = await api.get("/Medico/ConsultarProntuarios", {
        params: { cpf },
      });
      
      setProntuario(paciente.data.message);
      setStartEdit(false);
      console.log('Prontuário atualizado com sucesso:', (await response).data);
      setSnackbarMessage("Prontuário atualizado com sucesso.");
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao atualizar prontuário:', error);
      setSnackbarMessage("Erro ao atualizar prontuário.");
      setOpenSnackbar(true);
    }
  };

  function formatarData(dataNasc: string) {
    const data = new Date(dataNasc);

    const dataFormatada = data.toLocaleDateString("pt-BR");

    return dataFormatada;
  }

  return (
    <Box sx={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <Typography
        variant="h4"
        sx={{ marginBottom: "20px", textAlign: "center" }}
      >
        Consulta de Prontuário
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Digite o CPF"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 14 }}
            value={insertMaskCpf(cpf)}
            onChange={handleCpfChange}
            sx={{ marginBottom: "20px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            fullWidth
            sx={{ marginBottom: "20px" }}
          >
            <PersonSearchIcon/>
            Pesquisar
          </Button>
        </Grid>
      </Grid>

      {prontuario && !startEdit && (
        <><Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h4" align="center" marginBottom={1.5}>
            Prontuário Médico
          </Typography>

          <Typography variant="h5" marginTop={3} marginBottom={1}>
            Dados Pessoais
          </Typography>
          <Grid container spacing={2}>
            {Pacientes.map((paciente) => (
              <>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18 }}>Nome</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {paciente.nome}
                  </Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18 }}>CPF</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {insertMaskCpf(paciente.cpf)}
                  </Typography>
                </Grid>
                <Grid item sm={6} md={6}>

                  <Typography sx={{ fontSize: 18, }}>Cartão do SUS</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskSus(paciente.cartao_sus) || "Não informado"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18, }}>Data de Nascimento</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{formatarData(paciente.data_nascimento)}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18 }}>Telefone</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {insertMaskTel(paciente.telefone) || "Não informado"}
                  </Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18, }}>CEP</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskCep(paciente.cep) || "Não informado"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18, }}>Endereço</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{paciente.endereco || "Não informado"}</Typography>
                </Grid>
              </>
            ))}
          </Grid>

          <Typography variant="h5" marginTop={3} marginBottom={1}>
            Informações Médicas
          </Typography>
          <Grid container spacing={2}>
            <>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>Alergias</Typography>
                <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                  {prontuario.alergias || "Nenhuma"}
                </Typography>
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>
                  Doenças Infecciosas
                </Typography>
                <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                  {prontuario.doencas_infecciosas || "Nenhuma"}
                </Typography>
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>
                  Medicamentos de Uso Contínuo
                </Typography>
                <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                  {prontuario.medicamentos || "Nenhum"}
                </Typography>
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>
                  Cirurgias Anteriores
                </Typography>
                <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                  {prontuario.cirurgias || "Nenhuma"}
                </Typography>
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>Tipo Sanguíneo</Typography>
                <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                  {prontuario.tipo_sanguineo || "Não informado"}
                </Typography>
              </Grid>
              <Grid item sm={6} md={6} sx={{ alignContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setStartEdit(true)}
                  fullWidth
                  startIcon={<EditIcon />}
                >
                  Editar
                </Button>

              </Grid>
            </>
          </Grid>
        </Paper>
        < Grid>
          <Typography variant="h4" marginTop={7} marginBottom={1} textAlign={'center'}>
            Histórico
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "nowrap", overflow: "scroll", width: "100%" }}>
            {prontuario.consultas.length > 0 ? (
              prontuario.consultas.map((consulta) => {
                const dataHora = formatarDataHora(consulta.data_consulta);
                return (
                  <Paper
                    key={consulta.id_consulta}
                    elevation={3}
                    sx={{
                      flex: "0 0 30%",  // Garante 40% da largura do pai sem encolher
                      padding: 3,
                      margin: 3,
                      boxSizing: "border-box",
                      display: "flex",
                      flexWrap: "wrap"
                    }}
                  >
                    <Grid2>
                      {dataHora.data}
                    </Grid2>
                    <Grid2 sx={{ marginTop: 1.3 }}>
                      <Typography sx={{ fontSize: 16, padding: 0.7 }}>
                        {consulta.descricao || "Consulta esperando para ser finalizada"}
                      </Typography>
                    </Grid2>
                    <Grid2 sx={{ marginTop: 2, marginLeft: 0.8, }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/Medico/Consulta/${consulta.id_consulta}`)}
                      >
                        Ver detalhes
                      </Button>
                    </Grid2>
                  </Paper>
                );
              })
            ) : (
              <Paper elevation={4}>
                <Typography>Paciente não possui histórico no momento</Typography>
              </Paper>
            )}
          </Box>
        </Grid>
        </>
      )}

      {prontuario && startEdit && (
        <><Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
          <Typography variant="h4" align="center" marginBottom={1.5}>
            Prontuário Médico
          </Typography>

          <Typography variant="h5" marginTop={3} marginBottom={1}>
            Dados Pessoais
          </Typography>
          <Grid container spacing={2}>
            {Pacientes.map((paciente) => (
              <>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18 }}>Nome</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {paciente.nome}
                  </Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18 }}>CPF</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {insertMaskCpf(paciente.cpf)}
                  </Typography>
                </Grid>
                <Grid item sm={6} md={6}>

                  <Typography sx={{ fontSize: 18, }}>Cartão do SUS</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskSus(paciente.cartao_sus) || "Não informado"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18, }}>Data de Nascimento</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{formatarData(paciente.data_nascimento)}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18 }}>Telefone</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>
                    {insertMaskTel(paciente.telefone) || "Não informado"}
                  </Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18, }}>CEP</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{insertMaskCep(paciente.cep) || "Não informado"}</Typography>
                </Grid>
                <Grid item sm={6} md={6}>
                  <Typography sx={{ fontSize: 18, }}>Endereço</Typography>
                  <Typography sx={{ fontSize: 16, padding: 0.7, border: 1 }}>{paciente.endereco || "Não informado"}</Typography>
                </Grid>
              </>
            ))}
          </Grid>

          <Typography variant="h5" marginTop={3} marginBottom={1}>
            Informações médicas
          </Typography>
          <Grid container spacing={2}>
            <>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>Alergias</Typography>
                <TextField
                  name="alergias"
                  variant="standard"
                  fullWidth
                  size="small"
                  sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                  value={formData?.alergias}
                  onChange={handleEdit} />
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>
                  Doenças Infecciosas
                </Typography>
                <TextField
                  name="doencas_infecciosas"
                  variant="standard"
                  fullWidth
                  size="small"
                  sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                  value={formData?.doencas_infecciosas}
                  onChange={handleEdit} />
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>
                  Medicamentos de Uso Contínuo
                </Typography>
                <TextField
                  name="medicamentos"
                  variant="standard"
                  fullWidth
                  size="small"
                  sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                  value={formData?.medicamentos}
                  onChange={handleEdit} />
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>
                  Cirurgias Anteriores
                </Typography>
                <TextField
                  name="cirurgias"
                  variant="standard"
                  fullWidth
                  size="small"
                  sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                  value={formData?.cirurgias}
                  onChange={handleEdit} />
              </Grid>
              <Grid item sm={6} md={6}>
                <Typography sx={{ fontSize: 18 }}>Tipo Sanguíneo</Typography>
                <TextField
                  name="tipo_sanguineo"
                  variant="standard"
                  fullWidth
                  size="small"
                  sx={{ fontSize: 16, padding: 0.7, border: '1px solid black' }}
                  value={formData?.tipo_sanguineo}
                  onChange={handleEdit} />
              </Grid>
              <Grid item sm={6} md={6} sx={{ alignContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => handleSave(e, prontuario)}
                  fullWidth
                  startIcon={<SaveAltIcon />}
                >
                  Salvar
                </Button>
              </Grid>
            </>
          </Grid>
        </Paper><Grid>
            <Typography variant="h4" marginTop={7} marginBottom={1} textAlign={'center'}>
              Histórico
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {prontuario.consultas.length > 0 ? (
                prontuario.consultas.map((consulta) => {
                  const dataHora = formatarDataHora(consulta.data_consulta);

                  return (
                    <Paper
                      key={consulta.id_consulta}
                      elevation={3}
                      sx={{ padding: 3, margin: 3, width: "27%", display: "flex", flexWrap: "wrap" }}
                    >
                      <Grid2>
                        {dataHora.data}
                      </Grid2>
                      <Grid2 sx={{ marginTop: 1.3 }}>
                        <Typography sx={{ fontSize: 16, padding: 0.7 }}>
                          {consulta.descricao || "Consulta esperando para ser finalizada"}
                        </Typography>
                      </Grid2>
                      <Grid2 sx={{ marginTop: 2, marginLeft: 0.8 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() =>
                          navigate(`/Medico/Consulta/${consulta.id_consulta}`)
                        }>
                          Ver detalhes
                        </Button>
                      </Grid2>
                    </Paper>
                  );
                })
              ) : (
                <Paper elevation={4}>
                  <Typography>Paciente não possui histórico no momento</Typography>
                </Paper>
              )}
            </Box>
          </Grid></>
        
      )}

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
