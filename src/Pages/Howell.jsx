import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Home/style.css'
import 'Assets/styles/Howell/style.css'
import HowellComponent from 'Components/Pages/HowellComponent/HowellComponent'

const Howell = () => {

    const [count, setCount] = useState(0);
    const addCount = (e) => {
        setCount(count  + e)
    }
    const subtractCount = (e) => {
        setCount(count - e)
    }


    // useEffect() => {
    //     return () => {
            
    //     };
    // }


  return (
    <Layout>
      <Container id="your-container-id" class="your-container-class">
        <Row>
          <Col md="12">
            <h1>Howell</h1>
            <h2
                className = {
                count % 2 === 0 ?
                'even'
                    :
                'odd'
            }
            >  {count}</h2>
            {/* <HowellComponent personCount={count} /> */}
            <HowellComponent onpeopleCount={(e) => addCount(e)} onsubtractCount={(e) => subtractCount(e)}/>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Howell;