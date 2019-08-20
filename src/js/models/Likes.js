export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1; // If we cannot find any item with the ID that we passed in then this is going to be -1. And so this entire expression will turn out to be false. Which means that the recipe with the ID we passed is not liked.
    }

    getNumLikes() {
        return this.likes.length;
    }
}