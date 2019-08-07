import oc from './operconst';

/**
 *
 *
 * @export
 * @class Operation presents some operation - core of an expression
 * Holds an operation code, short and full name, type of the result and operands
 * and callback functions to custom validation (optional) and action performing 
 * @property {string} code - operation code (unique id)
 * @property {string} name - full name
 * @property {string} shortName - short name
 * @property {string} resultDataType - describes type of the operation's result 
 * (see constants DATATYPE_* in the module operconst.js)
 * @property {string} operandDataType - operands' datatype
 * (see constants DATATYPE_* in the module operconst.js)
 * @property {string} viewType - visualization approach
 *       oc.VIEWTYPE_OPERATOR: operand1 name operand2
 *       oc.VIEWTYPE_FUNCTION: name(operand1, operand2)
 * @property {object} arity has properties: 
 *       min - the minimum number of operands
 *       max - the maximum number of operands
 * @property {function} handler - callback determines what the operation has to do with its operands
 * see execute() and perform() methods
 * @property {function} validator - callback determines custom validation with particular operands
 * see validate() method
 */
class Operation {
    /**
     *Creates an instance of Operation.
     * @param {Object} [initObject=null]
     * @memberof Operation
     */
    constructor(initObject = null) {
        Object.assign(this, Operation.Initialize());
        if (initObject) {
            let this_arity = {...this.arity };
            Object.assign(this, initObject);
            this.arity = Object.assign(this_arity, initObject.arity);
        }
    }

    static Initialize() {
        return {
            code: oc.OP_NONE,
            name: "?????",
            shortName: "?",
            arity: { min: 2, max: 2 },
            operandDataType: oc.DATATYPE_NUMBER,
            viewType: oc.VIEWTYPE_OPERATOR
        };
    }

    /**
     *
     *
     * @param {Array} operands
     * @returns JSON object
     * @memberof Operation
     * for example: 
     * 1) let we have an operation op with code 'gt', then: 
     *    op.toJSON(["someVar", 5.1]) -> {"gt": ["someVar", 5.1]}
     *    op.toJSON(["someVar", 5.1]) -> {"gt": ["someVar", 5.1]}
     * 
     * 2) let we have an operation op with code 'max', then: 
     *    op.toJSON(["someVar"]) -> {"max": "someVar"}
     *    op.toJSON(["someVar", 5.1]) -> {"max": "someVar"}
     */
    toJSON(operands) {
        return {
            [this.code]: this.arity.max > 1 ? operands : operands[0]
        };
    }

    /**
     *
     * Method toFormula() makes a string presentation for the operation using
     * parameters (operands). Examples:
     * 1) const opr = {code: "max", viewType: oc.VIEWTYPE_FUNCTION, shortName: "MAX"}
     *    opr.toFormula(["param1", "param2"]) //  MAX(param1, param2)
     * 2) const opr = {code: "mul", viewType: oc.VIEWTYPE_OPERATOR, shortName: "*"}
     *    opr.toFormula(["a", "b", 5]) // a * b * 5
     * 3) const opr = {code: "sqr", viewType: oc.VIEWTYPE_FUNCTION, shortName: "SQR"}
     *    opr.toFormula(["n"]) // SQR(n)
     * 
     * @param {*} operands may be an array or single parameter
     * @param {boolean} [shortFormat=true] wheither short or long name
     * @returns {string} text that looks like a formula
     * @memberof Operation
     * @throws can throw Error("Invalid number of operands") due to pre-validation of operands
     */
    toFormula(operands, shortFormat = true) {
        this.validate(...operands);

        switch (this.viewType) {
            // operator notation: "a + b + c"
            case oc.VIEWTYPE_OPERATOR:
                const concatStr = ` ${shortFormat ? this.shortName : this.name} `;
                if (operands.length > this.arity.max) {
                    // we can't get more params than maximal number of ones
                    return operands.slice(0, this.arity.max).join(concatStr);
                } else {
                    return operands.join(concatStr);
                }
                // functional notation: "max(a, b, c)"
            case oc.VIEWTYPE_FUNCTION:
                let data = operands;
                if (Array.isArray(operands)) {
                    // we can't get more params than maximal number of ones
                    if (operands.length > this.arity.max) {
                        data = operands.slice(0, this.arity.max);
                    }
                    data = data.join(', ');
                }
                return `${shortFormat ? this.shortName : this.name}(${data})`;
            default:
                return '';
        }
    }

    execute(...operands) {
        if (this.handler) {
            return this.handler(...operands);
        } else {
            return false;
        }
    }

    /**
     *
     *
     * @param {*} operands
     * @memberof Operation
     * Perform validation for a particular parameter set
     * @throws can throw Error("Invalid number of operands")
     * Uses custom validator if it is determined
     * If there is no validator, uses default validation
     * Custom validator MUST throw Error when params do not pass
     */
    validate(...operands) {
        this.validator ? this.validator(...operands) : this.validate_def(...operands);
    }

    /**
     *
     *
     * @param {*} operands
     * @memberof Operation
     * @throws can throw Error("Invalid number of operands")
     */
    validate_def(...operands) {
        // Calculate the number of operands
        let realNumberOf = Array.isArray(operands) ? operands.length : 1;

        // not enough parameters
        if (realNumberOf < this.arity.min) {
            throw new Error("Invalid number of operands");
        }
        if (this.viewType === oc.VIEWTYPE_OPERATOR) {
            // we need at least two operands: "operand1 operation operand2 [..operation operand3 [..]]"
            if (operands.length < 2) {
                throw new Error("Invalid number of operands");
            }
        }
    }

    /**
     *
     * Top-level function to calculate the result of the operation
     * Validates parameters and executes
     * @param {*} operands
     * @returns
     * @memberof Operation
     */
    perform(...operands) {
        this.validate(...operands);
        return this.execute(...operands);
    }
}

export default Operation;