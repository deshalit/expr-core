/**
 * 
 * @class Variables is a container for special reserved entities - variables.
 * Each this variable gets its value at runtime, depends on the actual result set.
 * Examples: maxValue, minValue, maxRating, minRating etc.
 * Every variable has id, long name, short name (for condensed view)
 * and evaluator - some client-defined callback function
 * 
 */
class Variables {
    constructor() {
        this._vars = {};
    }

    clear() {
        this._vars = {};
    }

    addVar(key, fullName, shortName, evaluator = null) {
        this._vars[key] = { fullName, shortName, evaluator };
    }

    isVar(key) {
        return (key in this._vars);
    }

    varName(key, full = true) {
        let item = this._vars[key];
        return item ? (
            full ? item.fullName : item.shortName
        ) : "";
    }

    formula(key, shortFormat = true) {
        let item = this._vars[key];
        return item ? (
            shortFormat ? item.shortName : item.fullName
        ) : "";
    }

    getHTMLoptions(value = null) {
        return Object.keys(this._vars).map(
            key => `<option ${(value && (value === key)) ? "selected " : ""}value="${key}">${this._vars[key].fullName}</option>`
        );
    }

    evaluate(key) {
        let item = this._vars[key];
        return item ? (
            item.evaluator ? item.evaluator() : null
        ) : null;
    }
}

const variables = new Variables();

export {
    Variables,
    variables
}