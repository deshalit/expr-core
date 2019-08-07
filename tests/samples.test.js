import oc from '../src/operconst';
import Expression from '../src/expression';
import { samples } from '../src/samples';
import { dumbStorage, setStorage } from '../src/samplestorage';

beforeAll(() => {
    setStorage(dumbStorage);
});

test('Adding/deleting a sample', async() => {
    const ex = Expression.create(oc.OP_GT, Expression.createPrimitive(10), Expression.createPrimitive(5));

    let id = await samples.add("test exp", ex);
    expect(id).toBeDefined();
    expect(id.length).toBeGreaterThan(0);
    let sample = samples.getById(id);
    expect(sample).toBeDefined();
    expect(sample.name).toBe("test exp");

    let deleted = await samples.del(id);
    expect(deleted).toBeTruthy();
    sample = samples.getById(id);
    expect(sample).toBeUndefined();
});

test('Adding a samples, then readAll() ', async() => {
    // create a boolean expression    
    let ex = Expression.create(oc.OP_GT, Expression.createPrimitive(10), Expression.createPrimitive(5));
    let id_bool = await samples.add("test_readAll_bool", ex);
    ex = Expression.create(oc.OP_PLUS, Expression.createPrimitive(10), Expression.createPrimitive(5));
    // create a numeric expression
    let id_numb = await samples.add("test_readAll_numb", ex);

    // re-read the storage
    let res = await samples.readAll();
    expect(res).toBeTruthy();

    // checking the presence of the last two expressions
    let sample = samples.getById(id_bool);
    expect(sample).toBeDefined();
    expect(sample.name).toBe("test_readAll_bool");
    sample = samples.getById(id_numb);
    expect(sample).toBeDefined();
    expect(sample.name).toBe("test_readAll_numb");

    // there should be at least 2 samples
    expect(samples.ids().length).toBeGreaterThan(1);

    // there should be at least 1 sample of boolean type
    let bool_ids = samples.ids(oc.DATATYPE_BOOLEAN);
    expect(bool_ids.length).toBeGreaterThan(0);

    // there should be at least 1 sample of numeric type
    let numb_ids = samples.ids(oc.DATATYPE_NUMBER);
    expect(numb_ids.length).toBeGreaterThan(0);
});