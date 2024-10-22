import React, { useState, useRef, useEffect } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import CountryCodes from 'Utils/CountryCodes';
import CountryData from 'Utils/CountryData';
import { useCookies } from 'react-cookie';

const CountryCurrencyLanguageSelector = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'userDetails', 'userRole', 'isLoggedIn', 'tempCart', 'tempFavorites', 'selectedCountry', 'selectedCountryCode', 'selectedLanguage', 'selectedLanguageCode', 'selectedCurrency', 'selectedCurrencyCode', 'userCurrency', 'userCurrencyCode']);
    const [selectedCountry, setSelectedCountry] = useState(cookies.selectedCountry ?? '');
    const [selectedCountryCode, setSelectedCountryCode] = useState(cookies.selectedCountryCode ?? '');
    const [selectedLanguage, setSelectedLanguage] = useState(cookies.selectedLanguage ?? "");
    const [selectedLanguageCode, setSelectedLanguageCode] = useState(cookies.selectedLanguageCode ?? "");
    const [selectedCurrency, setSelectedCurrency] = useState(cookies.selectedCurrency || cookies.userCurrency || "USD");
    const [selectedCurrencyCode, setSelectedCurrencyCode] = useState(cookies.selectedCurrencyCode || cookies.userCurrencyCode || "$");

    const userDetails = cookies.userDetails;

    const customLabels = {
        '': 'Select a country',
        ...CountryCodes
    };

    const countries = ['', ...Object.keys(CountryCodes)];

    // Extract unique languages and currencies
    const extractUniqueLanguagesAndCurrencies = (data) => {
        const languages = new Set();
        const currencies = new Set();

        Object.values(data).forEach(country => {
            languages.add(country.language);
            currencies.add(country.currency);
        });

        return {
            uniqueLanguages: Array.from(languages),
            uniqueCurrencies: Array.from(currencies),
        };
    };

    const { uniqueLanguages, uniqueCurrencies } = extractUniqueLanguagesAndCurrencies(CountryData);

    const selectCountry = (e) => {
        const code = e.target.value;
        if (CountryData[code]?.name) {
            setSelectedCountryCode(code);
            setSelectedCountry(CountryData[code].name);
            setSelectedLanguage(CountryData[code].language);
            setSelectedLanguageCode(CountryData[code].languageCode);
            setSelectedCurrency(CountryData[code].currency);
            setSelectedCurrencyCode(CountryData[code].currencyCode);
            setCookie('selectedCountry', CountryData[code].name, { path: '/' });
            setCookie('selectedCountryCode', code, { path: '/' });
            setCookie('selectedLanguage', CountryData[code].language, { path: '/' });
            setCookie('selectedLanguageCode', CountryData[code].languageCode, { path: '/' });
            setCookie('selectedCurrency', CountryData[code].currency, { path: '/' });
            setCookie('selectedCurrencyCode', CountryData[code].languageCode, { path: '/' });

        } else {

            setSelectedCountryCode("");
            setSelectedCountry("");
            setSelectedLanguage("");
            setSelectedLanguageCode("");
            setSelectedCurrency("");
            setSelectedCurrencyCode("");

            removeCookie('selectedCountry', { path: '/' });
            removeCookie('selectedCountryCode', { path: '/' });
            removeCookie('selectedLanguage', { path: '/' });
            removeCookie('selectedLanguageCode', { path: '/' });
            removeCookie('selectedCurrency', { path: '/' });
            removeCookie('selectedCurrencyCode', { path: '/' });

            const select = document.querySelector('.goog-te-combo');
            
            // if (select) {
            //     select.value = 'en';
            //     select.dispatchEvent(new Event('change'));
            // }

            // setSelectedCountryCode("US");
            // setSelectedCountry(CountryData["US"].name);
            // setSelectedLanguage(CountryData["US"].language);
            // setSelectedCurrency(CountryData["US"].currency);
            // setSelectedCurrencyCode(CountryData["US"].currencyCode);
            // setCookie('selectedCountry', CountryData["US"].name, { path: '/' });
            // setCookie('selectedCountryCode', "US", { path: '/' });
            // setCookie('selectedLanguage', CountryData["US"].language, { path: '/' });
            // setCookie('selectedCurrency', CountryData["US"].currency, { path: '/' });
            // setCookie('selectedCurrencyCode', CountryData["US"].currencyCode, { path: '/' });
        }

    };

    const selectLanguage = (e) => {
        const { name, value } = e.target;
        const select = document.querySelector('.goog-te-combo');

        if (value != "") {
            const countryWithLanguage = Object.values(CountryData).find(country => country.language === value);
            if (countryWithLanguage) {
                setSelectedLanguageCode(countryWithLanguage.languageCode);
                setCookie('selectedLanguageCode', countryWithLanguage.languageCode, { path: '/' });
            }
            setSelectedLanguage(value);
            setCookie('selectedLanguage', value, { path: '/' });
        }  else {
            setSelectedLanguage("");
            setSelectedLanguageCode("");
            removeCookie('selectedLanguage', { path: '/' });
            removeCookie('selectedLanguageCode', { path: '/' });
        }
        
        
    }

    const selectCurrency = (e) => {
        const { name, value } = e.target;
        setSelectedCurrency(value);
        setCookie('selectedCurrency', value, { path: '/' });

        const countryWithCurrency = Object.values(CountryData).find(country => country.currency === value);
        if (countryWithCurrency) {
            setSelectedCurrencyCode(countryWithCurrency.currencyCode);
            setCookie('selectedCurrencyCode', countryWithCurrency.currencyCode, { path: '/' });
        } else {
            setSelectedCurrencyCode('');
            removeCookie('selectedCurrencyCode', { path: '/' });
        }
    }

    useEffect(() => {
        if (selectedLanguageCode && selectedLanguageCode != "") {
            const languageCode = selectedLanguageCode;
            const select = document.querySelector('.goog-te-combo');
            
            // if (select) {
            //     select.value = languageCode;
            //     select.dispatchEvent(new Event('change'));
            // }
        }
        console.log(userDetails);
    }, [cookies, selectedLanguageCode]);

    return (
        <>
            <div className="country-currency-language-selector p-2">
                {/* Country Select */}
                <label className="mb-2">Country</label>
                <select 
                    className="form-control mb-3 cursor-pointer"
                    value={selectedCountryCode} 
                    onChange={selectCountry}>
                        <option value=''>Select a country</option>
                        {Object.entries(CountryCodes).map(([code, name]) => (
                            <option key={code} value={code}>
                                {name}
                            </option>
                        ))}
                </select>
                {/* Currency Select */}
                <label className="mb-2">Currency</label>
                <select
                    className="form-control mb-3 cursor-pointer"
                    name="currency"
                    onChange={selectCurrency}
                    value={selectedCurrency}
                >
                    <option value="">Select Currency</option>
                    {uniqueCurrencies.map((currency, index) => (
                        <option key={index} value={currency}>{currency}</option>
                    ))}
                </select>

                {/* Language Select */}
                <label className="mb-2">Language</label>
                <select
                    className="form-control cursor-pointer"
                    name="language"
                    onChange={selectLanguage}
                    value={selectedLanguage}
                >
                    <option value="">Select Language</option>
                    {uniqueLanguages.map((language, index) => (
                        <option key={index} value={language}>{language}</option>
                    ))}
                </select>

            </div>
        </>
    );

}

export default CountryCurrencyLanguageSelector;