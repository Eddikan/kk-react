import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Logo from '../Assets/images/kouture-konect-logo.png';
import '../Assets/styles/EmailConfirmation/style.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import MailIcon from '../Assets/images/icons/email.png'

const initialUserData = Object.freeze({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
});

const EmailConfirmation = () => {
    const navigate = useNavigate();
    const { userCode } = useParams();
    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    const [user, setUser] = useState(initialUserData);
    const [userLoading, setUserLoading] = useState(true);
    const [reloadCount, setReloadCount] = useState(0);
    const [formStatus, setFormStatus] = useState('standby');
    const [signupType, setSignupType] = useState(query.get("type"));

    const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

    const currentUser = cookies.currentUser;
    const token = cookies.token;
    const isLoggedIn = cookies.isLoggedIn;
    const userDetails = cookies.userDetails;
    const userRole = cookies.userRole;

    const getUser = async () => {
        return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/'+userCode+'/details');
    };

    async function goToQuestionnaire(e) {
        navigate("/questionnaire");
    }

    useEffect(() => {
        // ComponentDidMount logic goes here
        // This will be executed after the component is mounted
        getUser().then(response => {
            const selectedUser = response.data.data;
            if (selectedUser) {
                setUser(selectedUser);
                setUserLoading(false);
                if (selectedUser.email_verified_at != "" && selectedUser.email_verified_at) {
                    setCookie('currentUser', JSON.stringify(selectedUser.id), { path: '/' });
                    setCookie('userRole', JSON.stringify(selectedUser.role), { path: '/' });
                    const user_details = { currentUser: selectedUser.id, id: selectedUser.id, first_name: selectedUser.first_name, last_name: selectedUser.last_name, image: selectedUser.image, email_verified_at: selectedUser.email_verified_at, signup_type: selectedUser.signup_type, email: selectedUser.email }
                    setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
                    setCookie('isLoggedIn', true, { path: '/' });
                    setCookie('token', selectedUser.token, { path: '/' });
                    setCookie('signup_type', selectedUser.signup_type, { path: '/' });
                    setCookie('completed_questionnaire', selectedUser.completed_questionnaire, { path: '/' });
                    setCookie('token', selectedUser.token, { path: '/' });
                    if (selectedUser.signup_type) {
                        setSignupType(selectedUser.signup_type);
                    }
                    if (selectedUser.designer) {
                        setCookie('currentUserDesigner', JSON.stringify(user.designer.id), { path: '/' });
                    }
                        if (selectedUser.seller) {
                        setCookie('currentUserSeller', JSON.stringify(user.seller.id), { path: '/' });
                    }
                } else {
                    const message = 'Please verify your email first!';
                    toast.error(message);
                    navigate('/');
                }
            } else {
                const message = 'There has been an error getting the user, please try again!';
                toast.error(message);
            }
        }).catch((error) => {
            const message = 'There has been an error getting the user, please try again!';
            toast.error(message);
        });

        return () => {
            // ComponentWillUnmount logic goes here (optional)
            // This will be executed before the component is unmounted
            //   console.log('Component is unmounted');
        };
    }, [reloadCount, currentUser]);

    return (
        <Layout>
            <section id='email-confirmation' className='d-flex justify-content-center flex-column py-5 px-2 vh-100'>
                <Container className='text-center'>
                    <Row>
                        <Col lg='12'>
                            <Link to="/">
                                <img src={MailIcon} />
                            </Link>
                        </Col>
                    </Row>
                    <Row className='narrow-600 p-5  pt-4 mt-2 text-dgray'>
                        <Col lg='12'>
                            <h1 className='pb-2'>Email Confirmed</h1>
                            <p className='subtitle'>Thank you for confirming your email!</p>
                            {signupType == "user_designer" ?
                                <Button href="/designers" className='btn-primary fs-16' variant='primary'>Proceed</Button>
                            : signupType == "user_fabric" ?    
                                <Button href="/fabrics" className='btn-primary fs-16' variant='primary'>Proceed</Button>
                            : signupType == "user_design" ?
                                <Button href="/designs" className='btn-primary fs-16' variant='primary'>Proceed</Button>
                            :
                                <Button href={`/questionnaire?type=${signupType}`} className='btn-primary fs-16' variant='primary'>Proceed</Button>
                            }
                        </Col>
                    </Row>
                </Container>
            </section>

        </Layout>
    );
};

export default EmailConfirmation;