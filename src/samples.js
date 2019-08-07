import oc from './operconst';
import Expression from './expression';
import { SampleStorage, sampleStorage, dumbStorage } from './samplestorage.js';

/**
 *
 *
 * @class Samples is a holder for samples - stored expressions
 * This holder can perform simple expression management: add, delete, 
 * get by key, get all of particular result datatype 
 */
class Samples {
    constructor() {
        this._items = {};
        this.storage = sampleStorage;
    }

    /**
     *
     *
     * @param {string} [type=null] oc.DATATYPE_NUMBER | oc.DATATYPE_BOOLEAN
     * @returns {boolean} indicates wheither we have any stored expressions
     * [ of particular type ] 
     * @memberof Samples
     */
    isEmpty(type = null) {
        if (!type) {
            return this._items.length === 0;
        } else {
            return this.ids(type).length === 0;
        }
    }

    /**
     *
     *
     * @param {string} name - an arbitrary name of the expression
     * @param {object} exp - Expression object
     * @memberof Samples
     * Method add() calls this.storage.add() to 
     * perform a call to the database. 
     */
    async add(name, exp) {
        let id = await this.storage.add(name, exp.toJSON());
        if (id) {
            this._items[id] = { name, exp };
            return id;
        }
        return false;
    }

    /**
     *
     *
     * @param {string} id
     * @param {function} [callback=null] 
     * @memberof Samples
     */
    async del(id) {
        let res = await this.storage.del(id);
        if (res) {
            delete this._items[id];
        }
        return res;
    }

    ids(type = null) {
        let keys = Object.keys(this._items);
        if (!type) {
            return keys;
        } else {
            return keys.filter(id => this._items[id].exp.operation.resultDataType === type);
        }
    }

    getById(expId) {
        return this._items[expId];
    }

    /**
     *
     * Reads data from an external storage
     * Cleans the internal holder before reading
     * @memberof Samples
     */
    async readAll() {
        this._items = {};

        let data = await this.storage.list();
        if (Array.isArray(data)) {
            data.forEach(item => {
                this._items[item.id] = { name: item.name, exp: new Expression().fromJSON(item.exp) }
            });
            return true;
        }
        return false;
    }
}

let samples = new Samples();

export { samples, Samples };