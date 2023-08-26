import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Home/style.css'
import 'Assets/styles/Howell/style.css'



const HowellComponent = ({onpeopleCount, onsubtractCount}) => {
    return (
        <div>
            <h3>Count Control button (parameter) onpeopleCount</h3>
            <Button onClick={() => onpeopleCount(5)}>Add</Button>
            <Button className='ms-3' onClick={() => onsubtractCount(5)}>Substract</Button>
        </div>
    )
};


export default HowellComponent;