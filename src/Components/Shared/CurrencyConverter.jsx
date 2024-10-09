import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const CurrencyConverter = (props) => {
    const [cookies, setCookie, removeCookie] = useCookies(['currencyConversions', 'selectedCurrency', 'selectedCurrencyCode', 'currentUser']);
    const [convertedPrice, setConvertedPrice] = useState(0);
    const [currencyCode, setCurrencyCode] = useState('');
    
    const currencyConversions = cookies.currencyConversions;
    const selectedCurrency = cookies.selectedCurrency || props.userCurrency || 'USD';
    const selectedCurrencyCode = cookies.selectedCurrencyCode || props.userCurrencyCode || '$';
    const currentUser = cookies.currentUser;
    const currency = props.currency;
    const price = props.price;

    function formatPrice(price) {
        // Convert the price to a string
        let priceStr = price.toString();
    
        // Check if the price contains a comma or dot
        const decimalSeparator = priceStr.includes(',') ? ',' : '.';
    
        // Split the price into whole and decimal parts
        let parts = priceStr.split(decimalSeparator);
    
        // If there are decimal parts, keep only the first two digits
        if (parts.length > 1) {
            parts[1] = parts[1].substring(0, 2); // Keep only the first two decimal digits
        } else {
            // If there are no decimal parts, add "00"
            parts[1] = '00';
        }
    
        // Format the whole number part with a thousand separator
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
        // Join the parts back together with the appropriate decimal separator
        let finalPrice = parts.join(decimalSeparator);
    
        // Ensure that the final price always has two decimal places
        if (!finalPrice.includes(decimalSeparator)) {
            finalPrice += decimalSeparator + "00"; // If there are no decimals, add ".00"
        } else if (parts[1].length === 1) {
            finalPrice += "0"; // If there is only one decimal, add another zero
        }
    
        return finalPrice;
    }

    useEffect(() => {
        if (currencyConversions) {
            var currencyPrice = currencyConversions[currency];
            var conversionPrice = currencyConversions[selectedCurrency];

            var convertedPriceData = (price / currencyPrice) * conversionPrice;
            let formattedPrice = formatPrice(convertedPriceData);

            setConvertedPrice(formattedPrice);
            setCurrencyCode(selectedCurrencyCode);
            
        } else {
            setConvertedPrice(price);
            setCurrencyCode(selectedCurrencyCode);
        }

    }, [currency, price, currencyConversions, selectedCurrency, selectedCurrencyCode]);
    
    return (
        <>
           {selectedCurrencyCode}{convertedPrice}
        </>
    );
};

export default CurrencyConverter;