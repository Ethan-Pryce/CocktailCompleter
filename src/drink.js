import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import Recipe from "./Recipe";

/* Props 
    id
    name
    */
    function Drink(props) {
        const [loaded, setLoaded] = useState(0);
        const [drinkInfo, setDrink] = useState();
        const [background, setBackground] = useState("https://i0.wp.com/lakerlutznews.com/lln/wp-content/uploads/2019/10/water.jpg?fit=1200%2C800&ssl=1");
        const [showReciepe, setShow] = useState(false);
    
        async function byName(name){
            let url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
            let result = await fetch(url + name);
            let data = await result.json();
            //console.log(data.drinks[0]);
            setDrink(data.drinks[0]);
            setLoaded(1);
            setBackground(data.drinks[0].strDrinkThumb);
          }
    
          useEffect(() => {
            byName(props.name);
        }, [])
    
       function toggleRec(){
        setShow(!showReciepe);
    
       }
    
        //console.log(drinkInfo);
        return <div className='drinkCozy' onClick={toggleRec}>{loaded && drinkInfo && drinkInfo.strDrinkThumb? <div className="drinkSquare" style={{backgroundImage: "url(" + background + ")"}} ><h2>{props.name}</h2></div> : <div className="drinkSquare" ><h2>{props.name}</h2></div> }{showReciepe ? <Recipe drink={drinkInfo} update={toggleRec}></Recipe>: null}</div>
    
      }
    
      export default Drink