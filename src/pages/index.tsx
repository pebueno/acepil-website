
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
import hmacSHA256 from "crypto-js/hmac-sha256";
import Base64 from "crypto-js/enc-base64";
import axios from "axios";
import SearchInput from "../components/SearchInput";

const MainPage: React.FC = () => {
  const [clientName, setClientName] = useState<string>("");
  const [clients, setClients] = useState<any[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = () => {
    var timestamp = Math.floor(Date.now() / 1000).toString();

    // Function to generate the Signature
    function generateSignature() {
      const method = "get"; // Assuming 'get' method for example
      // const timestamp = Date.now().toString(); // Current timestamp

      // Concatenate the uppercase method with the timestamp
      const concatString = method.toLowerCase() + timestamp;
      const secretKey = "senha";

      // Hash the concatenated string using SHA-256
      const hash = Base64.stringify(hmacSHA256(concatString, secretKey));

      return hash;
    }

    // Function to make the request
    function makeRequest() {
      const signature = generateSignature();
      console.log("signature:", signature);

      axios
        .get(
          `https://cors-anywhere.herokuapp.com/http://idealsoftexportaweb.eastus.cloudapp.azure.com:60500/auth/?serie=HIEAPA-600759-ROCT&codfilial=1`,
          {
            headers: {
              "cache-control": "no-cache",
              Signature: "-1",
            },
          }
        )
        .then((authResponse) => {
          // Extract the token from the response data
          const token = authResponse.data.dados.token;
          console.log("passei por aqui");

          // Use the obtained token to make the request for client data
          axios
            .get(
              `https://cors-anywhere.herokuapp.com/http://idealsoftexportaweb.eastus.cloudapp.azure.com:60500/clientes/9`,
              {
                headers: {
                  "cache-control": "no-cache",
                  Signature: signature,
                  CodFilial: "1",
                  Authorization: `Token ${token}`, // Include the token in the Authorization header
                  Timestamp: timestamp, // Include the timestamp in the headers
                },
              }
            )
            .then((clientResponse) => {
              // Log the client data to the console
              setClients(clientResponse.data.dados);
              console.log(JSON.stringify(clientResponse.data));
            })
            .catch((error) => {
              // Log any errors encountered during the request for client data
              console.log("Error fetching client data:", error);
            });
        })
        .catch((error) => {
          // Log any errors encountered during the request for the authentication token
          console.log("Error fetching authentication token:", error);
        });
    }

    // Call the function to make the request
    makeRequest();
  };

  const handleSearch = () => {
    if (!clientName.trim()) {
        fetchClients();
    //   setErrorMessage("Please enter a client name.");
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

        {/* {errorMessage && (
          <Typography variant="body1" color="error" align="center" gutterBottom>
            {errorMessage}
          </Typography>
        )} */}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome do Cliente</TableCell>
                <TableCell>CPF/CNPJ</TableCell>
                <TableCell>Endereço</TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client, index) => (
                <TableRow key={index}>
                  <TableCell>{client.nome}</TableCell>
                  <TableCell>{client.cpfCnpj}</TableCell>
                  <TableCell>{`${client.endereco}, ${client.numero}, ${client.bairro}, ${client.cidade} - ${client.uf}`}</TableCell>
                  {/* Add more table cells based on the client object properties */}
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
