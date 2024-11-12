import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const AboutStep = ({ user, currentUser, reload, token }) => {
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

    async function submitProfile(e) {
        if (profileFormData.first_name === '' || profileFormData.first_name == null) {
            toast('First Name is required!', {
                icon: '⚠️',
            });
        } else if (profileFormData.last_name === '' || profileFormData.first_name == null) {
            toast('Last Name is required!', {
                icon: '⚠️',
            });
        } else if (profileFormData.gender === '' || profileFormData.gender == null) {
            toast('Gender is required!', {
                icon: '⚠️',
            });
        } else {
            e.preventDefault();
            setFormStatus(true);
            axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { ...profileFormData, about_complete: 1}).then((response) => {
                const success = response.data.status;
                if (success == 'Success') {
                    const data = response.data.data;
                    const userData = data.user;
                    const user_details = { currentUser: userData.id, id: userData.id, first_name: userData.first_name, last_name: userData.last_name, image: userData.image, email_verified_at: userData.email_verified_at, signup_type: userData.signup_type, email: userData.email, is_seller: userData.is_seller, is_designer: userData.is_designer, shop_completed: userData.shop_completed, profile_completeness: userData.profile_completeness, is_designer: userData.is_designer, is_seller: userData.is_seller  }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('aboutDone', "Yes", { path: '/' });
                    toast.success('Personal information updated successfully!');
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

    useEffect(() => {
        if (user) {
            setProfileFormData(user);
        }
    }, [user])

    return (
        <>
            <div className="edit-profile mt-3">
                    <Row>
                        <Col lg="6">
                            <Form.Group className='mb-3'>
                                <Form.Label>First Name<span className='text-danger'>*</span></Form.Label>
                                <FormControl type='text' name='first_name' value={profileFormData.first_name} className='mr-sm-2' onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col lg="6">
                            <Form.Group className='mb-3'>
                                <Form.Label>Last Name<span className='text-danger'>*</span></Form.Label>
                                <FormControl type='text' name='last_name' value={profileFormData.last_name} className='mr-sm-2' onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <Form.Group className='mb-3'>
                                <Form.Label>Date of Birth</Form.Label>
                                <FormControl type='date' name='date_of_birth' value={profileFormData.date_of_birth} className='mr-sm-2' onChange={handleChange} />
                            </Form.Group>
                        </Col>
                        <Col lg="3">
                            <Form.Label>Gender<span className='text-danger'>*</span></Form.Label>
                            <Row>
                                <Form.Group as={Col}>
                                    <Form.Check
                                        className="cursor-pointer"
                                        type="radio"
                                        label="Male"
                                        name="gender"
                                        value="Male"
                                        checked={profileFormData.gender === 'Male'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Check
                                        className="cursor-pointer"
                                        type="radio"
                                        label="Female"
                                        name="gender"
                                        value="Female"
                                        checked={profileFormData.gender === 'Female'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Row>
                        </Col>

                    </Row>
                    <Row>
                        <Col lg="12">
                            {/* <Form.Group className='mb-4'>
                                <Form.Label>Occupation</Form.Label>
                                <FormControl type='text' name='occupation' value={profileFormData.occupation} className='mr-sm-2' onChange={handleChange} placeholder='' />
                            </Form.Group> */}
                            <Form.Group className='mb-4'>
                                <Form.Label>Short Bio <span className='text-gray'>(title)</span></Form.Label>
                                <FormControl type='text' name='short_bio' value={profileFormData.short_bio} className='mr-sm-2' onChange={handleChange} placeholder='' />
                            </Form.Group>
                            <p className="text-muted ms-1 fs-12 mb-4">Your short bio is limited to 250 characters. ({250 - profileFormData.short_bio?.length} characters left)</p>
                            <Form.Group className='mb-3'>
                                <Form.Label>Long Bio <span className='text-gray'>(profile overview)</span></Form.Label>
                                <FormControl as="textarea"
                                    name="long_bio"
                                    rows={5} // You can adjust the number of rows as needed
                                    value={profileFormData.long_bio}
                                    placeholder=''
                                    onChange={handleChange} />
                            </Form.Group>
                            <div className="text-right mt-4 mb-2">
                                {formStatus ?
                                    <Button type='button' className="btn-save">Saving...</Button>
                                :
                                    <Button type='button' onClick={submitProfile} className="btn-save">Next</Button>
                                }
                            </div>
                        </Col>
                    </Row>
            </div>
        </>
    )
}

export default AboutStep;
