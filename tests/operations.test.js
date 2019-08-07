import oc from '../src/operconst';
import { operations } from '../src/operations';

test('default empty operation', () => {
    expect(operations.getEmpty()).toBeDefined()
});

test('Standard operation list', () => {
    expect(operations.list().length).toBeGreaterThan(1);
});

test('Adding a new operation', () => {
    const sample = {
        code: "test",
        name: "long_name",
        shortName: "xyz",
        arity: { min: 1, max: 10 },
        viewType: oc.VIEWTYPE_FUNCTION,
        resultDataType: oc.DATATYPE_BOOLEAN,
        operandDataType: oc.DATATYPE_NUMBER
    };
    operations.register(sample);
    const op = operations.get(sample.code);
    expect(op).toBeDefined();
    expect(op.code).toBe(sample.code);
    expect(op.name).toBe(sample.name);
    expect(op.shortName).toBe(sample.shortName);
    expect(op.arity).toEqual(sample.arity);
    expect(op.viewType).toBe(sample.viewType);
    expect(op.resultDataType).toBe(sample.resultDataType);
    expect(op.operandDataType).toBe(sample.operandDataType);
});

function getOperation(code) {
    const op = operations.get(code);
    expect(op).toBeDefined();
    return op;
}

test('Testing eq()', () => {
    const op = getOperation(oc.OP_EQ);
    expect(op.perform(5, 0)).toBeFalsy();
    expect(op.perform(1, 1)).toBeTruthy();
});

test('Testing ne()', () => {
    const op = getOperation(oc.OP_NE);
    expect(op.perform(0, 0)).toBeFalsy();
    expect(op.perform(5, 1)).toBeTruthy();
});

test('Testing gt()', () => {
    const op = getOperation(oc.OP_GT);
    expect(op.perform(-1, 0)).toBeFalsy();
    expect(op.perform(0, 0)).toBeFalsy();
    expect(op.perform(1, 0)).toBeTruthy();
});

test('Testing ge()', () => {
    const op = getOperation(oc.OP_GE);
    expect(op.perform(-1, 0)).toBeFalsy();
    expect(op.perform(0, 0)).toBeTruthy();
    expect(op.perform(1, 0)).toBeTruthy();
});

test('Testing lt()', () => {
    const op = getOperation(oc.OP_LT);
    expect(op.perform(1, 0)).toBeFalsy();
    expect(op.perform(0, 0)).toBeFalsy();
    expect(op.perform(-1, 0)).toBeTruthy();
});

test('Testing le()', () => {
    const op = getOperation(oc.OP_LE);
    expect(op.perform(1, 0)).toBeFalsy();
    expect(op.perform(0, 0)).toBeTruthy();
    expect(op.perform(-1, 0)).toBeTruthy();
});

test('Testing and()', () => {
    const op = getOperation(oc.OP_AND);
    expect(op.perform(true, false)).toBeFalsy();
    expect(op.perform(false, true)).toBeFalsy();
    expect(op.perform(false, false)).toBeFalsy();
    expect(op.perform(true, true)).toBeTruthy();
});

test('Testing or()', () => {
    const op = getOperation(oc.OP_OR);
    expect(op.perform(true, false)).toBeTruthy();
    expect(op.perform(false, true)).toBeTruthy();
    expect(op.perform(false, false)).toBeFalsy();
    expect(op.perform(true, true)).toBeTruthy();
});

test('Testing min()', () => {
    const op = getOperation(oc.OP_MIN);
    expect(op.perform(20, -1, 10)).toBe(-1);
    expect(op.perform(-1, -10)).toBe(-10);
});

test('Testing max()', () => {
    const op = getOperation(oc.OP_MAX);
    expect(op.perform(20, -1, 10)).toBe(20);
    expect(op.perform(-1, -20)).toBe(-1);
});

test('Testing sum()', () => {
    const op = getOperation(oc.OP_SUM);
    expect(op.perform(10, -1, 5)).toBe(14);
    expect(op.perform(0, -5)).toBe(-5);
});

test('Testing avg()', () => {
    const op = getOperation(oc.OP_AVG);
    expect(op.perform(10, -3, 5)).toBe(4);
    expect(op.perform(0, -5)).toBe(-2.5);
});

test('Testing plus()', () => {
    const op = getOperation(oc.OP_PLUS);
    expect(op.perform(10, -3, 5)).toBe(12);
    expect(op.perform(0, -5)).toBe(-5);
});

test('Testing minus()', () => {
    const op = getOperation(oc.OP_MINUS);
    expect(op.perform(10, -3, 5)).toBe(8);
    expect(op.perform(0, -3)).toBe(3);
});