import { useCookies } from 'react-cookie';

const CurrencyConverter = (price, currency, cookies) => {
    // Fetch cookies directly from the parameter
    const currencyConversions = cookies.currencyConversions || {};
    const selectedCurrency = cookies.selectedCurrency || cookies.userCurrency || 'USD';
    const selectedCurrencyCode = cookies.selectedCurrencyCode || cookies.userCurrencyCode || '$';

    // const formatPrice = (price) => {
    //     let priceStr = price.toString();
    //     const decimalSeparator = priceStr.includes(',') ? ',' : '.';
    //     let parts = priceStr.split(decimalSeparator);

    //     if (parts.length > 1) {
    //         parts[1] = parts[1].substring(0, 2); // Keep only the first two decimal digits
    //     } else {
    //         parts[1] = '00'; // If there are no decimal parts, add "00"
    //     }

    //     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        
    //     let finalPrice = parts.join(decimalSeparator);

    //     if (!finalPrice.includes(decimalSeparator)) {
    //         finalPrice += decimalSeparator + "00"; // If there are no decimals, add ".00"
    //     } else if (parts[1].length === 1) {
    //         finalPrice += "0"; // If there is only one decimal, add another zero
    //     }

    //     return finalPrice;
    // };
    

    const formatPrice = (price) => {
        // Convert the price to a fixed two decimal string
        let priceStr = parseFloat(price).toFixed(2);
    
        // Use a period as the default decimal separator
        const decimalSeparator = '.';
        let parts = priceStr.split(decimalSeparator);
    
        // Add thousands separator to the integer part
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    
        // Rejoin the integer and decimal parts
        let finalPrice = parts.join(decimalSeparator);
    
        return finalPrice;
    };

    let convertedPrice = price; // Default to original price if conversions are not available

    if (currencyConversions && (selectedCurrency != currency)) {
        const currencyPrice = currencyConversions[currency] || 1; // Fallback to 1 if not found
        const conversionPrice = currencyConversions[selectedCurrency] || 1; // Fallback to 1 if not found

        // Calculate the converted price
        convertedPrice = (price / currencyPrice) * conversionPrice;
    }

    return {
        currency_code: selectedCurrencyCode,
        price: formatPrice(convertedPrice),
        price_raw: convertedPrice
    };
};

export default CurrencyConverter;
