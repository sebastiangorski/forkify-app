export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1; // If we cannot find any item with the ID that we passed in then this is going to be -1. And so this entire expression will turn out to be false. Which means that the recipe with the ID we passed is not liked.
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes)); // JSON transform an array into a string
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes')); // JSON transform a string into a data stuctures. If the storage is empty, this will return null, so we need to test that
    
        // Restore likes from the localStorage
        if (storage) this.likes = storage;
    }
}