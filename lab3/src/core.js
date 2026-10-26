/**
 * Напишите функцию, которая проверяет, является ли число целым используя побитовые операторы
 * @param {*} n
 */
const isInteger = (n) => (n | 0) === n;

/**
 * Напишите функцию, которая возвращает массив четных чисел от 2 до 20 включительно
 */
const even = () => Array.from({length: 10}, (_, i) => (i + 1) * 2);

/**
 * Напишите функцию, считающую сумму чисел до заданного используя цикл
 * @param {*} n
 */
const sumTo = (n) => {
    let sum = 0;
    for (let i = 1; i <= n; i++) sum += i;
    return sum;
};

/**
 * Напишите функцию, считающую сумму чисел до заданного используя рекурсию
 * @param {*} n
 */
const recSumTo = (n) => (n <= 0 ? 0 : n + recSumTo(n - 1));

/**
 * Напишите функцию, считающую факториал заданного числа
 * @param {*} n
 */
const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

/**
 * Напишите функцию, которая определяет, является ли число двойкой, возведенной в степень
 * @param {*} n
 */
const isBinary = (n) => n > 0 && (n & (n - 1)) === 0;

/**
 * Напишите функцию, которая находит N-е число Фибоначчи
 * @param {*} n
 */
const fibonacci = (n, a = 0, b = 1) =>
    n <= 0 ? a : fibonacci(n - 1, b, a + b);

/** Напишите функцию, которая принимает начальное значение и функцию операции
 * и возвращает функцию - выполняющую эту операцию.
 * Если функция операции (operatorFn) не задана - по умолчанию всегда
 * возвращается начальное значение (initialValue)
 * @param initialValue
 * @param operatorFn - (storedValue, newValue) => {operation}
 * @example
 * const sumFn =  getOperationFn(10, (a,b) => a + b);
 * console.log(sumFn(5)) - 15
 * console.log(sumFn(3)) - 18
 */
const getOperationFn = (initialValue, operatorFn) => {
    let storedValue = initialValue;
    return (newValue) =>
        operatorFn
            ? (storedValue = operatorFn(storedValue, newValue))
            : storedValue;
};

/**
 * Напишите функцию создания генератора арифметической последовательности.
 * При ее вызове, она возвращает новую функцию генератор - generator().
 * Каждый вызов функции генератора возвращает следующий элемент последовательности.
 * Если начальное значение не передано, то оно равно 0.
 * Если шаг не указан, то по дефолту он равен 1.
 * Генераторов можно создать сколько угодно - они все независимые.
 *
 * @param {number} start - число с которого начинается последовательность
 * @param {number} step  - число шаг последовательности
 * @example
 * const generator = sequence(5, 2);
 * console.log(generator()); // 5
 * console.log(generator()); // 7
 * console.log(generator()); // 9
 */
const sequence = (start = 0, step = 1) => {
    let current = start - step;
    return () => (current += step);
};

const isObject = (value) => typeof value === 'object' && value !== null;

/**
 * Напишите функцию deepEqual, которая принимает два значения
 * и возвращает true только в том случае, если они имеют одинаковое значение
 * или являются объектами с одинаковыми свойствами,
 * значения которых также равны при сравнении с рекурсивным вызовом deepEqual.
 * Учитывать специфичные объекты(такие как Date, RegExp и т.п.) не обязательно
 *
 * @param {object} firstObject - первый объект
 * @param {object} secondObject - второй объект
 * @returns {boolean} - true если объекты равны(по содержанию) иначе false
 * @example
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 33], text: 'text'}) // true
 * deepEqual({arr: [22, 33], text: 'text'}, {arr: [22, 3], text: 'text2'}) // false
 */
const deepEqual = (firstObject, secondObject) => {
    if (
        firstObject === secondObject ||
        (Number.isNaN(firstObject) && Number.isNaN(secondObject))
    ) {
        return true;
    }

    if (
        !isObject(firstObject) ||
        !isObject(secondObject) ||
        Array.isArray(firstObject) !== Array.isArray(secondObject)
    ) {
        return false;
    }

    const firstKeys = Object.keys(firstObject);
    const secondKeys = Object.keys(secondObject);

    return (
        firstKeys.length === secondKeys.length &&
        firstKeys.every(
            (key) =>
                key in secondObject &&
                deepEqual(firstObject[key], secondObject[key])
        )
    );
};

module.exports = {
    isInteger,
    even,
    sumTo,
    recSumTo,
    factorial,
    isBinary,
    fibonacci,
    getOperationFn,
    sequence,
    deepEqual,
};
