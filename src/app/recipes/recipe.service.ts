import { EventEmitter } from "@angular/core";
import { Recipe } from "./recipe.model";

export class RecipeService{
    recipeSelected = new EventEmitter<Recipe>(); 
    
   private   recipes: Recipe[] = [
  new Recipe("A test recipe", "just a test", "https://natashaskitchen.com/wp-content/uploads/2020/03/Pan-Seared-Steak-4.jpg",)
   ];
    
    getRecipes() {
        return this.recipes.slice();
    }
}