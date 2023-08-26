import React from 'react';
import { Button }  from 'react-bootstrap';

const JurielComponent = ({count, onSubtractCount, onAddCount, onResetCount}) => {

  return (
    <>
        <h3>Value of count: <span className={count % 2 === 0 ? 'even' : 'odd'}><b>{count}</b></span></h3>
        {count % 2 === 0 ? 
            <>
                <p className="text-primary">Even ako</p> 
            </>
        : 
            <>
                <p className="text-danger">Odd ako</p>
            </>
        }
        <Button className="me-2" variant="primary" onClick={() => onAddCount(1)}>Add 1</Button>
        <Button className="me-2" variant="danger" onClick={() => onSubtractCount(1)}>Subtract 1</Button>
        <Button className="me-2" variant="secondary" onClick={() => onResetCount(0)}>Reset 0</Button>
    </>
  );
};

export default JurielComponent;