import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import '../../Assets/styles/Aj/style.css'

const Persons = ({onaddCount, onsubtractCount}) => {
  return (
    <div>
        

        <h1> Count Controls </h1>

        <Button className="btn-1" variant="primary" onClick={() => onaddCount(5)}>Add 5</Button>
        <Button className="btn-1" variant="primary" onClick={() => onsubtractCount(1)}>Subtract 1</Button>


    </div>
  );
};

export default Persons;