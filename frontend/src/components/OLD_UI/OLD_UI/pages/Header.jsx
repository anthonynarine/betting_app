// SECOND COMPONENT CREATED


import React from 'react';
import emblem from "../assets/emblem.png"


function Header() {


    return(
        <div className="header">
            <img className='emblem' src={emblem} alt="logo" height="125"/>
        </div>
    )


};

export default Header;