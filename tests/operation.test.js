import oc from '../src/operconst';
import Operation from '../src/operation';

test('Checking default initialization', () => {
    let opr = new Operation();
    expect(opr).toHaveProperty('code', oc.OP_NONE);
    expect(opr).toHaveProperty('arity');
    expect(opr.arity).toEqual({ min: 2, max: 2 });
});

test('Checking explicit initialization', () => {
    let obj = {
        code: oc.OP_AND,
        arity: {
            max: 10
        },
        operandDataType: oc.DATATYPE_BOOLEAN,
        resultDataType: oc.DATATYPE_BOOLEAN,
        name: "test operation",
        shortName: "test"
    };
    let opr = new Operation(obj);
    expect(opr).toHaveProperty('code', oc.OP_AND);
    expect(opr).toHaveProperty('arity');
    expect(opr.arity).toEqual({ min: 2, max: 10 });
    expect(opr).toHaveProperty('name', "test operation");
    expect(opr).toHaveProperty('shortName', "test");
    expect(opr).toHaveProperty('resultDataType', oc.DATATYPE_BOOLEAN);
    expect(opr).toHaveProperty('operandDataType', oc.DATATYPE_BOOLEAN);
    // expect(opr).toEqual(obj);
});

test('Checking toJSON() method', () => {
    const operands = ["op1", "op2"];
    let opr = new Operation({ code: oc.OP_GE, arity: { max: 2 } });
    expect(opr.toJSON(operands)).toStrictEqual({
        [oc.OP_GE]: operands
    });

    opr = new Operation({ code: oc.OP_MAX, arity: { max: 1 } });
    expect(opr.toJSON(["op1", "op2"])).toStrictEqual({
        [oc.OP_MAX]: "op1"
    });
});

test('validate() with invalid operands', () => {
    const opr = new Operation({
        code: oc.OP_GT,
        arity: { min: 2 },
        viewType: oc.VIEWTYPE_OPERATOR,
        shortName: "gt"
    });
    expect(() => opr.validate("op1")).toThrowError("Invalid number of operands");

    opr.viewType = oc.VIEWTYPE_FUNCTION;
    // Nothing has to change, because we still use arity.min == 2
    expect(() => opr.validate("op1")).toThrowError("Invalid number of operands");
});

test('Checking toFormula() with extra number of operators', () => {
    const opr = new Operation({
        code: oc.OP_PLUS,
        shortName: "+",
        arity: { min: 2, max: 2 },
        viewType: oc.VIEWTYPE_OPERATOR
    });
    expect(opr.toFormula(["op1", "op2", "op3", "op4"])).toBe(`op1 + op2`);
    opr.shortName = 'add';
    opr.viewType = oc.VIEWTYPE_FUNCTION;
    expect(opr.toFormula(["op1", "op2", "op3", "op4"])).toBe(`add(op1, op2)`);
});

test('Checking toFormula() with operator view', () => {
    const opr = new Operation({
        code: oc.OP_GT,
        name: "is greater than",
        shortName: ">",
        arity: { min: 2 },
        viewType: oc.VIEWTYPE_OPERATOR
    });
    expect(opr.toFormula(["op1", "op2"])).toBe(`op1 > op2`);
    expect(opr.toFormula(["op1", "op2"], false)).toBe(`op1 is greater than op2`);
});

test('Checking toFormula() with function view', () => {
    const opr = new Operation({
        code: oc.OP_GT,
        shortName: "gt",
        arity: { min: 1, max: 5 },
        viewType: oc.VIEWTYPE_FUNCTION
    });
    // expect(opr.toFormula("op1", "op2", "op3")).toBe(`gt(op1, op2, op3)`);
    // Array with more than one item
    expect(opr.toFormula(["op1", "op2", "op3"])).toBe(`gt(op1, op2, op3)`);
    // Array with a single item
    expect(opr.toFormula(["op1"])).toBe(`gt(op1)`);
    // Non-array parameter, result must be identical with the previous one
    expect(opr.toFormula("op1")).toBe(`gt(op1)`);
});

test('Checking toJSON()', () => {
    const opr = new Operation({
        code: "some_code",
        arity: { min: 1, max: 5 },
    });

    expect(opr.toJSON(["op1", "op2", "op3"])).toEqual({ "some_code": ["op1", "op2", "op3"] });
    expect(opr.toJSON("op1")).toEqual({ "some_code": "op1" });
    opr.arity.max = 1;
    expect(opr.toJSON(["op1", "op2", "op3"])).toEqual({ "some_code": "op1" });
});

test('Testing execution handler', () => {
    const opr = new Operation({
        code: oc.OP_GT,
        shortName: "gt",
        arity: { min: 2, max: 2 },
        viewType: oc.VIEWTYPE_OPERATOR,
        handler: (...params) => params[0] > params[1]
    });

    expect(opr.perform(10, 5)).toBeTruthy();
    expect(opr.perform(10, 15)).toBeFalsy();
    expect(opr.perform(10, 10)).toBeFalsy();
});

test('Testing validation handler', () => {
    const opr = new Operation({
        code: oc.OP_GT,
        shortName: "gt",
        arity: { min: 2, max: 2 },
        viewType: oc.VIEWTYPE_OPERATOR,
        handler: (param1, param2) => param1 > param2,
        validator: (param1, param2) => {
            if (param1 <= 10) {
                throw new Error("invalid param1");
            }
        }
    });

    expect(() => opr.perform(10, 5)).toThrowError();
    expect(opr.perform(15, 10)).toBeTruthy();
});