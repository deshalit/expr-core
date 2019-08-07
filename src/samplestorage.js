/**
 *
 *
 * @class SampleStorage is responsible for storing named expressions
 * This class must be extended to gain functionality
 */
class SampleStorage {
    /**
     *
     *
     * @param {string} name arbitrary name of the expression
     * @param {object} data Expression object
     * @returns {string} id of new stored expression
     * @memberof SampleStorage
     */
    async add(name, data) {
            return null;
        }
        /**
         *
         *
         * @param {string} id
         * @returns {boolean} true if deletion succeeded and false otherwise
         * @memberof SampleStorage
         */
    async del(id) {
            return false;
        }
        /**
         *
         *
         * @returns {array of objects} array of {id, name, exp}
         * @memberof SampleStorage
         */
    async list() {
        return [];
    }
}

class DumbStorage extends SampleStorage {
    constructor() {
            super();
            this.holder = {};
            this.newId = 1;
        }
        /**
         *
         *
         * @returns {string} id 
         * @memberof DumbStorage used internally by add() method 
         * to generate unique id
         */
    generateItemId() {
        // let d = new Date();
        // return [d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()]
        //     .map(s => s.toString().padStart(2, '0'))
        //     .join('') + d.getMilliseconds().toString().padStart(3, '0');
        return (this.newId++).toString();
    }

    async add(name, data) {
        let id = this.generateItemId();
        this.holder[id] = { name, data };
        return id;
    }

    async del(id) {
            delete this.holder[id];
            return true;
        }
        /**
         *
         *
         * @returns {array} array of objects {id, name, exp}
         * @memberof DumbStorage
         */
    async list() {
        return Object.keys(this.holder).map(id => ({ id, name: this.holder[id].name, exp: this.holder[id].data }));
    }

    // static getDateById(id) {
    //     // if id is '20190805142025', then x is ["2019", "08", "05", "14", "20", "25"] 
    //     let x = id.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/).slice(1);
    //     return new Date(...x);
    // }

    // static getDateStrById(id) {
    //     let d = ExpressionSamples.getDateById(id);
    //     return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    // }
}

const dumbStorage = new DumbStorage();
let sampleStorage = dumbStorage;

function setStorage(newStorage) {
    sampleStorage = newStorage;
}

export { sampleStorage, SampleStorage, dumbStorage, setStorage };