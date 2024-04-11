import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Countries from 'Utils/Countries';

const AddressStep = ({ user, currentUser, reload, token }) => {
    const [cookies, setCookie] = useCookies(['currentUser']);

    const [profileFormData, setProfileFormData] = useState('');
    const [formStatus, setFormStatus] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfileFormData({
            ...profileFormData,
            [name]: value
        });
    }

    async function submitProfile(e) {
        e.preventDefault();
        setFormStatus(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { ...profileFormData, profile_completeness: 50 }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const userData = data.user;
                const user_details = { currentUser: userData.id, id: userData.id, first_name: userData.first_name, last_name: userData.last_name, image: userData.image, email_verified_at: userData.email_verified_at }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
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
                        <Form.Label>Address Line 1</Form.Label>
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
                            <Form.Label>City</Form.Label>
                            <FormControl type='text' name='city' value={profileFormData.city} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>State/Region</Form.Label>
                            <FormControl type='text' name='province' value={profileFormData.province} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>Postal Code</Form.Label>
                            <FormControl type='number' name='postal_code' value={profileFormData.postal_code} className='mr-sm-2' onChange={handleChange} required placeholder='' />
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>Country</Form.Label>
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
                    <div className="text-right mt-0 mb-2">
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
