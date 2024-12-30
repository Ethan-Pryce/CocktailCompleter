import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import {myDrinks, myIngredients, myRaw_ing, myDrink_names, drinkID} from './Data_Sheet.js';
import Ingredient from './ingredient.js'
import Drink from './drink.js';
import Cocktails from './cocktails.js'

function App() {
//Actual list of drinks
const [drinks, setDrinks] = useState(JSON.parse(JSON.stringify(myDrinks())));
//console.log(drinks)
//console.log(Object.keys(drinks))

// just a list of ingredients
const [ingredients, setIngredients ] = useState(Object.keys(myIngredients()));
// Ingredients by popularity, an array of [name, drinks]
const [frequencyIng, setFrequencyIng] = useState([]);

// Drinks as an array
const [sortableDrinks, setSortableDrinks] = useState([]);

//All selected items
const [itemsSelected, setSelected] = useState([]);
// Excluded Ingredients
const [itemsExcluded, setExcluded] = useState([]);
//Missing one ingredient for the reciepe
const [missingOne, setMissingOne] = useState({});
//Cocktails that can be made 
const [makable, setMakable] = useState({})
//A list of ingredients with related cocktails {"ingreident":[cocktail1, cocktail2],}
const [recIngredients, setRecIng] = useState(JSON.parse(JSON.stringify(myIngredients())));
//The Search value for filtering
const [searchValue, setSearch] = useState("");
//Handles the filtered ingredients
const [searchedIngredients, setSI] = useState([]);
//For looking up links
const [drinkIDs, setDID] = useState(JSON.parse(JSON.stringify(drinkID())));

//Track the sort value of the ingredients
const [ingSearchSort, setISS] = useState(0);
//Track the sort value of the drinks
const [drinkSearchSort, setDSS] = useState(0);

//console.log(ingredients);

 //Count combinations an ingredient has
 function combos(ing){
  /*
  if(itemsSelected.length > 0){
    let combos = 0;
    for(let i = 0; i<recIngredients[ing].length; i++){
      if (missingOne.hasOwnProperty(recIngredients[ing][i])){
        combos++;
      }
    }
    return combos;
  }*/
  var count = myIngredients()[ing].length;
  return count;
}

//Convert ingredients to an array to sort by popularity 
function ingToPop(){
 var ingNames = Object.keys(myIngredients());
 //console.log(ingNames);
 var temp = [];
 for (var i = 0; i < ingNames.length; i++){
  temp.push([ingNames[i], myIngredients()[ingNames[i]].length])
 }
 setFrequencyIng(temp);
//console.log(frequencyIng);
}

//convert drinks to an array that is usable by sort
function drinkToArray(){
  var drinkNames = Object.keys(drinks);
  var temp = [];
  console.log(drinkNames);
  console.log(drinks["Applejack"])
  for (var i = 0; i < drinkNames.length; i++){
    var item = [drinkNames[i]];
    item.push(drinks[drinkNames[i]]);
    temp.push(item);
  }
  console.log(temp);
  setSortableDrinks(temp);
  console.log(sortableDrinks);
}


function handleSearchChange (e){
  e.preventDefault();
  //console.log(e.target.value);
  setSearch(e.target.value);

  //if(searchValue.length > 0){
    //console.log("cherry colar".search(".*" + e.target.value +".*" ));
    setSearch(e.target.value);
    //console.log("SV:" + searchValue);
    var caseless = new RegExp(".*" + e.target.value +".*" , "i")
    setSI(ingredients.filter((ing) => {return ing.search(caseless) != -1} ));
  //}
}

//Selects the ingredient clicked
function select(ing){
  // Copy, push and update selected
  var selected = [...itemsSelected];
  selected.push(ing);
  setSelected(selected);
  
  var index = ingredients.indexOf(ing);
  var tempIng = ingredients
  if (index !== -1) {
    tempIng.splice(index, 1);
  }
  setIngredients(tempIng);
  
  var indexSI = searchedIngredients.indexOf(ing);
  var tempIngSI = searchedIngredients
  if (indexSI !== -1) {
    tempIngSI.splice(indexSI, 1);
  }
  setSI(tempIngSI);

}

// Lets move it to the exclude
function exclude(ing){
  var excluded = [...itemsExcluded];
  excluded.push(ing);
  setExcluded(excluded);


  var index = itemsSelected.indexOf(ing);
  var tempIng = itemsSelected;
  if (index !== -1) {
    tempIng.splice(index, 1);
  }
  setSelected(tempIng);
}

// Move it back to the ingredients
function returnIng(ing){
  var ingre = [...ingredients];
  ingre.push(ing);
  setIngredients(ingre);



  var index = itemsExcluded.indexOf(ing);
  var tempIng = itemsExcluded;
  if (index !== -1) {
    tempIng.splice(index, 1);
  }
  setExcluded(tempIng);

  var caseless = new RegExp(".*" + searchValue +".*" , "i");
  if(caseless.test(ing)){
    var temp = [...searchedIngredients];
    temp.push(ing)
    setSI(temp);
  }

}

// Used to sort by the number of items in the matching array per item
function compareIngPopularity(a, b){
  if (myIngredients()[a].length == myIngredients()[b].length){
    return 0;
  }
  else if (myIngredients()[a].length > myIngredients()[b].length){
    return -1;

  }
  else{
   return 1;
  }
}

//used to sort by the number of missing ingredients
function compareMissing(a,b){
  let missingA = drinks[a].filter(x => !itemsSelected.includes(x)).length;
  let missingB = drinks[b].filter(x => !itemsSelected.includes(x)).length;

  if (missingA == missingB){
    if (drinks[a].length == drinks[b].length){
      return 0
    }
    else if (drinks[a].length > drinks[b].length){
      return 1;
  
    }
    else{
     return -1;
    }
  }
  else if (missingA > missingB){
    return 1;
  }
  return -1;

}

// used to sort by the number of total ingredients
function compareComponents(a,b){
  if (drinks[a].length == drinks[b].length){
    let missingA = drinks[a].filter(x => !itemsSelected.includes(x)).length;
    let missingB = drinks[b].filter(x => !itemsSelected.includes(x)).length;

    if (missingA == missingB){
      return 0;
    }
    else if (missingA > missingB){
      return 1;
    }
  return -1;
  }
  else if (drinks[a].length > drinks[b].length){
    return 1;

  }
  else{
   return -1;
  }
}

// Returns true if a drink has an included ingredient and none of the excluded ingredients
function viableDrink(drinkName){
  
  for (var i = 0; i<itemsExcluded.length; i++)
  {
    if (drinks[drinkName].includes(itemsExcluded[i])){
      return false;
    }

  }

  for (var i = 0; i< itemsSelected.length; i++)
    {
      if (drinks[drinkName].includes(itemsSelected[i])){
        //console.log(drinkName);
        return true;
      }

    }

    return false;
}

//Check if a or b concludes more recipeies 
function compareConcluder(a,b){
  var countA = countConclusions(a);
  var countB = countConclusions(b);

  if (countA == countB){
    return 0;
  }
  else if( countA > countB ){
    return -1;

  }
  else{
    return 1;
  }
}

//Check if any of the reciepes are 1 off and if so if this completes them.
function countConclusions(ing){
  var count = 0;
  //console.log(ing);

  for (var i = 0; i < myIngredients()[ing].length; i++ ){ 
    //console.log(myIngredients()[ing][i]);  
    var currDrink = myDrinks()[myIngredients()[ing][i]];
      var drinkLen = currDrink.length; 
      for (var k = 0; k < currDrink.length; k++){
        if (itemsExcluded.includes(currDrink[k]) ){
          count = 99;
          break;
        }
        else if(itemsSelected.includes(currDrink[k])){
          
          drinkLen -= 1;
        }
      }
      if (drinkLen == 1){
        count += 1;
      }
    }

    return count;
}

// Count how many of the included ingredients it uses out of its total reciepe length
function countPU(drink){
  var count = 0;
  // get the drink with ingredients
  // count how many of the included ingredients are used
  // 
  var currIng = drinks[drink];

  for (var i = 0; i < currIng.length; i++){
    if (itemsSelected.includes(currIng[i])){
      count += 1;
    }
  }

  return count;
}

//a hacky fix for a strange bug
function displayPU(drink){}

// Sort by the counted 
function sortPU(a, b){
  let APU = countPU(a) / drinks[a].length;
  let BPU = countPU(b) / drinks[b].length;

  if (APU == BPU){
    return 0
  }
  if ( APU > BPU){
    return -1
  }
  else 
  {
    return 1
  }

}

  //Used for running a function on load
  useEffect(() => {
    ingToPop();
    drinkToArray();
    //console.log(myDrink_names());
      //your code to be executed after 1 second

 
    
}, [])

  return (
    <div className="App">
      
        
        <div id="ingHead"> 
          <h3 className={ingSearchSort == 0 ? "active-header" : "inactive-header" }  onClick={() => setISS(0)} >Popularity</h3>
          <h3 className={ingSearchSort == 1 ? "active-header" : "inactive-header" }  onClick={() => setISS(1)} >Alphabetical</h3>
          <h3 className={ingSearchSort == 2 ? "active-header" : "inactive-header" }  onClick={() => setISS(2)} >Concludes</h3>
          

        </div>
        <div className='ingList'>
          {searchValue.length > 0 ? 
          // Search value is true
          ingSearchSort == 1 ?  searchedIngredients.sort().map((ing) => <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => select(ing)}></Ingredient>) :
          ingSearchSort == 2 ? searchedIngredients.sort(compareConcluder).map((ing) => <Ingredient name={ing} key={ing} num={"+" + countConclusions(ing)} onClick={() => select(ing)}></Ingredient>):
          searchedIngredients.sort(compareIngPopularity).map((ing) => <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => select(ing)}></Ingredient>) :
          
          //Search value is false
          ingSearchSort == 1 ? ingredients.sort().map((ing) => <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => select(ing)}></Ingredient>):
          ingSearchSort == 2 ?  ingredients.sort(compareConcluder).map((ing) => <Ingredient name={ing} key={ing} num={"+" + countConclusions(ing)} onClick={() => select(ing)}></Ingredient>):
          ingredients.sort(compareIngPopularity).map((ing) => <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => select(ing)}></Ingredient>)}
          
          
          </div>
      
          <input type='text' id="textInput" className='textInput' placeholder="Filter" value={searchValue} onChange={handleSearchChange}></input>
      <div id="filters">
        <div id="includeDiv" className='filterDiv'>
        <h3>Include</h3>
        <div className='filterFlex'>
        {itemsSelected.length > 0 ?  itemsSelected.map((ing) => <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => exclude(ing)}></Ingredient>) : <span>...</span> }
        </div>
        </div>
   
        <div id="includeDiv" className='filterDiv'>
        <h3 >Exclude</h3>
        <div className='filterFlex'>
        {itemsExcluded.length > 0 ?  itemsExcluded.map((ing) => <Ingredient name={ing} key={ing} num={combos(ing)} onClick={() => returnIng(ing)}></Ingredient>) : <span>...</span>  }
        </div>
        </div>




      </div>

      
      
      <div id="results">
        <div id="resultHead"> 
          <h3 className={drinkSearchSort == 0 ? "active-header" : "inactive-header" }  onClick={() => setDSS(0)}>Name</h3>
          <h3 className={drinkSearchSort == 1 ? "active-header" : "inactive-header" } onClick={() => setDSS(1)}>Missing</h3>
          <h3 className={drinkSearchSort == 2 ? "active-header" : "inactive-header" }  onClick={() => setDSS(2)}>Total Parts</h3>
          <h3 className={drinkSearchSort == 3 ? "active-header" : "inactive-header" }  onClick={() => setDSS(3)}>% Included</h3>
          
        </div>
            <div className="cocktailList">
              {/* Filtering is easy https://upmostly.com/tutorials/react-filter-filtering-arrays-in-react-with-examples */
              drinkSearchSort == 0 ? Object.keys(drinks).filter((drink) => viableDrink(drink)).map((drink) => <Cocktails name={drink} key={drink} num={-1} onClick={() => window.open('https://www.thecocktaildb.com/drink/' + drinkIDs[drink], '_blank')}></Cocktails>) :
              drinkSearchSort == 1 ? Object.keys(drinks).filter((drink) => viableDrink(drink)).sort(compareMissing).map((drink) => <Cocktails name={drink} key={drink} num={drinks[drink].filter(x => !itemsSelected.includes(x)).length} onClick={() => window.open('https://www.thecocktaildb.com/drink/' + drinkIDs[drink], '_blank')}></Cocktails>): 
              drinkSearchSort == 2 ? Object.keys(drinks).filter((drink) => viableDrink(drink)).sort(compareComponents).map((drink) => <Cocktails name={drink} key={drink} num={drinks[drink].length} onClick={() => window.open('https://www.thecocktaildb.com/drink/' + drinkIDs[drink], '_blank')}></Cocktails>):
              Object.keys(drinks).filter((drink) => viableDrink(drink)).sort(sortPU).map((drink) => <Cocktails name={drink} key={drink} num={countPU(drink) + "/" + drinks[drink].length} onClick={() => window.open('https://www.thecocktaildb.com/drink/' + drinkIDs[drink], '_blank')}></Cocktails>)
              }
              
              </div>
          </div>
        
      </div>

  );
}

export default App;
