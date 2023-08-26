import React, { useEffect, useState } from 'react';

function Count({currentCount}) {
  return (
    <div>
        <h2 className={currentCount % 2 == 0 ? 'even': 'odd'}>{currentCount}</h2> 
    </div>
  );
}

export default Count;