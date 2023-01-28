export const UtSequence = {
    num: 0,
    compPrefix: 'rb-comp-',

    getId() {
        return ++this.num;
    },

    getCompId() {
        return this.compPrefix + this.getId();
    }
}