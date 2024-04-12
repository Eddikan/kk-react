import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ContactStep = ({ user, currentUser, reload, token }) => {
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
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { ...profileFormData, profile_completeness: 75 }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const userData = data.user;
                const user_details = { currentUser: userData.id, id: userData.id, first_name: userData.first_name, last_name: userData.last_name, image: userData.image, email_verified_at: userData.email_verified_at }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
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

    async function submitBack(e) {
        e.preventDefault();
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { profile_completeness: 25 }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                reload();
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
                            <Form.Label>Phone Number</Form.Label>
                            <FormControl type='number' name='phone_number' value={profileFormData.phone_number} className='mr-sm-2' onChange={handleChange} placeholder='' />
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
