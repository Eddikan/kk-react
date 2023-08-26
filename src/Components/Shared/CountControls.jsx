import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Count = ({onAddCount, onSubtractCount, onMultiplyCount, onDivideCount, onResetCount}) => {

  return (
    <div>
        <hr />
        <h1>Count Controls</h1>
        <Button className="mx-2" onClick={() => onAddCount(1)} variant="info">Add</Button>
        <Button className="mx-2" onClick={() => onSubtractCount(1)} variant="info">Subtract</Button>
        <Button className="mx-2" onClick={() => onMultiplyCount(2)} variant="info">Multiply</Button>
        <Button className="mx-2" onClick={() => onDivideCount(2)} variant="info">Divide</Button>
        <Button className="mx-2" onClick={() => onResetCount(0)} variant="info">Reset</Button>
    </div>
  );
};

export default Count;