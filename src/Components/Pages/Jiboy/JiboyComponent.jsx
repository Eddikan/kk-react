import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Home/style.css'
import 'Assets/jiboy/style.css'

const JiboyComponent = ({onAddCount, onSubtractCount, personCount}) => {

    return (
        <div className="border-top">
            {/* {personCount ? personCount : '0'}
                {personCount % 2 === 0 ?
                <p>This color is blue</p>
                :
                <p>This color is red</p>
                }
                <h2 
            className={
                personCount % 2 === 0 ?
                'even'
                :
                'odd'
            }
                >{personCount}</h2>
            
            <h2>Value of Count State {personCount}</h2> */}
            <h3>Control Button</h3>
            <Button onClick={() => onAddCount(5)}>Add +</Button>
            <Button className="ms-3" onClick={() => onSubtractCount(5)}>Subtract -</Button>
        </div>
    )
};

export default JiboyComponent;