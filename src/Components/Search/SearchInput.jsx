import  { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import Form from "react-bootstrap/Form";

const SearchInput = ({
  onSearchChange,
  placeholder = "Enter your search term...",
}) => {
  const [search, setSearch] = useState("");

  const debounceSearch = useCallback(
    debounce((value) => {
      onSearchChange(value);
    }, 1000),
    []
  );

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearch(value);
    debounceSearch(value);
  };

  useEffect(() => {
    return () => {
      debounceSearch.cancel();
    };
  }, [debounceSearch]);

  return (
    <Form.Control
      placeholder={placeholder}
      type="text"
      value={search}
      onChange={handleSearchChange}
    />
  );
};

export default SearchInput;
