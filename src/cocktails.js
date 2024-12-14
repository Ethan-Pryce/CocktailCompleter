import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';


/* Props 
    id
    name
    num
    */
function Cocktails(props) {
    return <div className="displayIng" >
    <div className='ingredient' onClick={props.onClick}>{props.name}</div>
    <div className='countIng' onClick={props.onClick}>{ (props.num > -1) ? props.num : ""}</div>
    </div> 

  }

  export default Cocktails