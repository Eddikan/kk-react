import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Jackiepogi from '../Components/Pages/jackiepogii/Jackiepogi'
import '../Assets/styles/Jackie/style.css'
import Axios from 'axios';

const Jackie = () => {


    const [count, setCount] = useState(0);

    const addCount = (e) => {
        setCount(count + e)
    }
    const subtractCount = (e) => {
        setCount(count - e)
    }
    
    return (
        <Layout>
            <Container id="your-container-id" class="your-container-class">
                <Row>
                    <Col md="12">
                        <h1>Jackie</h1>

                        <h2 className={
                            count % 2 === 0 ?
                                'even'
                                :
                                'odd'
                        }
                        >  {count}</h2>
                        {/* <Jackiepogi peoplecount = {count} /> */}
                        {/* <Button className="me-2" variant="primary" onClick={addCount}>ADD</Button>
                        <Button className="me-2" variant="primary" onClick={subtractCount}>SUBTRACT</Button> */}
                        <Jackiepogi onAddCount={(e) => addCount(e)} onSubtractCount={(e) => subtractCount(e)} />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default Jackie;