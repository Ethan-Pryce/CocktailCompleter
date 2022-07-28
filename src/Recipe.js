import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';


/* Props 

    drink = drink info
    update = function to add or drop 
    */
function Recipe(props) {
  const [ingList, setIngList] = useState([]);


  useEffect(() => {
    let temp = []
    for(let j = 0; j < 15; j++){
      let measure = "strMeasure" + j;
      let ing = "strIngredient" + j;
      if (props.drink[ing] != null){
        let combined = props.drink[measure] + props.drink[ing];
        temp.push(combined);
        
      }
    }
    setIngList(temp);
  }, [])

    //console.log(drinkInfo);
    return <div className='recipeDiv'><h2>{props.drink.strDrink}</h2><div className="closer" onClick={props.update}>&#10060;</div>
          <ul>{ingList.map((ingr) =><li>{ingr}</li> )} </ul>
          <p>{props.drink.strInstructions}</p>
    </div>

  }

  export default Recipe