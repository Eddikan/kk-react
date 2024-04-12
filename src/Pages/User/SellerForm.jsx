import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from 'Assets/images/kouture-konect-logo.png';
import 'Assets/styles/Questionnaire/style.css'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';

// Import each Questionnaires
import BecomeSellerForm from 'Components/CallToActions/SellerForm';

const initialUserData = Object.freeze({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const SellerForm = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUserData);
  const [userLoading, setUserLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);

  // Questionnaires
  const [step, setStep] = useState(2);
  const [questionnaire1Show, setQuestionnaire1Show] = useState(false);
  const [questionnaire2Show, setQuestionnaire2Show] = useState(false);
  const [questionnaire3Show, setQuestionnaire3Show] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn', 'userDetails', 'userRole', 'token']);

  const currentUser = cookies.currentUser;
  const signupType = cookies.signup_type;

  const getUser = async () => {
    return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
  };

  const reloadPage = (e) => {
    setReloadCount((prevReloadCount) => prevReloadCount + 1);
  };

  const hideAll = (e) => {
    if (signupType) {
      if (signupType == "designer") {
        setStep(4);
      } else if (signupType == "seller") {
        setStep(4);
      } else {
        setQuestionnaire1Show(false);
        setQuestionnaire2Show(false);
        setQuestionnaire3Show(false);
        setStep(e);
      }
    } else {
      setQuestionnaire1Show(false);
      setQuestionnaire2Show(false);
      setQuestionnaire3Show(false);
      setStep(e);
    }
  }

  useEffect(() => {
    // ComponentDidMount logic goes here
    // This will be executed after the component is mounted
    getUser().then(response => {
      const selectedUser = response.data.data;
      if (selectedUser) {
        setUser(selectedUser);
        setUserLoading(false);
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
        <Container className='q3 q2-no text-dgray'>
            <BecomeSellerForm currentUser={currentUser} user={user} onReloadPage={reloadPage} onHideAll={hideAll} step={step} />
        </Container>
    </Layout>
  );
};

export default SellerForm;