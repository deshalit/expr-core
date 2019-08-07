import oc from './operconst';
import Operation from './operation';

/**
 *
 *
 * @class Operations defines a container for Operation objects
 * Contains set of basic operations "out of box" (+, -, sum(), avg() etc) 
 */
class Operations {
    constructor() {
        this._operlist = {};
        this._empty = new Operation({
            code: oc.OP_NONE,
            arity: { min: 1, max: 1 },
            name: "Undefined operation",
            shortName: "?"
        });
        this.registerStandardOperations();
    }

    list() {
        return Object.values(this._operlist);
    }

    get(code) {
        return (code === oc.OP_NONE) ? this._empty : this._operlist[code];
    }

    getEmpty() {
        return this._empty;
    }

    register(...objs) {
        objs.forEach(op => {
            this._operlist[op.code] = new Operation(op);
        });
    }

    // validate_cmp(...operands) {
    //     return (operands && operands.length === 2);
    // }

    eq(param1, param2) {
        return param1 === param2;
    }

    ne(param1, param2) {
        return param1 !== param2;
    }

    gt(param1, param2) {
        return param1 > param2;
    }

    ge(param1, param2) {
        return param1 >= param2;
    }

    lt(param1, param2) {
        return param1 < param2;
    }

    le(param1, param2) {
        return param1 <= param2;
    }

    minus(...params) {
        return params.slice(1).reduce((res, value) => res - value, params[0]);
    }

    plus(...params) {
        return params.reduce((res, value) => res + value, 0);
    }

    all(...params) {
        return params.every(param => !!param);
    }

    any(...params) {
        return params.some(param => !!param);
    }

    min(...nums) {
        let tmp = [...nums];
        tmp.sort((n1, n2) => n1 - n2);
        return tmp[0];
    }

    max(...nums) {
        let tmp = [...nums];
        tmp.sort((n1, n2) => n1 - n2);
        return tmp.pop();
    }

    sum(...nums) {
        return this.plus(...nums);
    }

    avg(...nums) {
        if (nums && nums.length) {
            return this.sum(...nums) / nums.length;
        }
        return 0;
    }

    registerStandardOperations() {
        this.register({
            code: oc.OP_GT,
            name: 'строго больше, чем',
            resultDataType: oc.DATATYPE_BOOLEAN,
            shortName: ">", // "\u003E"
            handler: this.gt
        }, {
            code: oc.OP_LT,
            name: 'строго меньше, чем',
            resultDataType: oc.DATATYPE_BOOLEAN,
            shortName: "<", // "\u003C"
            handler: this.lt
        }, {
            code: oc.OP_GE,
            name: 'больше либо равно',
            resultDataType: oc.DATATYPE_BOOLEAN,
            shortName: "≥", // "\u2265"
            handler: this.ge
        }, {
            code: oc.OP_LE,
            name: 'меньше либо равно',
            resultDataType: oc.DATATYPE_BOOLEAN,
            shortName: "≤", // "\u2264"
            handler: this.le
        }, {
            code: oc.OP_NE,
            name: 'не равно',
            resultDataType: oc.DATATYPE_BOOLEAN,
            shortName: "≠", // "\u2260"
            handler: this.ne
        }, {
            code: oc.OP_EQ,
            name: 'равно',
            resultDataType: oc.DATATYPE_BOOLEAN,
            shortName: "=",
            handler: this.eq
        }, {
            code: oc.OP_AND,
            name: 'и', //'выполняются все условия',
            shortName: "и",
            arity: { min: 2, max: oc.MAX_CONDITIONS },
            operandDataType: oc.TYPE_BOOLEAN,
            resultDataType: oc.DATATYPE_BOOLEAN,
            handler: this.all
        }, {
            code: oc.OP_OR,
            name: 'или', //'выполняется хотя бы одно из условий',
            shortName: "или",
            arity: { min: 2, max: oc.MAX_CONDITIONS },
            operandDataType: oc.TYPE_BOOLEAN,
            resultDataType: oc.DATATYPE_BOOLEAN,
            handler: this.any
        }, {
            code: oc.OP_MINUS,
            name: 'минус',
            shortName: "-",
            arity: { min: 2, max: oc.MAX_PARAMS },
            resultDataType: oc.DATATYPE_NUMBER,
            handler: this.minus
        }, {
            code: oc.OP_PLUS,
            name: 'плюс',
            shortName: "+",
            arity: { min: 2, max: oc.MAX_PARAMS },
            resultDataType: oc.DATATYPE_NUMBER,
            handler: this.plus
        }, {
            code: oc.OP_MIN,
            name: 'минимум',
            shortName: "min",
            resultDataType: oc.DATATYPE_NUMBER,
            arity: { min: 1, max: oc.MAX_PARAMS },
            operandDataType: oc.DATATYPE_NUMBER,
            viewType: oc.VIEWTYPE_FUNCTION,
            handler: this.min
        }, {
            code: oc.OP_MAX,
            name: 'максимум',
            shortName: "max",
            resultDataType: oc.DATATYPE_NUMBER,
            arity: { min: 1, max: oc.MAX_PARAMS },
            operandDataType: oc.DATATYPE_NUMBER,
            viewType: oc.VIEWTYPE_FUNCTION,
            handler: this.max
        }, {
            code: oc.OP_SUM,
            name: 'сумма значений из набора',
            shortName: "SUM",
            resultDataType: oc.DATATYPE_NUMBER,
            arity: { min: 1, max: oc.MAX_PARAMS },
            operandDataType: oc.DATATYPE_NUMBER,
            viewType: oc.VIEWTYPE_FUNCTION,
            handler: this.sum.bind(this)
        }, {
            code: oc.OP_AVG,
            name: 'среднее значение из набора',
            shortName: "AVG",
            resultDataType: oc.DATATYPE_NUMBER,
            arity: { min: 1, max: oc.MAX_PARAMS },
            operandDataType: oc.DATATYPE_NUMBER,
            viewType: oc.VIEWTYPE_FUNCTION,
            handler: this.avg.bind(this)
        });
    }
}

const operations = new Operations();
export { Operations, operations }