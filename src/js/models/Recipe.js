import axios from 'axios';
import {key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            console.log(error);
            alert('Something went wrong');
        }
    }

    calcTime() {
        // For every 3 ingredients we need 15 minutes
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];


        const newIngredients = this.ingredients.map(el => {
            // 1. Unify units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2. Remove parentheses ()
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); // Regular expressions which removes ()

            // 3. Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); // Test if the array includes elements from unitsShort

            let objIng;
            if (unitIndex > -1) { // Which means that if there is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2 --> "4+1/2" so eval will evaluate this string as being JS code and will calcualte it to 4.5]
                // Ex. 4 cups, arrCount is [48]
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) { // For like one bread etc. If it can be converted into a number then this will return the number intself and coerce into true
                // There is NO unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ') // Entire array without first element
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient // Instead of saying ingredient: ingredient. ES6 will automatically create this property and assing value
                }
            }


            return objIng;
        });
        this.ingredients = newIngredients;
    }

}