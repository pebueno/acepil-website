import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import axios from "axios";
import SearchInput from "../components/SearchInput";

const MainPage: React.FC = () => {
  const [clientName, setClientName] = useState<string>("");
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    axios.get("https://acepil-server.onrender.com/api/")
      .then((response) => {
        setClients(response.data);
      })
      .catch((error) => {
        console.error("Error fetching client data:", error);
      });
  };

  const handleSearch = () => {
    if (!clientName.trim()) {
      fetchClients();
      return;
    }

    const filteredClients = clients.filter((client) =>
      client.nome.toLowerCase().includes(clientName.toLowerCase())
    );

    setClients(filteredClients);
    console.log("Search results:", filteredClients);
  };

  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <Typography variant="h4" align="left" gutterBottom>
          Buscar clientes
        </Typography>

        <SearchInput
          search={clientName}
          setSearch={setClientName}
          onSubmitForm={handleSearch}
          placeholder={"Buscar cliente"}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome do Cliente</TableCell>
                <TableCell>CPF/CNPJ</TableCell>
                <TableCell>Endereço</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell>{client.nome}</TableCell>
                  <TableCell>{client.cpfCnpj}</TableCell>
                  <TableCell>{`${client.endereco}, ${client.numero}, ${client.bairro}, ${client.cidade} - ${client.uf}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </React.Fragment>
  );
};

export default MainPage;
