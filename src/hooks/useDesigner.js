import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import useCountry from "hooks/useCountry";
import { selectDesignersFilters } from "store/slices/designersSlice";
import { selectDesigners } from "store/slices/designersSlice";

const useDesignersFilters = () => {
  const { countries } = useCountry();
  const designFilters = useSelector(selectDesignersFilters);
  const currenStoreUser = useSelector((state) => state.user.user);
  const currentUser = currenStoreUser?.email;
  const designerQueryResult = useSelector(selectDesigners);
  const designers = designerQueryResult.data;
  const navigate = useNavigate();
  const useQuery = () => new URLSearchParams(useLocation().search);
  const isFirstRender = useRef(true);

  let query = useQuery();
  const headerSearch = query.get("search");

  const [cookies, setCookie, removeCookie] = useCookies([
    "currentUser",
    "token",
    "isLoggedIn",
    "userDetails",
    "userRole",
    "tempDesignerWishlist",
    "selectedCountry",
    "selectedCountryCode",
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [selectedCountry, setSelectedCountry] = useState(
    cookies.selectedCountry ?? ""
  );

  // Search
  const [specializationSearch, setSpecializationSearch] = useState("");
  const [specializationValue, setSpecializationValue] = useState("");

  // Filter Arrays
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAllCategories, setSelectedAllCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  const [signupModalShow, setSignupModalShow] = useState(false);
  const [activeTabGroup, setActiveTabGroup] = useState("");
  const [signupType, setSignupType] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [tempDesignerWishlist, setTempDesignerWishlist] = useState([]);

  const selectedCountryIso3 = countries.find(
    (country) => country.name === selectedCountry
  )?.iso3;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [seasonsValue, setSeasonsValue] = useState("");
  const [colorsValue, setColorsValue] = useState("");

  const handleChangeSeason = (value) => {
    setSeasonsValue(value);
  };
  const handleChangeColor = (value) => {
    setColorsValue(value);
  };

  const handleChangeCountry = (e) => {
    const { value } = e.target;
    setSelectedCountry(value ?? "");
  };
  const [materialsValue, setMaterialsValue] = useState("");

  const handleChangeMaterial = (value) => {
    setMaterialsValue(value);
  };
  const [selectedGenders, setSelectedGenders] = useState([]);

  const handleSelectGenderChange = (event) => {
    const gender = event.target.value;
    if (event.target.checked) {
      setSelectedGenders([...selectedGenders, gender]);
    } else {
      setSelectedGenders(selectedGenders.filter((g) => g !== gender));
    }
  };
  const [genders, setGenders] = useState([]);

  const handleCheckBoxChange = (e, setFunction) => {
    const value = e;
    setFunction((prevState) =>
      prevState.includes(value)
        ? prevState.filter((g) => g !== value)
        : [...prevState, value]
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsRefreshing(true);
  }, [
    selectedGenders,
    currentPage,
    searchValue,
    selectedCountryIso3,
    specializationSearch,
    selectedCategories,
    seasonsValue,
    colorsValue,
    materialsValue,
    genders
  ]);

  const toggleGetUser = (e) => {
    navigate("/designer-profile?user_id=" + e);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleChangeSpecialization = (e) => {
    const { value } = e.target;
    setSpecializationValue(value);
    setSpecializationSearch(value);
  };

  const handleChangePage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  async function wishlistDesignerUpdate() {
    // Implement wishlist update logic
  }

  const toggleTempDesignerWishlist = (item) => {
    const itemExists = tempDesignerWishlist.some(
      (wishlistItem) => wishlistItem.id === item.id
    );

    let updatedDesignerWishlist;
    if (itemExists) {
      updatedDesignerWishlist = tempDesignerWishlist.filter(
        (wishlistItem) => wishlistItem.id !== item.id
      );
    } else {
      updatedDesignerWishlist = [...tempDesignerWishlist, item];
    }

    setCookie("tempDesignerWishlist", JSON.stringify(updatedDesignerWishlist), {
      path: "/",
    });
    setTempDesignerWishlist(updatedDesignerWishlist);
  };

  const handleChangeCategory = (event) => {
    const categoryId = parseInt(event, 10);
    if (!selectedCategories.includes(categoryId)) {
      setSelectedCategories([...selectedCategories, categoryId]);
      if (selectedAllCategories.length + 1 === categories.length) {
        setSelectedAllCategories(true);
      } else {
        setSelectedAllCategories(false);
      }
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleSelectCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    }
  };

  const handleSelectAllCategories = (event) => {
    if (event.target.checked) {
      setSelectedCategories(categories.map((category) => category.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const clearFilters = () => {
    setSelectedCountry("");
    setSpecializationSearch("");
    setSpecializationValue("");
    setSelectedCategories([]);
    setSelectedAllCategories(false);
    setSearchValue("");
    setMaterialsValue("");
    setColorsValue("");
    setSeasonsValue("");
    setMaterialsValue("");
    setSelectedGenders([]);
  };

  return {
    handleCheckBoxChange,
    handleSelectGenderChange,
    selectedGenders,
    materialsValue,
    handleChangeMaterial,
    handleChangeSeason,
    seasonsValue,
    setSelectedCategories,
    countries,
    designFilters,
    currentUser,
    designers,
    navigate,
    query,
    headerSearch,
    cookies,
    currentPage,
    pageCount,
    pageSize,
    selectedCountry,
    specializationSearch,
    specializationValue,
    selectedCategories,
    selectedAllCategories,
    categories,
    signupModalShow,
    activeTabGroup,
    signupType,
    searchValue,
    tempDesignerWishlist,
    isRefreshing,
    toggleGetUser,
    handleSearchChange,
    handleChangeSpecialization,
    handleChangePage,
    wishlistDesignerUpdate,
    toggleTempDesignerWishlist,
    handleChangeCategory,
    handleSelectCategoryChange,
    handleSelectAllCategories,
    clearFilters,
    handleChangeCountry,
    setActiveTabGroup,
    setSelectedAllCategories,
    isFirstRender,
    selectedCountryIso3,
    setIsRefreshing,
    handleChangeColor,
    colorsValue,
    genders,
    setGenders,
  };
};

export default useDesignersFilters;
