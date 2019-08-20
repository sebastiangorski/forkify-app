import axios from 'axios'; // Works like Fetch, but much better
import {key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        //const key = 'a053055ee783dba34ae28b1a18fc9b71';
            
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }
    }
}


