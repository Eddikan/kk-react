import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Logo from '../Assets/images/kouture-konect-logo.png';
import '../Assets/styles/EmailConfirmation/style.css';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';

const initialUserData = Object.freeze({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const EmailConfirmation = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUserData);
  const [userLoading, setUserLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);
  const [formStatus, setFormStatus] = useState('standby');

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

  const currentUser = cookies.currentUser;
  const token = cookies.token;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;

  const getUser = async () => {
    return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
  };

  async function resendVerificationEmail(e) {
    setFormStatus('loading');
    axios.post(process.env.REACT_APP_API_ENDPOINT + 'resend/verification/' + currentUser + '?user_id=' + currentUser + '&token=' + token, {
      user_id: currentUser
    }).then((response) => {
      const success = response.data.status;
      if (success == 'Success') {
        toast.success('Email sent successfully!');
        setFormStatus("standby");
      } else {
        toast.error('An error occured. Please try again or contact the administrator.');
        setFormStatus("standby");
      }
    }).catch(() => {
      toast.error('An error occured. Please try again or contact the administrator.');
      setFormStatus("standby");
    });
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
          navigate("/questionnaire");
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
  }, [reloadCount]);

  return (
    <Layout>
      <section id='email-confirmation' className='d-flex justify-content-center flex-column py-5 px-2 vh-100'>
        <Container className='text-center'>
          <Row>
            <Col lg='12'>
              <img src={Logo} />
            </Col>
          </Row>
          <Row className='narrow-600 p-5  mt-5 text-dgray'>
            <Col lg='12'>
              <h1 className='pb-2'>Email Confirmation</h1>
              <p className='subtitle'>Thank you for signing up for Kouture Konect. Before we get started, we'll need to verify your email. Please check your email</p>
              <p className='login-with-email'>or</p>
              {formStatus != "standby" ?
                <Button className='btn-primary fs-16' variant='primary'>Sending...</Button>
                :
                <Button onClick={resendVerificationEmail} className='btn-primary fs-16' variant='primary'>Resend Email</Button>
              }
            </Col>
          </Row>
        </Container>
      </section>

    </Layout>
  );
};

export default EmailConfirmation;