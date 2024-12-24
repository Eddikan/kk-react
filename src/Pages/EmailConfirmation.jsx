import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const [user, setUser] = useState(initialUserData);
  const [userLoading, setUserLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);
  const [formStatus, setFormStatus] = useState('standby');

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

  const currentUser = cookies.currentUser;
  const current_user_id = cookies.currentUser;
  const token = cookies.token;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;

  const getUser = async () => {
    return await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token);
  };
  useEffect(() =>{
    if(!currentUser){
      navigate("/login");
    }
  })
  async function resendVerificationEmail(e) {
    setFormStatus('loading');
    axios.post(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'resend/verification/' + currentUser + '?current_user_id=' + current_user_id + '&token=' + token, {
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
          const user_details = {currentUser: selectedUser.id, id: selectedUser.id, first_name: selectedUser.first_name, last_name: selectedUser.last_name, image: selectedUser.image, email_verified_at: selectedUser.email_verified_at}
          setCookie('userDetails', JSON.stringify(user_details), { path: '/' });
          setCookie('signup_type', selectedUser.signup_type, { path: '/' });
          if (selectedUser.signup_type == "user_designer") {
            navigate("/designers");
          } else if (selectedUser.signup_type == "user_fabric") {
            navigate("/fabrics");
          } else if (selectedUser.signup_type == "user_design") {
            navigate("/designs");
          } else {
            // navigate("/questionnaire");
            navigate("/sign-up/preferences");
          }
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
              <img src={MailIcon} className="mail-icon"/>
            </Col>
          </Row>
          <Row className='narrow-750 p-5  pt-4 mt-2 text-dgray'>
            <Col lg='12'>
              <h1 className='pb-2'>Email Confirmation</h1>
              <p className='subtitle mb-0'>Thank you for signing up for Kouture Konect. Before we get</p>
              <p className='fs-16'>started, we'll need to verify your email. Please check your email</p>
              {/* <p className='login-with-email'>or</p> */}
              {formStatus != "standby" ?
                <Button className='btn-primary mt-4' variant='primary'>Sending...</Button>
                :
                <Button onClick={resendVerificationEmail} className='btn-primary fs-16 mt-4' variant='primary'>Resend Email</Button>
              }
            </Col>
          </Row>
        </Container>
      </section>

    </Layout>
  );
};

export default EmailConfirmation;