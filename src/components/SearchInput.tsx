import React, { useCallback } from "react";
import { TextField, Button, Box } from "@mui/material";

interface SearchInputProps {
  search: string;
  placeholder: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onSubmitForm: (search: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  search,
  placeholder,
  setSearch,
  onSubmitForm,
}) => {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onSubmitForm(search);
    },
    [onSubmitForm, search]
  );

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: "flex", pb: 5 }}>
        <TextField
          type="text"
          name="search"
          placeholder={placeholder}
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ pr: 2 }}
          fullWidth
        />
        <Button variant="contained" color="primary" type="submit">
          Buscar
        </Button>
      </Box>
    </form>
  );
};

export default SearchInput;
