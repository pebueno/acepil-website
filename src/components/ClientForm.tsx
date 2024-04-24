import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios'; // Import Axios

const ClientForm: React.FC = () => {
  const [clientName, setClientName] = useState<string>('');
  const [productValue, setProductValue] = useState<number | ''>('');
  const [searchResults, setSearchResults] = useState<any[]>([]); // State to store search results

  // Function to search clients by name
  const handleSearch = async () => {
    try {
      const response = await axios.get('http://idealsoftexportaweb.eastus.cloudapp.azure.com:60500/clientes/1', {
        headers: {
          'cache-control': 'no-cache',
          'Signature': 'NeSiUh5y4lEgyHNPwFv7fmUxd4gmnitnvHYz21PylD0=',
          'CodFilial': '1',
          'Authorization': 'Token SElFQVBBLTYwMDc1OS1ST0NUMDAwMQ0KYWRtaW4NCjYzODQ5NTE2MzQyMjExNjEzNg0KUG9zdG1hblJ1bnRpbWUvNy4zNy4z:CCc9doKjvQyw4qEsPUWoV7136hFtrZ814PDDT2i6QDw=',
          'Timestamp': '1713919758'
        }
      });

      if (response.data && response.data.dados) {
        const filteredClients = response.data.dados.filter((client: any) =>
          client.nome.toLowerCase().includes(clientName.toLowerCase())
        );
        setSearchResults(filteredClients);
      } else {
        console.error('No clients found');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching clients:', error);
      setSearchResults([]);
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you can handle the form submission, e.g., send the data to an API
    console.log('Client Name:', clientName);
    console.log('Product Value:', productValue);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Get Client Name and Product Value
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <TextField
          label="Client Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <TextField
          label="Product Value"
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          value={productValue}
          onChange={(e) => setProductValue(parseFloat(e.target.value))}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 2 }}
        >
          Submit
        </Button>
      </form>
      {/* Display search results */}
      {searchResults.length > 0 && (
        <div>
          <Typography variant="h6" align="center" gutterBottom>
            Search Results
          </Typography>
          <ul>
            {searchResults.map((client: any) => (
              <li key={client.codigo}>{client.nome}</li>
            ))}
          </ul>
        </div>
      )}
    </Container>
  );
};

export default ClientForm;
