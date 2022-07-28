import logo from './logo.svg';
import './App.css';
import Drink from './drink.js';
import Cocktails from './cocktails.js'
import Ingredient from './Ingredient.js'
import React, {useState, useEffect} from 'react';
import {myDrinks, myIngredients, myRaw_ing, myDrink_names} from './Data_Sheet.js';


function App() {
  const [drinkList, setDrinkList] = useState([]);
  const [drinks, setDrinks] = useState(myDrinks());
  // just a list of ingredients
  const [ingredients, setIngredients ] = useState(Object.keys(myIngredients()));
  //All selected items
  const [itemsSelected, setSelected] = useState([]);
  //Missing one ingredient for the reciepe
  const [missingOne, setMissingOne] = useState({});
  //Cocktails that can be made 
  const [makable, setMakable] = useState({})
  //A list of ingredients with related cocktails {"ingreident":[cocktail1, cocktail2],}
  const [recIngredients, setRecIng] = useState(myIngredients());
  const [showSelected, setShowSelected] = useState(false);
  //A hook for storing recipes for the completer box
  const [completer, setCompleter] = useState([])
  const [showHelp, setHelp] = useState(false);

  async function byName(name){
    let url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
    let result = await fetch(url + name);
    let data = await result.json();
    console.log(data.drinks[0]);
  }

  async function allNames(){
    var list_of_names = [];
    for(let k=0;k<10;k++){
      let result = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=" + k);
    let data = await result.json();
    if(data.drinks != null){
      let totalDrinks = data.drinks.length;
      console.log(data.drinks);
      for(let i = 0; i < totalDrinks; i++){
        //let outputString = "";
        //outputString += data.drinks[i].strDrink +  " = [";
        //for(let j = 0; j < 15; j++){
        //  let ing = "strIngredient" + j;
        //  if (data.drinks[i][ing] && data.drinks[i][ing] != null){
        //      outputString += ", " + data.drinks[i][ing];
        //  }
        list_of_names.push(data.drinks[i].strDrink);
        //console.log(list_of_names);
        }
        //outputString += "];";
        //console.log(list_of_names);
      }
  }

    for(let n=0;n<26;n++){
    let letter = String.fromCharCode(97 + n);
    let result = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=" + letter);
    let data = await result.json();
    if(data.drinks != null){
      let totalDrinks = data.drinks.length;
      for(let i = 0; i < totalDrinks; i++){
        console.log(data.drinks);
        //let outputString = "";
        //outputString += data.drinks[i].strDrink +  " = [";
        //for(let j = 0; j < 15; j++){
        //  let ing = "strIngredient" + j;
        //  if (data.drinks[i][ing] && data.drinks[i][ing] != null){
        //      outputString += ", " + data.drinks[i][ing];
        //  }
        list_of_names.push(data.drinks[i].strDrink);
        //console.log(list_of_names);
        }
        //outputString += "];";
        
      }

      }
      console.log(list_of_names);
  }
  

  async function createDrinkList(){
    var output = {};
    for (let i=0; i < myDrink_names().length; i++){
      let temp = myDrink_names()[i];
      let result = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + temp);
      //console.log(result);
      try{

        let data = await result.json();
        console.log(data);
        output[temp] = [];
          for(let j = 0; j < 15; j++){
          let ing = "strIngredient" + j;
          if (data.drinks[0][ing] && data.drinks[0][ing] != null){
            output[temp].push(data.drinks[0][ing]);
            
          }
        }
        if (output[temp].length < 1){
          console.log(temp);
        }

        
      }
      catch(e){
        console.error(e);
      }

  }
  console.log(output)
}

  async function allIngredients(){
    let temp_ingredients = []
    let count = 0;
    for(let n=0;n<620;n++){
      let result = await fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?iid=" + n);
      let data = await result.json();
      
      if(data.ingredients != null){
        count += 1;
        temp_ingredients.push(data.ingredients[0].strIngredient);
      }
      //console.log(data);
    }
    console.log(temp_ingredients);
  }

  async function getDrinkByI(){
    var output = {};
    for (let i=0; i < myRaw_ing().length; i++){
      let temp = myRaw_ing()[i];
      let result = await fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + temp);
      //console.log(result);
      try{
        let data = await result.json();
        if(data.drinks.length > 0){
          output[temp] = [];
          for(let n=0; n<data.drinks.length; n++){
            output[temp].push(data.drinks[n].strDrink);
            console.log(output); 
          }
        }

        
      }
      catch(e){
        console.error(e);
      }
      
      if(i%15 == 0 ){}
       
      
        
      
      
    }
    
    
  }
  
  function popular (){
    setDrinkList(["Mojito", "Old Fashioned", "Long Island Tea", "Negroni", "Whiskey Sour", "Dry Martini", "Daiquiri", "Margarita"]);
  }

  function initializeIng(){
    myIngredients()
  }

  function updateFromList(){}

  function combos(ing){
    if(itemsSelected.length > 0){
      let combos = 0;
      for(let i = 0; i<recIngredients[ing].length; i++){
        if (missingOne.hasOwnProperty(recIngredients[ing][i])){
          combos++;
        }
      }
      return combos;
    }
    var count = myIngredients()[ing].length;
    return count;
  }

  function select(ing){
    // ing = the ingredient clicked
    // ingredients = a simple list of ingredients
    // selected = the list of selected items
    // recIngredients = reciepes sorted by ingredient
    // drinks = reciepes sorted by drink

      console.log(ing);
      //console.log(ingredients);

      // Copy, push and update selecdted
      var selected = [...itemsSelected];
      selected.push(ing);
      setSelected(selected);

      //console.log(recIngredients[ing].length)

      for(let i = 0; i < recIngredients[ing].length; i++){
        console.log(recIngredients[ing][i]);
        console.log(drinks[recIngredients[ing][i]]);
        
     



        
        if (drinks.hasOwnProperty([recIngredients[ing][i]]) && drinks[recIngredients[ing][i]].length == 2){
          let removed = [...drinks[recIngredients[ing][i]]];
          //console.log(removed)
          removed.splice(removed.indexOf(ing),1);
          drinks[recIngredients[ing][i]] = removed;
          console.log(drinks[recIngredients[ing][i]]);
          //Direct updating hooks is bad but here we are
          missingOne[recIngredients[ing][i]] = drinks[recIngredients[ing][i]];
          delete drinks[recIngredients[ing][i]];
          //console.log(recIngredients[ing][i]);
          console.log("We went down to one");
        }
        else if (missingOne.hasOwnProperty([recIngredients[ing][i]])){
          makable[recIngredients[ing][i]] = [];
          delete missingOne[recIngredients[ing][i]];

        }
        else{
          let removed = [...drinks[recIngredients[ing][i]]];
          //console.log(removed)
          removed.splice(removed.indexOf(ing),1);
          drinks[recIngredients[ing][i]] = removed;
          console.log(drinks[recIngredients[ing][i]]);
        }
       
      }
      console.log(drinks);
      console.log(missingOne);
      console.log(makable);

      // Copy, splice and update the list of removed ingredients
      var removedIng = [...ingredients];     
      removedIng.splice(ingredients.indexOf(ing),1);
      setIngredients(removedIng);
      //console.log(drinks);

      //Tell react that state has been updated this is an anitpatern :(
      let temp_drinks = drinks;
      let temp_missing = missingOne;
      let temp_make = makable;
      setDrinks({});
      setMakable({});
      setMissingOne({});
      
      setDrinks(temp_drinks);
      setMakable(temp_make);
      setMissingOne(temp_missing);

      

  }

  //If deselecting is becomes needed this has been left in place 
  function deselect(ing){
    //console.log(ing);
  }

  function reloadPage(){
    window.location.reload();
  }

  function reset(){
    setDrinkList([]);
    setDrinks(myDrinks());
    setIngredients(Object.keys(myIngredients()));
    setSelected([]);
    setMissingOne({});
    setMakable({});
    setRecIng(myIngredients());
    setCompleter([]);
  }

  function toggleHelp(){
    //To prevent both from being opened at once
    setShowSelected(false);
    setHelp(!showHelp);
  }

  function toggleSelected(){
    setHelp(false);
    setShowSelected(!showSelected);
    console.log(showSelected);
  }

  useEffect(() => {
    //popular();
    //let temp_dri = myDrink_names();
    //console.log(temp_dri[0])
    //let temp_arr = []
    //for (const x in temp_dri) {
    //  temp_arr.push(drinks[temp_dri[x]]);
    //  if (drinks[temp_dri[x]] == null) {
    //    console.log(temp_dri[x]);
    //    
    //  }
    //}
    //console.log(temp_arr)
    //console.log(drinks);
    //allNames();
    //allIngredients();
    //getDrinkByI();
    //createDrinkList();
    //initializeIng();

}, [])

  return (
    <div className="App">

        <div className='topBar'>
        <div id="showButton" className={Object.keys(makable).length > 0 ? 'topButton' : 'topButtonDisabled'} onClick={toggleSelected} >Show me the Drinks</div>
        <div id="resetButton" className='topButton' onClick={reset} >Reset</div>
        <div id="questionButton" className='topButton' onClick={toggleHelp}>&#10067;</div>
        </div>
        <div className='infoBar'>
          <div className='infoBlock'>
            <div className='topper'><h3>Selected</h3></div>
            <div className="flexList">{itemsSelected.map((sel) => <div className="selectedIng" key={sel} onClick={() =>deselect(sel)}> {sel}</div>)}</div>
            </div>
          <div className='infoBlock'>
              <div className='topper'><h3>Completes a Reciepe</h3></div>
              <div className="flexList">
              {Object.keys(missingOne).length ? ingredients.map((ing) => (combos(ing) > 0 ? <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => select(ing)}></Ingredient> : null)) : null}
              </div>
          </div>
        </div>

        {ingredients.map((ing) => <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => select(ing)}></Ingredient>)}
        {drinkList.map((drink) => <Drink name={drink} key={drink}></Drink>)}
        {(showSelected && Object.keys(makable).length > 0 )  ? <Cocktails drinks={makable} close={toggleSelected}></Cocktails>
        : null}
        {showHelp ? <div className='helpBox' onClick={toggleHelp}>
        <div className="closer" onClick={toggleHelp}>&#10060;</div>
      <p>Select some ingredients and have the tiny bartender living in the website tell you how many drinks each ingredient would add if you bought it.</p>
          
        </div> : null}

    </div>
  );
}

export default App;
