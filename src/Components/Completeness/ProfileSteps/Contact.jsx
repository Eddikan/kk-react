import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ContactStep = ({ user, currentUser, reload, token }) => {
    const [cookies, setCookie] = useCookies(['currentUser', 'aboutDone', 'addressDone', 'contactDone', 'socialDone']);

    const [profileFormData, setProfileFormData] = useState('');
    const [formStatus, setFormStatus] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setProfileFormData({
            ...profileFormData,
            [name]: value
        });
    }

    const handleChangePhone = (e) => {
        setProfileFormData({
            ...profileFormData,
            phone_number: e
        });
    };

    async function submitProfile(e) {
        if (profileFormData.phone_number === '' || profileFormData.phone_number == null) {
            toast('Phone Number is required!', {
                icon: '⚠️',
            });
        } else {
            e.preventDefault();
            setFormStatus(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { ...profileFormData, contact_complete: 1 }).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    const userData = data.user;
                    setCookie('contactDone', "Yes", { path: '/' });
                    toast.success('Contact information added successfully!');
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
                setCookie('contactDone', "No", { path: '/' });
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
            <div className="edit-contact mt-3">
                <Col lg="12">
                    <Form.Group className='mb-4'>
                        <Form.Label>Website</Form.Label>
                        <FormControl type='text' name='website' value={profileFormData.website} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                </Col>
                <Row>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>Phone Number<span className='text-danger'>*</span></Form.Label>
                            {/* <FormControl type='number' name='phone_number' value={profileFormData.phone_number} className='mr-sm-2' onChange={handleChange} placeholder='' /> */}
                            <PhoneInput
                                enableSearch={true}
                                country={'us'}
                                value={profileFormData.phone_number || ""}
                                onChange={handleChangePhone}
                                // placeholder='Phone*'
                                containerStyle={{
                                    width: "100%",
                                }}
                                inputStyle={{
                                    backgroundColor: 'transparent',
                                    width: "100%",
                                    boxShadow: "none",
                                    padding: '7px 15px',
                                    paddingLeft: '50px',
                                    fontSize: '14px',
                                    fontFamily: 'Poppins',
                                    border: '1px solid #f3f3f3',
                                    minHeight: '40px'
                                }}
                                buttonStyle={{ 
                                    backgroundColor: 'transparent',
                                    borderRight: 'none',
                                    border: '1px solid #f3f3f3'
                                }}
                                searchStyle={{ 
                                    width: "80%"
                                }}
                                countryListStyle={{ 
                                    width: "225px"
                                }}
                            />
                        </Form.Group>
                    </Col>
                    <Col lg="6">
                        <Form.Group className='mb-4'>
                            <Form.Label>Secondary Email</Form.Label>
                            <FormControl type='email' name='secondary_email_address' value={profileFormData.secondary_email_address} className='mr-sm-2' onChange={handleChange} placeholder='' />
                        </Form.Group>
                    </Col>
                </Row>
                <div className="text-right mt-0 mb-2">
                    <Button type='button' onClick={submitBack} className="btn-back mx-2">Back</Button>
                    {formStatus ?
                        <Button type='button' className="btn-save">Saving...</Button>
                        :
                        <Button type='button' onClick={submitProfile} className="btn-save">Next</Button>
                    }
                </div>
            </div>
        </>
    )
}

export default ContactStep;
