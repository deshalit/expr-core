import oc from './operconst';
import { operations } from './operations';
import { variables } from './variables';
import Operation from './operation';

class Expression {
    constructor(operation = null, ...operands) {
        this.operation = operation || operations.getEmpty();
        this.operands = operands;
    }

    static create(operCode = oc.OP_NONE, ...operands) {
        return new Expression(operations.get(operCode), ...operands);
    }

    static createPrimitive(operand) {
        const op = operations.getEmpty();
        op.resultDataType = oc.DATATYPE_NUMBER;
        return new Expression(op, operand);
    }

    evaluate() {
        // non-recursive part: if we have a primitive expression
        // then we take the first operand and consider two options: 
        // 1. it is a variable, then we call variables.evaluate()
        // 2. it is not a variable, then it is a number
        if (this.isPrimitive()) {
            return this.operands.length ? (
                this.isVar() ? variables.evaluate(this.operands[0]) : this.operands[0]
            ) : null;
        }
        let operandValues = [];
        if (this.operands.every(op => {
                let res = op.evaluate();
                if (res !== null) {
                    operandValues.push(res);
                    return true;
                }
                return false;
            })) {
            return this.operation.perform(...operandValues);
        }
        return null;
    }

    isPrimitive() {
        return this.operation.code === oc.OP_NONE && this.operation.resultDataType === oc.DATATYPE_NUMBER;
    }

    isVar() {
        return this.isPrimitive() && variables.isVar(this.operands[0]);
    }

    isNone() {
        return this.operation.code === oc.OP_NONE && !this.operation.resultDataType;
    }

    isValid() {
        let ok = this.isPrimitive();
        if (!this.isNone() && !ok) {
            let count = this.operands.length;
            if ((count >= this.operation.arity.min) && (count <= this.operation.arity.max)) {
                try {
                    this.operation.validate(...this.operands);
                } catch (e) {
                    ok = false;
                }
                ok = this.operands.every(op => op.isValid());
            }
        }
        return ok;
    }

    formula(shortFormat = true) {
        if (this.isPrimitive()) {
            let text = this.operands[0];
            return variables.isVar(text) ? variables.formula(text, shortFormat) : text;
        } else if (this.isNone()) {
            return "<не задано>";
        } else {
            let operands = this.operands.map(op => op.formula(shortFormat));
            return `(${this.operation.toFormula(operands, shortFormat)})`;
        }
    }

    static copyFrom(another) {
        return new Expression().fromJSON(another.toJSON());
    }

    toJSON() {
        if (this.isPrimitive()) {
            return this.operands[0];
        } else if (this.isNone()) {
            return ""
        } else {
            let operands = this.operands.map(op => op.toJSON());
            return this.operation.toJSON(operands);
        }
    }

    fromJSON(json) {
        const scanJSON = function(src) {
            if (src === "") {
                return [operations.getEmpty(), [src]];
            }
            if (typeof(src) === 'string' || typeof(src) === 'number') {
                const op = new Operation({ resultDataType: oc.DATATYPE_NUMBER });
                return [op, [src]];
            }
            // src looks like {"code": [expr1, expr2]} 
            let opCodes = Object.keys(src); // ["code"]
            if (opCodes.length > 0) {
                let opCode = opCodes[0]; // "code"
                let operation = operations.get(opCode);
                if (operation) {
                    let opList = src[opCode]; // [expr1, expr2]
                    // should we assume opList as array?
                    let operands = [];
                    if (operation.arity.max > 1 && opList.length) {
                        let inner_operands = [];
                        let inner_opr = null;
                        operands = opList.map(item => {
                            [inner_opr, inner_operands] = scanJSON(item);
                            return new Expression(inner_opr, ...inner_operands);
                        })
                    } else {
                        operands = opList.length ? opList : [opList];
                    }
                    // let operands = (operation.arity.max > 1) ? opList.map(item => new Expression(...scanJSON(item))) : [opList];
                    return [operation, operands];
                }
                throw Error('Invalid operation');
            }
            throw Error('Invalid json');
        };
        [this.operation, this.operands] = scanJSON(json);
        return this;
    }

    static createFromString(src) {
        let res = new Expression();
        if (src) {
            res.fromJSON(JSON.parse(src));
        }
        return res;
    }

    static quickFormula(src, shortFormat = true) {
        return src ? Expression.createFromString(src).formula(shortFormat) : "";
    }
}

export default Expression;