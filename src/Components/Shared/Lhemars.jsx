import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Lhemar/style.css'

// const Lhemars = ({personsCount}) => {
  const Lhemars = ({onAddCount, onSubstractCount}) => {


  return (
    <div>
      {/* <div className=
          {personsCount  % 2 === 0 
          ? 
          'Even-Number'
          : 
          'Odd-Number'
          } 
          > {personsCount}
      </div>
        {personsCount % 2 === 0 ?
          <p className="Even-Number"> This is color blue</p>
          :
          <p className="Odd-Number">This is color red </p>
        }
        <div className=
          {personsCount  >= 20 
          ? 
          'Even-Number'
          : 
          'Odd-Number'
          } 
          > {personsCount}
      </div>
        {personsCount >= 20 ?
          <p className="Even-Number"> This is color blue</p>
          :
          <p className="Odd-Number">This is color red </p>
        } */}

            <Button className="me-2" variant="primary" onClick={()=>onAddCount(1)}>Lhemar Add ( + )</Button>
            <Button className="me-2" variant="danger" onClick={()=>onSubstractCount(1)}>Lhemar Substract ( - )</Button>      
    </div>

  );

  
};

export default Lhemars;