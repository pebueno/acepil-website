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

const Product: React.FC = () => {
  const [productName, setProductName] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("https://acepil-server.onrender.com/api/products")
      .then((response) => {
        setProducts(response.data.dados);
        setFilteredProducts(response.data.dados);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  };

  const handleSearch = () => {
    if (!productName.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filteredResults = products.filter((product) =>
      product.nome.toLowerCase().includes(productName.toLowerCase())
    );

    setFilteredProducts(filteredResults);

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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome do Produto</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Preço</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.nome}</TableCell>
                  <TableCell>{product.codigo}</TableCell>
                  <TableCell>{`R$ ${product.precos[0].preco},00`}</TableCell>
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
