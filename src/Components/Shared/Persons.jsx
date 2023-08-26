import React, { useEffect, useState } from 'react';
import '../../Assets/styles/Aj/style.css'

const Persons = ({personCount}) => {
  return (
    
    <div className={personCount > 20 ? 'greater-than' : personCount < 20 ? 'less-than' : 'equal-to'}>
      
      <h2 className={personCount % 2 === 0 ? 'even' : ' odd '}>{personCount}</h2>     
      
      <p> {personCount >20 ? 'This is color red and personCount is more than 20' : personCount < 20 ? 'This is color blue and personCount is less than 20' : 'This is color green and personCount is equal to 20'}</p>
    </div>
  );
};

export default Persons;