import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css';
import getUserData from 'Utils/GetUserData';
import { useCookies } from 'react-cookie';
import toast from 'react-hot-toast';
import ImageDragAndDrop from 'Components/Shared/ImageDragAndDrop';
import GoBack from 'Components/Shared/GoBack';

const initialUserData = Object.freeze({
    is_designer: 0,
    is_tailor: 0,
    is_seller: 0,
    email: '',
    short_bio: '',
    long_bio: '',
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    province: '',
    postal_code: '',
    country: '',
    website: '',
    phone_number: '',
    secondary_email_address: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedIn: '',
});

const AddPortfolio = () => {
    const [user, setUser] = useState(initialUserData);
    const [reloadCount, setReloadCount] = useState(0);
    const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);

    const currentUser = cookies.currentUser;

    const handleImagesChange = (images) => {
        // Use the images as needed in the parent component (e.g., for uploading)
        console.log('Images in parent:', images);
    };

    const fetchData = async (e) => {
        try {
          const userData = await getUserData(e);
          if (userData.id) {
            setUser(userData);
          } else {
            toast.error('User does not exist!');
          }
          // Update state or perform other logic with userData
        } catch (error) {
            toast.error('User does not exist!');
          // Handle the error, if needed
        }
    };

    useEffect(() => {
        fetchData(currentUser);
    }, [reloadCount]);

    return (
        <Layout>
            <section id='profile' className='py-5 px-2'>
                <Container>
                    <Row>
                        <Col lg="8" className='mb-3'>
                            <h2 className='fs-30 mb-2'>Add Design</h2>
                        </Col>
                        <Col lg="4" className='mb-3 text-right'>
                            <GoBack fallBack="/user/profile" />
                        </Col>
                        <Col lg='12'>
                            <ImageDragAndDrop onImagesChange={handleImagesChange} />
                        </Col>
                    </Row>
                </Container>
            </section>

        </Layout>
    );
};

export default AddPortfolio;