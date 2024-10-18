import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';
import CountryCodes from 'Utils/CountryCodes';
import CountryData from 'Utils/CountryData';

const AddressStep = ({ user, currentUser, reload, token }) => {
    const [cookies, setCookie] = useCookies(['currentUser', 'aboutDone', 'addressDone', 'contactDone', 'socialDone']);

    const [profileFormData, setProfileFormData] = useState('');
    const [formStatus, setFormStatus] = useState(false);

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

    const handleChange = (e) => {
        const { name, value } = e.target;

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
                [name]: value,
                currency: currency,
                currency_code: currencyCode,
                country_code: country_code ?? "US"
            });
        } else {
            setProfileFormData({
                ...profileFormData,
                [name]: value
            });
        }
    }

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
        } else if (profileFormData.province_code === '' || profileFormData.province_code == null) {
            toast('State/Province Code is required!', {
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
            
            setFormStatus(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { ...profileFormData, address_complete: 1 }).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    const userData = data.user;
                    setCookie('addressDone', "Yes", { path: '/' });
                    toast.success('Address details updated successfully!');
                    reload();
                } else {
                    const errors = response.data.errors;
                }
                setFormStatus(false);
            }).catch(() => {
                setFormStatus(false);
                toast.error('Something went wrong, please contact the administrator!');
            });
        }
    }

    async function submitBack(e) {
        e.preventDefault();
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token).then((response) => {
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
    }, [user])

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
                    <Col lg="12">
                        <Form.Group className='mb-4'>
                            <Form.Label>Country<span className='text-danger'>*</span></Form.Label>
                            {/* <FormControl type='text' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required placeholder='' /> */}
                            <Form.Control as='select' name='country' value={profileFormData.country} className='mr-sm-2' onChange={handleChange} required>
                                <option value=''>Select Country</option>
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
                            <FormControl type='text' name='province' value={profileFormData.province} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>State/Province Code<span className='text-danger'>*</span></Form.Label>
                            <FormControl type='text' name='province_code' value={profileFormData.province_code} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>City<span className='text-danger'>*</span></Form.Label>
                            <FormControl type='text' name='city' value={profileFormData.city} className='mr-sm-2' onChange={handleChange} required placeholder='' />
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
                        {formStatus ?
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
