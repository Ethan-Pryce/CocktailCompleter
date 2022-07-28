import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import Drink from './drink.js';

/* Props 
    drinks
    close = toggleSelected from a level up
    */
function Cocktails(props) {
    return <div className='drinkList'>
      {Object.keys(props.drinks).map((drink) => <Drink name={drink} key={drink}></Drink>)}
      <div className="closer" onClick={props.close}>&#10060;</div>
    </div>

  }

  export default Cocktails