
// puxar nome do producte e valor do pedido
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

const Product: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
//   const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
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

          // Use the obtained token to make the request for product data
          axios
            .get(
              `https://cors-anywhere.herokuapp.com/http://idealsoftexportaweb.eastus.cloudapp.azure.com:60500/produtos/1`,
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
            .then((productResponse) => {
              // Log the product data to the console
              setProducts(productResponse.data.dados);
              console.log(JSON.stringify(productResponse.data));
            })
            .catch((error) => {
              // Log any errors encountered during the request for product data
              console.log("Error fetching product data:", error);
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
    if (!productName) {
        fetchProducts();
    //   setErrorMessage("Please enter a product name.");
      return;
    }

    const filteredProducts = products.filter((product) =>
      product.nome.toLowerCase().includes(productName.toLowerCase())
    );

    setProducts(filteredProducts);
    console.log("Search results:", filteredProducts);
  };

  return (
    <React.Fragment>
      <Container maxWidth="xl">
      <Typography variant="h4" align="left" gutterBottom>
          Buscar produtos
        </Typography>

        <SearchInput
          search={productName}
          setSearch={setProductName}
          onSubmitForm={handleSearch}
          placeholder={"Buscar produto"}
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
                <TableCell>Nome do Produto</TableCell>
                <TableCell>Codigo</TableCell>
                <TableCell>Preço</TableCell>
                {/* Add more table headers as needed */}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.nome}</TableCell>
                  <TableCell>{product.codigo}</TableCell>
                  <TableCell>{`R$: ${product.precos[0].preco},00`}</TableCell>
                  {/* Add more table cells based on the product object properties */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </React.Fragment>
  );
};

export default Product;
