// import '../Assets/styles/Jackie/style.css'
import { Container, Row, Col, Button } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';

const Jackiepogi = ({ onAddCount, onSubtractCount }) => {


    return (
        <div>
            <hr/>
            <h1>Count Control Button</h1>
            <Button className="me-2" onClick={() => onAddCount(5)}>Add</Button>
            <Button onClick={() => onSubtractCount(5)}>Subtract</Button>
            {/* {peoplecount ? peoplecount : '0'}
            {peoplecount % 2 === 0 ?

                <p>This color is blue</p>
                :
                <p>This color is red</p>
            }

            <h2 className={
                peoplecount % 2 === 0 ?
                    'even'
                    :
                    'odd'
            }
            >  {peoplecount}</h2>
            <h2>
                The Value of count {peoplecount}
            </h2> */}
            
        </div>
    )
};


export default Jackiepogi;