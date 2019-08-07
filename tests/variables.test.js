import { variables } from '../src/variables';

test('Checking new var present', () => {
    variables.addVar("NewTestVar", "Long Name", "ShortName");
    expect(variables.isVar("NewTestVar")).toBeTruthy();
});

test('Checking name of new var', () => {
    const longName = "Long Name 1";
    variables.addVar("NewTestVar1", longName, "ShortName1");
    expect(variables.varName("NewTestVar1")).toBe(longName);
});

test('Checking formula', () => {
    const longName = "Long Name 2",
        shortName = "ShortName2";
    variables.addVar("NewTestVar2", longName, shortName);
    expect(variables.formula("NewTestVar2")).toBe(shortName);
    expect(variables.formula("NewTestVar2", false)).toBe(longName);
});

test('Checking clearing', () => {
    variables.addVar("NewTestVar3", "sdfgdg", "sfdsgdfg");
    variables.clear();
    expect(variables.isVar("NewTestVar3")).toBeFalsy();
});

test('Checking options without selected value', () => {
    variables.clear();
    variables.addVar("NewTestVar1", "Long Name 1", "");
    variables.addVar("NewTestVar2", "Long Name 2", "");
    let sample = [
        `<option value="NewTestVar1">Long Name 1</option>`,
        `<option value="NewTestVar2">Long Name 2</option>`
    ];
    expect(variables.getHTMLoptions()).toEqual(sample);
});

test('Checking options with selected value', () => {
    variables.clear();
    variables.addVar("NewTestVar1", "Long Name 1", "");
    variables.addVar("NewTestVar2", "Long Name 2", "");
    let sample = [
        `<option value="NewTestVar1">Long Name 1</option>`,
        `<option selected value="NewTestVar2">Long Name 2</option>`
    ];
    expect(variables.getHTMLoptions("NewTestVar2")).toEqual(sample);
});

test('Evaluating', () => {
    variables.addVar('test', 'evaluator_test', 'evt', () => 200);
    expect(variables.evaluate('test')).toBe(200);
});