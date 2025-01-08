import { useState, useEffect } from "react";
import axios from "axios";

const useCountry = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  const baseURL = import.meta.env.VITE_REACT_APP_API_ENDPOINT;
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${baseURL}countries`);
        if (response.data.success) {
          setCountries(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const fetchStates = async (country) => {
    setLoadingStates(true);
    try {
      const response = await axios.get(`${baseURL}country/${country}/states`);
      setStates(response.data.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (country, stateCode) => {
    setLoadingCities(true);
    try {
      const response = await axios.get(
        `${baseURL}country/${country}/state/${stateCode}/cities`
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  return {
    countries,
    states,
    cities,
    loadingStates,
    loadingCities,
    fetchStates,
    fetchCities,
  };
};

export default useCountry;
