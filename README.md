

Welcome.

Cocktail Completer is the repository for the Cocktail Concluder site. https://cocktailconcluder.ca/

The webapp is written in React and works with a series of lists scrapped from TheCocktailDB then makes API calls as needed for pictures and recipes in the end.

App.js - Core logic including leftover TheCocktailDB scrapping methods.

Data_Sheet.js - A sheet of pre-obtained data.

Components: Recipe.js - Shows up on click to explain how to make the drink. Uses already loaded API information. cocktails.js - Holds all the makable drinks when a user chooses to view them. drink.js - Calls TheCocktailDB API to get the information for the drink. Shows up as a little square and renders as it receives data. Ingredient.js - A small button that holds the ingredient and the count for it.
