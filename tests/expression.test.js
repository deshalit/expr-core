import oc from '../src/operconst';
import Expression from "../src/expression";
import { variables } from '../src/variables';
import { operations } from '../src/operations';

test('Constructing default expression', () => {
    const ex = new Expression();
    expect(ex.operation.code).toBe(oc.OP_NONE);
    expect(ex.isNone()).toBeTruthy();
    expect(ex.operands).toEqual([]);
});

test('Primitive expressions', () => {
    const ex1 = Expression.createPrimitive(5);
    expect(ex1.isPrimitive()).toBeTruthy();
    expect(ex1.isNone()).toBeFalsy();
    expect(ex1.isVar()).toBeFalsy();

    variables.addVar("primitive", "", "");
    const ex2 = Expression.createPrimitive("primitive");
    expect(ex2.isPrimitive()).toBeTruthy();
    expect(ex2.isNone()).toBeFalsy();
    expect(ex2.isVar()).toBeTruthy();
});

test('Evaluating simple expressions', () => {
    const ex1 = Expression.createPrimitive(5);
    expect(ex1.evaluate()).toBe(5);
    const ex2 = Expression.createPrimitive(-5);
    const ex = Expression.create(oc.OP_PLUS, ex1, ex2);
    expect(ex.operation.code).toBe(oc.OP_PLUS);
    expect(ex.evaluate()).toBe(0);
});

test('Evaluate() with variable', () => {
    variables.addVar("test", "", "", () => 10);
    const ex1 = Expression.createPrimitive(5);
    const ex2 = Expression.createPrimitive("test");
    expect(ex2.evaluate()).toBe(10);
    const ex = Expression.create(oc.OP_PLUS, ex1, ex2);
    expect(ex.evaluate()).toBe(15);
});

test('Export to JSON format', () => {
    variables.addVar("test_json", "", "", () => 10);
    const ex1 = Expression.createPrimitive(5);
    const ex2 = Expression.createPrimitive("test_json");
    const ex = Expression.create(oc.OP_MINUS, ex1, ex2);
    expect(ex.toJSON()).toEqual({
        [oc.OP_MINUS]: [5, "test_json"]
    });
    const ex3 = Expression.create(oc.OP_GT, ex, Expression.createPrimitive(0));
    expect(ex3.toJSON()).toEqual({
        [oc.OP_GT]: [ex.toJSON(), 0]
    });
});

test('Import from JSON format', () => {
    const var_name = "test_json_import";
    variables.addVar(var_name, "", "");
    const json = {
        [oc.OP_GT]: [{
            [oc.OP_MINUS]: [5, var_name]
        }, 0]
    };
    let ex = new Expression();
    ex.fromJSON(json);
    expect(ex.operation.code).toBe(oc.OP_GT);
    expect(ex.operands.length).toBe(2);
    let ex1 = ex.operands[0];
    expect(ex1.operation.code).toBe(oc.OP_MINUS);
    expect(ex1.operands.length).toBe(2);
    expect(ex1.operands[0].operands[0]).toBe(5);
    expect(ex1.operands[1].operands[0]).toBe(var_name);
    expect(ex.operands[1].operands[0]).toBe(0);
});

test('Import and export from/to JSON format', () => {
    const var_name = "test_json_import1";
    variables.addVar(var_name, "", "");
    const json1 = {
        [oc.OP_GT]: [{
            [oc.OP_MINUS]: [5, var_name]
        }, 0]
    };
    let ex = new Expression();
    ex.fromJSON(json1);
    const json2 = ex.toJSON();
    expect(json1).toEqual(json2);
})

test('copyFrom() test', () => {
    variables.addVar("some_var", "longname", "shortname");
    let ex1 = Expression.create(oc.OP_MAX, Expression.createPrimitive(5), Expression.createPrimitive("some_var"));
    let ex2 = Expression.copyFrom(ex1);
    expect(ex2.operation.code).toBe(oc.OP_MAX);
    expect(ex2.operands[0].operands[0]).toBe(5);
    expect(ex2.operands[1].operands[0]).toBe("some_var");
});

test('createFromString() positive test', () => {
    const varName1 = "some_var1",
        varName2 = "some_var2";
    variables.addVar(varName1, "longname1", "shortname1");
    variables.addVar(varName2, "longname2", "shortname2");
    const str = `{"${oc.OP_EQ}": [{"${oc.OP_MINUS}": ["${varName1}", 2]}, {"${oc.OP_PLUS}": ["${varName2}", 10]}]}`;
    const ex = Expression.createFromString(str);
    expect(ex).toBeDefined();
    expect(ex.operation.code).toBe(oc.OP_EQ);
    expect(ex.operands.length).toBe(2);
    let ex1 = ex.operands[0];
    expect(ex1.operation.code).toBe(oc.OP_MINUS);
    expect(ex1.operands[0].operands[0]).toBe(varName1);
    expect(ex1.operands[1].operands[0]).toBe(2);
    ex1 = ex.operands[1];
    expect(ex1.operation.code).toBe(oc.OP_PLUS);
    expect(ex1.operands[0].operands[0]).toBe(varName2);
    expect(ex1.operands[1].operands[0]).toBe(10);
});

test('createFromString negative test', () => {
    const str = `{"${operations.get(oc.OP_MINUS)}": 20}`;
    expect(() => Expression.createFromString(str)).toThrowError("Invalid operation");
    const str1 = `{}`;
    expect(() => Expression.createFromString(str1)).toThrowError("Invalid json");
});

test('formula() testing', () => {
    const varName1 = "some_var1",
        varName2 = "some_var2";
    variables.addVar(varName1, "param1", "p1");
    variables.addVar(varName2, "param2", "p2");
    const str = `{"${oc.OP_EQ}": [{"${oc.OP_MINUS}": ["${varName1}", 2]}, {"${oc.OP_PLUS}": ["${varName2}", 10]}]}`;
    const ex = Expression.createFromString(str);
    const opPlus = operations.get(oc.OP_PLUS);
    const opMinus = operations.get(oc.OP_MINUS);
    const opEqual = operations.get(oc.OP_EQ);
    expect(ex.formula()).toBe(`((${variables.varName(varName1, false)} ${opMinus.shortName} 2) ${opEqual.shortName} (${variables.varName(varName2, false)} ${opPlus.shortName} 10))`);
    expect(ex.formula(false)).toBe(`((${variables.varName(varName1)} ${opMinus.name} 2) ${opEqual.name} (${variables.varName(varName2)} ${opPlus.name} 10))`);
});

test('Calling isValid() for valid expression', () => {
    let ex = new Expression(operations.get(oc.OP_MINUS), Expression.createPrimitive(20), Expression.createPrimitive((10)));
    expect(ex.isValid()).toBeTruthy();
});

test('Calling isValid() for invalid expression', () => {
    // Invalid expression: lack of operands
    let ex = new Expression(operations.get(oc.OP_MINUS), Expression.createPrimitive(20));
    expect(ex.isValid()).toBeFalsy();
});

test('quickFormula() testing', () => {
    const varName1 = "some_var1",
        varName2 = "some_var2";
    variables.addVar(varName1, "param1", "p1");
    variables.addVar(varName2, "param2", "p2");
    const opPlus = operations.get(oc.OP_PLUS);
    const opMinus = operations.get(oc.OP_MINUS);
    const opGT = operations.get(oc.OP_GT);
    const src = `{"${oc.OP_GT}": [{"${oc.OP_MINUS}": ["${varName1}", 2]}, {"${oc.OP_PLUS}": ["${varName2}", 10]}]}`;
    expect(Expression.quickFormula(src)).toBe(`((${variables.varName(varName1, false)} ${opMinus.shortName} 2) ${opGT.shortName} (${variables.varName(varName2, false)} ${opPlus.shortName} 10))`);
    expect(Expression.quickFormula(src, false)).toBe(`((${variables.varName(varName1)} ${opMinus.name} 2) ${opGT.name} (${variables.varName(varName2)} ${opPlus.name} 10))`);
});