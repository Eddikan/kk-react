import React, { useState, useEffect } from 'react';

const Count = ({count}) => {

  return (
    <div>
        {count ? count : '0'}
        {count % 2 === 0?
            <p className='even-number'>The color is blue</p>
            : 
            <p className='odd-number'>The color is red</p>
        }
        {count === 1 ?
            <p>Then I saw her face now I'm a believer</p>
            : count === 2 ?
            <p>This is how you remind me of what I really am, it's not like you to say sorry I've once waited on a different story</p>
            : count === 3 ?
            <p>Let me be the one to break it up so you won't have to make excuses, we don't need to find a setup where someone wins or someone loses</p>
            : count === 4 ?
            <p>Ohhhh woah huwag na huwag mong sasabihin na di mo nadama itong pag-ibig kong handang ibigay kahit pang kalayaan mo</p>
            : count === 5 ?
            <p>To be is all I gotta be
            And all that I see
            And all that I need this time
            To me the life you gave me
            The day you said goodnight</p>
            : count === 6 ?
            <p>'Cause you had a bad day
            You're taking one down
            You sing a sad song just to turn it around</p>
            : 
            <p>We have no song for this number yet sorry</p>
        }
    </div>
  );
};

export default Count;