import React, { useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { countryCodeToName } from 'Utils/CountryCodes';

const CustomCountrySelect = (props) => {
    const className = props.className;
    const [selected, setSelected] = useState('PH'); // Default selected country

    const onSelect = (code) => {
        setSelected(code);
    };

    return (
        <div>
            <ReactFlagsSelect
                selected={selected}
                onSelect={onSelect}
                countries={Object.keys(countryCodeToName)}
                customLabels={countryCodeToName}
                placeholder="Select a country"
            />
            <p>Selected Country: {countryCodeToName[selected]}</p>
        </div>
    );
};

export default CustomCountrySelect;
