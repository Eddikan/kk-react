import React, { useEffect, useState } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Home/style.css'
import 'Assets/jiboy/style.css'
import JiboyComponent from 'Components/Pages/Jiboy/JiboyComponent';

const Jiboy = () => {

    const [count, setCount] = useState(0);
    const addCount = (e) => {
        setCount (count + (e))
    }

    const subtractCount = (e) => {
        setCount (count - (e))
    }

//     useEffect() => {
//     return() => {

//     };
//   }
  return (
    <Layout>
      <Container id="your-container-id" class="your-container-class">
        <Row>
          <Col md="12">
            <h1>Jiboy</h1>
            <h2 
            className={
                count % 2 === 0 ?
                'even'
                :
                'odd'
            }
                >{count}</h2>
            
            {/* <h2>Value of Count State {count}</h2> */}
            {/* <JiboyComponent personCount={count} />
            <Button className="me-2" onClick={addCount} variant="primary">Add 1</Button>
            <Button className="me-2" onClick={subtractCount} variant="primary">Subtract 1</Button> */}
          </Col>
          <Col md="12">
            <JiboyComponent onAddCount={(e) => addCount(e)} onSubtractCount={(e) => subtractCount(e)} />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Jiboy;