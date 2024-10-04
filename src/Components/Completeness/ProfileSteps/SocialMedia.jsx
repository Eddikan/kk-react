import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Form, FormControl } from 'react-bootstrap';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const SocialMediaStep = ({ user, currentUser, reload, token }) => {
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
        e.preventDefault();
        setFormStatus(true);
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token, { ...profileFormData }).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                const data = response.data.data;
                const userData = data.user;
                const user_details = { currentUser: userData.id, id: userData.id, first_name: userData.first_name, last_name: userData.last_name, image: userData.image, email_verified_at: userData.email_verified_at, signup_type: userData.signup_type, email: userData.email, is_seller: userData.is_seller, is_designer: userData.is_designer, shop_completed: userData.shop_completed, profile_completeness: userData.profile_completeness  }
                setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                setCookie('socialDone', "Yes", { path: '/' });
                toast.success('Social media links updated successfully!');
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
        axios.put(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?user_id=' + currentUser + '&token=' + token).then((response) => {
            const success = response.data.status;
            if (success == 'Success') {
                reload();
                setCookie('contactDone', "No", { path: '/' });
                setCookie('socialDone', "No", { path: '/' });
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
            <div className="edit-social-media mt-3">
                <Col lg="12">
                    <Form.Group className='mb-4'>
                        <Form.Label>Facebook</Form.Label>
                        <FormControl type='text' name='facebook' value={profileFormData.facebook} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Label>Twitter</Form.Label>
                        <FormControl type='text' name='twitter' value={profileFormData.twitter} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Label>Instagram</Form.Label>
                        <FormControl type='text' name='instagram' value={profileFormData.instagram} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Label>LinkedIn</Form.Label>
                        <FormControl type='text' name='linkedin' value={profileFormData.linkedin} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Label>Pinterest</Form.Label>
                        <FormControl type='text' name='pinterest' value={profileFormData.pinterest} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                    <Form.Group className='mb-4'>
                        <Form.Label>Behance</Form.Label>
                        <FormControl type='text' name='behance' value={profileFormData.behance} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group>
                    {/* <Form.Group className='mb-4'>
                        <Form.Label>YouTube</Form.Label>
                        <FormControl type='text' name='youtube' value={profileFormData.youtube} className='mr-sm-2' onChange={handleChange} placeholder='' />
                    </Form.Group> */}
                    <div className="text-right mt-4 mb-2">
                        <Button type='button' onClick={submitBack} className="btn-back mx-2">Back</Button>
                        {formStatus ?
                            <Button type='button' className="btn-save">Saving...</Button>
                            :
                            <Button type='button' onClick={submitProfile} className="btn-save">Next</Button>
                        }
                    </div>
                </Col>
            </div>
        </>
    )
}

export default SocialMediaStep;