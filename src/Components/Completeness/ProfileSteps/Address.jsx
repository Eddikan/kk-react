import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';
import CountryCodes from 'Utils/CountryCodes';
import CountryData from 'Utils/CountryData';

const initialLatLon = Object.freeze({
    latitude: 0,
    longitude: 0,
});

const AddressStep = ({ user, currentUser, reload, token }) => {
    const [cookies, setCookie] = useCookies(['currentUser', 'aboutDone', 'addressDone', 'contactDone', 'socialDone']);

    const [profileFormData, setProfileFormData] = useState('');
    const [profileFormLoading, setProfileFormLoading] = useState(false);
    const [errors, setErrors] = useState();

    // Locations
    const [cities, setCities] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [coordinates, setCoordinates] = useState(initialLatLon);
    const [emptyCities, setEmptyCities] = useState(false);

    const [provincesLoading, setProvincesLoading] = useState(false);
    const [citiesLoading, setCitiesLoading] = useState(false);

    const current_user_id = cookies.currentUser;

    const getCountryCode = (countryName) => {
        // Find the country code based on the country name
        const entries = Object.entries(CountryCodes);
        for (const [code, name] of entries) {
            if (name.toLowerCase() === countryName.toLowerCase()) {
                return code; // Return the corresponding country code
            }
        }
        return null; // Return null if no match is found
    };

    const getCountryStates = async (requestData) => {
        try {
            setProvincesLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_LOCATION_API_ENDPOINT + 'countries/states',
                requestData, // JSON body with country
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure it's sending as JSON
                    },
                }
            );

            const { error, data } = response.data;

            if (!error) {
                setProvinces(data.states); // Assuming the response has the states in `data.states`
                setProvincesLoading(false);
            } else {
                const errors = response.data.errors;
                if (errors) {
                    setErrors(errors);
                    toast.error('There has been an error getting the states, please try again!');
                } else {
                    toast.error('There has been an error getting the states, please try again!');
                }
                setProvincesLoading(false);
            }
        } catch (err) {
            toast.error('There has been an error getting the states, please try again!');
            setProvincesLoading(false);
        }
    };

    const getStateCities = async (requestData) => {
        try {
            setCitiesLoading(true);
            const response = await axios.post(
                process.env.REACT_APP_LOCATION_API_ENDPOINT + 'countries/state/cities',
                requestData, // JSON body with country and state
                {
                    headers: {
                        'Content-Type': 'application/json', // Ensure it's sending as JSON
                    },
                }
            );

            const { error, data } = response.data;

            if (!error) {
                setCities(data); // Assuming the response has the cities in `data`
                setCitiesLoading(false);
                if (data && data.length < 1) {
                    setEmptyCities(true);
                } else {
                    setEmptyCities(false);
                }
            } else {
                const errors = response.data.errors;
                if (errors) {
                    setErrors(errors);
                    toast.error('There has been an error getting the cities, please try again!');
                } else {
                    toast.error('There has been an error getting the cities, please try again!');
                }
                setCitiesLoading(false);
            }
        } catch (err) {
            toast.error('There has been an error getting the cities, please try again!');
            setCitiesLoading(false);
        }
    };

    const getCoordinates = async (requestData) => {
        const API_KEY = '7ba22fb46e866c41cd6bd744126fa733'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${requestData}&appid=${API_KEY}`;
        setProfileFormLoading(true);
        try {
            const response = await axios.get(url);
            const { lat, lon } = response.data.coord; // Extracting latitude and longitude
            if (response.status == 200) {
                setCoordinates({
                    ...coordinates,
                    latitude: lat,
                    longitude: lon,
                });
            } else {
                toast.error('Failed to fetch coordinates. Please check the city name and try again.');
            }
            setProfileFormLoading(false);
            
        } catch (error) {
            toast.error('Failed to fetch coordinates. Please check the city name and try again.');
            console.error(error);
            setProfileFormLoading(false);
        }
    };

    const handleChange = (e) => {
        var { name, value } = e.target;

        if (name == "country") {
            const country = Object.values(CountryData).find(country => country.name === value);
            let currency = 'USD';
            let currencyCode = '$';
            let country_code = 'US';

            if (country) {
                currency = country.currency;
                currencyCode = country.currencyCode;
            }

            if (value && value != "") {
                country_code = getCountryCode(value);
            }

            setProfileFormData({
                ...profileFormData,
                [e.target.name]: e.target.value,
                currency: currency,
                currency_code: currencyCode,
                country_code: country_code ?? "US",
                province: "",
                province_code: "",
                city: "",
            });
        } else if (name == "province") {
            const selectedProvince = e.target.selectedOptions[0];
            const provinceCode = selectedProvince.getAttribute('data-province-code');

            setProfileFormData({
                ...profileFormData,
                [e.target.name]: e.target.value,
                province_code: provinceCode,
                city: "",
            });
        } else {
            setProfileFormData({
                ...profileFormData,
                [e.target.name]: e.target.value,
            });
        }
    };

    async function submitProfile(e) {
        if (profileFormData.address_line_1 === '' || profileFormData.address_line_1 == null) {
            toast('Address Line 1 is required!', {
                icon: '⚠️',
            });
        } else if (profileFormData.country === '' || profileFormData.country == null) {
            toast('Country is required!', {
                icon: '⚠️',
            });
        } else if (profileFormData.province === '' || profileFormData.province == null) {
            toast('State/Province is required!', {
                icon: '⚠️',
            });
        } else if (profileFormData.city === '' || profileFormData.city == null) {
            toast('City is required!', {
                icon: '⚠️',
            });
        } else if (profileFormData.postal_code === '' || profileFormData.postal_code == null) {
            toast('Postal Code is required!', {
                icon: '⚠️',
            });
        } else {
            e.preventDefault();
            
            setProfileFormLoading(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token, { ...profileFormData, address_complete: 1, latitude: coordinates.latitude, longitude: coordinates.longitude }).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    const user = data.user;

                    setCookie('userCurrency', JSON.stringify(user.currency ?? 'USD'), { path: '/' });
                    setCookie('userCurrencyCode', JSON.stringify(user.currency_code ?? '$'), { path: '/' });

                    setCookie('addressDone', "Yes", { path: '/' });
                    toast.success('Address details updated successfully!');
                    reload();
                } else {
                    const errors = response.data.errors;
                }
                setProfileFormLoading(false);
            }).catch(() => {
                setProfileFormLoading(false);
                toast.error('Something went wrong, please contact the administrator!');
            });
        }
    }

    async function submitBack(e) {
        e.preventDefault();
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                reload();
                setCookie('addressDone', "No", { path: '/' });
                setCookie('aboutDone', "No", { path: '/' });
            } else {
                const errors = response.data.errors;
            }
        }).catch(() => {
            toast.error('Something went wrong, please contact the administrator!');
        });
    }

    useEffect(() => {
        if (user) {
            setProfileFormData(user);
        }
    }, [user]);

    useEffect(() => {
        var userCountry = profileFormData.country;

        if (userCountry && userCountry != "") {
            var data = {
                country: userCountry
            };
            setProvinces([]);
            setCities([]);

            getCountryStates(data);
        }
    }, [profileFormData.country]);

    useEffect(() => {
        var userCountry = profileFormData.country;
        var userProvince = profileFormData.province;

        if (userCountry && userCountry != "" && userProvince && userProvince != "") {
            var data = {
                country: userCountry,
                state: userProvince
            };
            setCities([]);

            getStateCities(data);
        }
    }, [profileFormData.country, profileFormData.province]);

    useEffect(() => {
        var userCity = profileFormData.city;

        if (userCity && userCity != "") {
            var data = userCity;
            getCoordinates(data);
        }
    }, [profileFormData.city]);


    return (
        <>
            <div className='edit-address mt-3'>
                <Col lg="12">
                    <Form.Group className='mb-4'>
                        <Form.Label>Address Line 1<span className='text-danger'>*</span></Form.Label>
                        <FormControl type='text' name='address_line_1' value={profileFormData.address_line_1} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Label>Address Line 2</Form.Label>
                        <FormControl type='text' name='address_line_2' value={profileFormData.address_line_2} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                </Col>
                <Row>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>Country<span className='text-danger'>*</span></Form.Label>
                            <Form.Control as='select' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required>
                                <option value='' disabled>Select Country</option>
                                {Countries.map((country, index) => (
                                    <option key={country + "-" + index} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>State/Province<span className='text-danger'>*</span></Form.Label>
                            {provincesLoading ?
                                <>
                                    <Form.Control as='select' name='province' value="" className='mr-sm-2' disabled required>
                                        <option value='' selected>Loading...</option>
                                    </Form.Control>
                                </>
                                :
                                <>
                                    {profileFormData.country && provinces && provinces.length > 0 ?
                                        <Form.Control as='select' name='province' value={profileFormData.province} className='mr-sm-2' onChange={handleChange} required>
                                            <option value='' disabled>Select Province</option>
                                            {provinces.map((province, index) => {
                                                if (province.name != "American Samoa") {
                                                    return (
                                                        <option key={province.name + "-" + index} value={province.name} data-province-code={province.state_code}>
                                                            {province.name}
                                                        </option>
                                                    )
                                                }
                                            })}
                                        </Form.Control>
                                        :
                                        <Form.Control as='select' name='province' value="" className='mr-sm-2' disabled required>
                                            <option value='' selected>Please select country first</option>
                                        </Form.Control>
                                    }
                                </>
                            }
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>City<span className='text-danger'>*</span></Form.Label>
                            {citiesLoading ?
                            <>
                                <Form.Control as='select' name='city' value="" className='mr-sm-2' disabled required>
                                    <option value='' selected>Loading...</option>
                                </Form.Control>
                            </>
                            :
                            <>
                                {emptyCities ?
                                    <>
                                        <FormControl
                                            type="text"
                                            name="city"
                                            className='mr-sm-2'
                                            value={profileFormData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </>
                                    :
                                    <>
                                        {profileFormData.province && cities && cities.length > 0 ?
                                            <Form.Control as='select' name='city' value={profileFormData.city} className='mr-sm-2' onChange={handleChange} required>
                                                <option value='' disabled>Select City</option>
                                                {cities.map((city, index) => (
                                                    <option key={city + "-" + index} value={cities.name}>
                                                        {city}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            :
                                            <Form.Control as='select' name='city' value="" className='mr-sm-2' disabled required>
                                                <option value='' selected>Please select a province first</option>
                                            </Form.Control>
                                        }
                                    </>
                                }
                                
                            </>
                        }
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>Postal Code<span className='text-danger'>*</span></Form.Label>
                            <FormControl type='number' name='postal_code' value={profileFormData.postal_code} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                        </Form.Group>
                    </Col>
                    <div className="text-right mt-0 mb-2">
                        <Button type='button' onClick={submitBack} className="btn-back mx-2">Back</Button>
                        {profileFormLoading ?
                            <Button type='button' className="btn-save">Saving...</Button>
                            :
                            <Button type='button' onClick={submitProfile} className="btn-save">Next</Button>
                        }
                    </div>
                </Row>
            </div>
        </>
    )
}

export default AddressStep;
