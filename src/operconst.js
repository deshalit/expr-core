const operconst = {
    MAX_CONDITIONS: 10,

    MAX_PARAMS: 10,

    DATATYPE_BOOLEAN: 'bool',
    DATATYPE_NUMBER: 'numb',
    // TYPE_ARRAY: 'arr',

    VIEWTYPE_OPERATOR: "op",
    VIEWTYPE_FUNCTION: "fn",

    // operation codes
    OP_NONE: 'none', // default code

    // codes for operations of TYPE_NUMBER
    OP_GT: 'gt', // >
    OP_GE: 'ge', // >=
    OP_LT: 'lt', // <
    OP_LE: 'le', // <=
    OP_EQ: 'eq', //:=
    OP_NE: 'ne', // !=
    OP_PLUS: 'plus',
    OP_MINUS: 'minus',

    OP_MIN: 'min', // минимальное значение 
    OP_MAX: 'max', // максимальное значение 
    OP_AVG: 'avg', // среднее значение 
    OP_SUM: 'sum',

    // codes for operations of TYPE_BOOLEAN
    OP_AND: 'and',
    OP_OR: 'or'
};

export default operconst;