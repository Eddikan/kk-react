import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/User/Profile/style.css'

const Profile = () => {
    const [portfolioShow, setPortfolioShow] = useState(false);
    const [aboutShow, setAboutShow] = useState(true);

    const hidePortfolio = (e) => {
        setPortfolioShow(true);
    }

  return (
    <Layout>
      <section id='profile' className='py-5 px-2'>
        <Container>
          <Row>
            <Col lg="12">
                <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${aboutShow ? 'fw-600' : ''}`} onClick={function() {setAboutShow(true); setPortfolioShow(false); }}>About</span>
                <span className={`text-black cursor-pointer me-5 mb-3 fs-16 ${portfolioShow ? 'fw-600' : ''}`} onClick={function() {setAboutShow(false); hidePortfolio(true); }}>Portfolio</span>
                <hr className='mt-2' />
            </Col>
        </Row>
        {aboutShow ?
            <div id="about-portfolio">
                <Row>
                    <Col lg="6">
                        <p className="fw-600 mb-2">Title</p>
                        <p className="mb-4">
                            Lorem ipsum Dolor sit amet
                        </p>
                        <p className="fw-600 mb-2">Long Bio</p>
                        <p className="mb-5">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                    </Col>
                    <Col lg="6">
                        
                    </Col>
                </Row>
            </div>
            :
            null
        }
        {portfolioShow ?
            <div id="profile-portfolio">
                This is portfolio
            </div>
            :
            null
        }
        </Container>
      </section>
      
    </Layout>
  );
};

export default Profile;