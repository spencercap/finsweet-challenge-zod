import { doz } from './doz';

// test doz lib

// string
const dStr = doz.string();
const testStr = '123';
const parsedStr = dStr.parse(testStr);
console.log('parsedStr', parsedStr);

// number
const dNum = doz.number();
const testNum = 3.14;
const parsedNum = dNum.parse(testNum);
console.log('parsedNum', parsedNum);

// boolean
const dBool = doz.boolean();
const testBool = false;
// const testBool = 123;
const parsedBool = dBool.parse(testBool);
console.log('parsedBool', parsedBool);

// array 
const inArr = doz.array(doz.boolean());
const testArr = [true, false];
// const testArr = [true, 123];
const parsedArr = inArr.parse(testArr);
console.log('parsedArr', parsedArr);

// object 
const inObj = doz.object({
    name: doz.string(),
    age: doz.number(),
    isStudent: doz.boolean()
});
const testObj = {
    // name: 123,
    name: 'John',
    age: 25,
    isStudent: true
};
const parsedObj = inObj.parse(testObj);
console.log('parsedObj', parsedObj);

// infered type test
// const inferTypeTest: number = parsedObj.isStudent;

if (typeof parsedObj.isStudent === 'boolean') {
    console.log('parsedObj.isStudent is boolean');
}
