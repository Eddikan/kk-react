import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Victor/style.css'
import Count from 'Components/Shared/Victor/Count';
const Victor = () => {

    const [count, setCount] = useState(0);


    function addCount() {
        setCount(count + 10);
    }

    function subtractCount() {
        if(count <=5) {
            setCount(0);
        } else {
            setCount(count - 5);
        }
        
    }

    function resetCount() {
        setCount(0);
    }

    useEffect(() => {
        // Update the document title using the browser API
        document.title = `You clicked ${count} times`;
    }, [count]);


  return (
    <Layout>
      <Container id="victor-container" class="your-container-class">
        <Row>
          <Col md="12">
            <h1>Victor</h1>
            {/* <h2 className={count % 2 == 0 ? 'even': 'odd'}>{count}</h2> */}
            <Count currentCount={count}></Count>
            <Button className="me-2" variant="primary" onClick={addCount}>
                Add Count
            </Button>

            <Button className="me-2" variant="primary" onClick={subtractCount}>
               Subtract Count
            </Button>

            <Button className="me-2" variant="primary" onClick={resetCount}>
                Reset
            </Button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Victor;