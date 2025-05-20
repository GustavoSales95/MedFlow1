import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
} from "@mui/material";

interface Consulta {
  id_consulta: number;
  agendamento_id: number;
  descricao: string;
  receita: string;
  observacoes: string;
  data_consulta: string; 
};

export const AgendaDia = () => {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState<string>(""); // Para capturar e exibir erros, caso ocorram

  // Função para buscar as consultas do backend
  const fetchConsultas = async () => {
    try {
      // Substitua pela URL do seu backend para pegar as consultas do banco
      const response = await fetch("Conexão com o back");

      // Verifica se a resposta é bem-sucedida
      if (!response.ok) {
        throw new Error("Erro ao buscar as consultas");
      }

      // Converte os dados recebidos para o formato JSON
      const data = await response.json();

      // Atualiza o estado com as consultas recebidas
      setConsultas(data);
    } catch (error: any) {
      // Caso ocorra algum erro, define a mensagem de erro
      setError("Erro ao carregar as consultas");
    } finally {
      // Independentemente do sucesso ou erro, o carregamento termina
      setLoading(false);
    }
  };

  // UseEffect para buscar as consultas ao carregar o componente
  useEffect(() => {
    fetchConsultas();
  }, []);

  return (
    <Card sx={{ margin: 4 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Consultas do Dia
        </Typography>
        /* Exibe o carregamento enquanto as consultas não estão carregadas */
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          // Exibe a mensagem de erro, caso haja algum problema ao buscar as consultas
          <Typography color="error" variant="body1" mt={2}>
            {error}
          </Typography>
        ) : consultas.length === 0 ? (
          // Exibe mensagem caso não haja consultas agendadas
          <Typography color="text.secondary" mt={2}>
            Nenhuma consulta agendada para hoje.
          </Typography>
        ) : (
          // Exibe a tabela com as consultas agendadas
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Consulta</TableCell>
                <TableCell>Agendamento ID</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Receita</TableCell>
                <TableCell>Observações</TableCell>
                <TableCell>Data da Consulta</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consultas.map((consulta) => (
                <TableRow key={consulta.id_consulta}>
                  <TableCell>{consulta.id_consulta}</TableCell>
                  <TableCell>{consulta.agendamento_id}</TableCell>
                  <TableCell>{consulta.descricao}</TableCell>
                  <TableCell>{consulta.receita}</TableCell>
                  <TableCell>{consulta.observacoes}</TableCell>
                  <TableCell>{consulta.data_consulta}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
