import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Logo from '../Assets/images/kouture-konect-logo.png';
import '../Assets/styles/Questionnaire/style.css'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import Form from 'react-bootstrap/Form';

// Import each Questionnaires
import Questionnaire1 from 'Components/Questionnaire/Questionnaire1';
import Questionnaire2 from 'Components/Questionnaire/Questionnaire2';
import Questionnaire3 from 'Components/Questionnaire/Questionnaire3';

const initialUserData = Object.freeze({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const Questionnaire = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(initialUserData);
  const [userLoading, setUserLoading] = useState(true);
  const [reloadCount, setReloadCount] = useState(0);

  // Questionnaires
  const [step, setStep] = useState(1);
  const [questionnaire1Show, setQuestionnaire1Show] = useState(false);
  const [questionnaire2Show, setQuestionnaire2Show] = useState(false);
  const [questionnaire3Show, setQuestionnaire3Show] = useState(false);
  const [questionnaire4Show, setQuestionnaire4Show] = useState(false);
  const [questionnaire5Show, setQuestionnaire5Show] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(['currentUser', 'isLoggedIn','userDetails','userRole', 'token']);

  const currentUser = cookies.currentUser;
  const isLoggedIn = cookies.isLoggedIn;
  const userDetails = cookies.userDetails;
  const userRole = cookies.userRole;
  const token = cookies.token;

  const getUser = async () => {
    return await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
  };

  const reloadPage = (e) => {
    setReloadCount((prevReloadCount) => prevReloadCount + 1);
  };

  const skip = (e) => {
    setStep(e);
  };

  const hideAll = (e) => {
    console.log(e);
    setQuestionnaire1Show(false);
    setQuestionnaire2Show(false);
    setQuestionnaire3Show(false);
    setStep(e);
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
      <section id='questionnaire' className='d-flex justify-content-center flex-column py-5 px-2'>
        {step == 4 ?
          null
          :
          <>
            <Container className='text-center'>
              <Row>
                <Col lg='12'>
                  <img src={Logo}/>  
                </Col>
              </Row>
            </Container>
          </>
        }
        {step == 1 && !questionnaire1Show ?
          <>
            <Container className='q1 narrow-600 py-5 px-3 mt-5 text-dgray'>
              <Row>
                <Col lg='12' className='text-center'>
                  <h2 className='form-title pb-2'>Are you looking to shop for ready-to-wear, couture, or fabrics?</h2>
                </Col>
              </Row>
              <Row className='narrow-400 mt-3'>
                <Col lg='6' className='text-right'>
                  <Button className='btn-outline' onClick={function() { setStep((prevStep) => prevStep + 1); }}>No</Button>
                </Col>
                <Col lg='6' className='text-left'>
                  <Button className='btn-primary' onClick={function() { setQuestionnaire1Show((prevStatus) => true); }} >Yes</Button>
                </Col>
              </Row>
            </Container>
          </>
          :
          null
        }
        {step == 1 && questionnaire1Show ?
          <Questionnaire1 currentUser={currentUser} user={user} onReloadPage={reloadPage} onHideAll={hideAll} step={step} />
          :
          null
        }
        {step == 2 && !questionnaire2Show  ?
          <>
            <Container className='q1 narrow-600 py-5 px-3 mt-5 text-dgray'>
              <Row>
                <Col lg='12' className='text-center'>
                  <h2 className='form-title pb-2'>Are you a fashion designer?</h2>
                </Col>
              </Row>
              <Row className='narrow-400 mt-3'>
                <Col lg='6' className='text-right'>
                  <Button className='btn-outline' onClick={function() { setStep((prevStep) => prevStep + 1); }}>No</Button>
                </Col>
                <Col lg='6' className='text-left'>
                  <Button className='btn-primary' onClick={function() { setQuestionnaire2Show((prevStatus) => true); }} >Yes</Button>
                </Col>
              </Row>
            </Container>
          </>
          :
          null
        }
        {step == 2 && questionnaire2Show ?
          <Questionnaire2 currentUser={currentUser} user={user} onReloadPage={reloadPage} onHideAll={hideAll} step={step} />
          :
          null
        }
        
        {step == 3 && !questionnaire3Show  ?
        <>
          <Container className='q3 q2-no narrow-600 py-5 px-3 mt-5 text-dgray'>
            <Row>
              <Col lg='12' className='text-center'>
                <h2 className='form-title pb-2'>Do you sell fabrics?</h2>
              </Col>
            </Row>
            <Row className='narrow-400 mt-3'>
              <Col lg='6' className='text-right'>
                <Button className='btn-outline' onClick={function() { setStep((prevStep) => prevStep + 1); }}>No</Button>
              </Col>
              <Col lg='6' className='text-left'>
                <Button className='btn-primary' onClick={function() { setQuestionnaire3Show((prevStatus) => true); }} >Yes</Button>
              </Col>
            </Row>
          </Container>
        </>
          :
          null
        }
        {step == 3 && questionnaire3Show ?
          <Questionnaire3 currentUser={currentUser} user={user} onReloadPage={reloadPage} onHideAll={hideAll} step={step} />
          :
          null
        }

        {step == 4 ?
          <>
            <Container className='q1 narrow-850 mt-5 px-0 d-flex'>
              <div className='step4-first-cont p-5 '>
                <Row>
                  <Col lg='12'>
                    <h2 className='form-title pb-2'>Welcome to Kouture Konect</h2>
                    <p className="mb-3">
                      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed 
                      diam nonumy eirmod tempor invidunt ut aliquyam erat voluptua.
                    </p>
                    <div className='d-flex align-items-center mb-3'>
                      <div className='circle-number'>1</div>
                      &nbsp;
                      <span>Verify your email address! You won't be able to share your work then</span>
                    </div>
                    <div className='d-flex align-items-center mb-4'>
                      <div className='circle-number'>2</div>
                      &nbsp;
                      <span>Upload your work, fill out your profile, and set your work experience</span>
                    </div>
                    <Link to="/user/profile">
                      <Button className='btn-primary mt-2' type="button">
                        Take Me to My Profile
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </div>
              <div className='step4-second-cont '></div>
            </Container>
          </>
          :
          null
        }
        
      </section>
      
    </Layout>
  );
};

export default Questionnaire;