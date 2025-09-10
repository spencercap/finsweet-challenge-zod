import { doz, DozString, DozNumber, DozBoolean } from './doz';

console.log('=== Doz Class-Based Validation Library Demo ===\n');

// 1. Basic primitive validation using the doz factory functions
console.log('1. Basic Primitive Validation:');
const dStr = doz.string();
const testStr = '123';
const parsedStr = dStr.parse(testStr);
console.log('parsedStr:', parsedStr, typeof parsedStr);

const dNum = doz.number();
const testNum = 3.14;
const parsedNum = dNum.parse(testNum);
console.log('parsedNum:', parsedNum, typeof parsedNum);

const dBool = doz.boolean();
const testBool = false;
const parsedBool = dBool.parse(testBool);
console.log('parsedBool:', parsedBool, typeof parsedBool);
console.log();

// 2. Direct class instantiation (alternative approach)
console.log('2. Direct Class Instantiation:');
const stringSchema = new DozString();
const numberSchema = new DozNumber();
const booleanSchema = new DozBoolean();

const directString = stringSchema.parse('Hello World');
const directNumber = numberSchema.parse(42);
const directBoolean = booleanSchema.parse(true);

console.log('Direct string:', directString);
console.log('Direct number:', directNumber);
console.log('Direct boolean:', directBoolean);
console.log();

// 3. Array validation
console.log('3. Array Validation:');
const booleanArraySchema = doz.array(doz.boolean());
const testArr = [true, false, true];
const parsedArr = booleanArraySchema.parse(testArr);
console.log('parsedArr:', parsedArr);
console.log('Array type check:', Array.isArray(parsedArr));
console.log();

// 4. Object validation with type inference
console.log('4. Object Validation with Type Inference:');
const userSchema = doz.object({
    name: doz.string(),
    age: doz.number(),
    isStudent: doz.boolean(),
    hobbies: doz.array(doz.string())
});

const testUser = {
    name: 'John Doe',
    age: 25,
    isStudent: true,
    hobbies: ['coding', 'reading', 'gaming']
};

const parsedUser = userSchema.parse(testUser);
console.log('parsedUser:', parsedUser);

// Type inference demonstration
console.log('parsedUser Type inference:');
console.log('parsedUser.name type:', typeof parsedUser.name);
console.log('parsedUser.age type:', typeof parsedUser.age);
console.log('parsedUser.isStudent type:', typeof parsedUser.isStudent);
console.log('parsedUser.hobbies type:', typeof parsedUser.hobbies);
console.log('parsedUser.hobbies is array:', Array.isArray(parsedUser.hobbies));
console.log();

// 5. Complex nested object validation
console.log('5. Complex Nested Object Validation:');
const addressSchema = doz.object({
    street: doz.string(),
    city: doz.string(),
    zipCode: doz.string(),
    coordinates: doz.object({
        lat: doz.number(),
        lng: doz.number()
    })
});

const companySchema = doz.object({
    name: doz.string(),
    address: addressSchema,
    employees: doz.array(doz.number())
});

const testCompany = {
    name: 'Tech Corp',
    address: {
        street: '123 Main St',
        city: 'San Francisco',
        zipCode: '94105',
        coordinates: {
            lat: 37.7749,
            lng: -122.4194
        }
    },
    employees: [1, 2, 3, 4, 5]
};

const parsedCompany = companySchema.parse(testCompany);
console.log('parsedCompany:', JSON.stringify(parsedCompany, null, 2));
console.log();

// 6. Error handling examples
console.log('6. Error Handling Examples:');
try {
    doz.string().parse(123);
} catch (error) {
    console.log('String validation error:', (error as Error).message);
}

try {
    doz.number().parse('not a number');
} catch (error) {
    console.log('Number validation error:', (error as Error).message);
}

try {
    doz.object({
        name: doz.string(),
        age: doz.number()
    }).parse({
        name: 'John',
        age: '25' // Wrong type
    });
} catch (error) {
    console.log('Object validation error:', (error as Error).message);
}

try {
    doz.object({
        name: doz.string(),
        age: doz.number()
    }).parse({
        name: 'John'
        // Missing age property
    });
} catch (error) {
    console.log('Missing property error:', (error as Error).message);
}
console.log();

// 7. Schema composition and reusability
console.log('7. Schema Composition and Reusability:');

// Better approach: create a function that returns a schema
const createUserSchema = (includeAdminFields = false) => {
    const baseSchema = {
        id: doz.number(),
        name: doz.string(),
        email: doz.string()
    };
    
    if (includeAdminFields) {
        return doz.object({
            ...baseSchema,
            permissions: doz.array(doz.string()),
            isAdmin: doz.boolean()
        });
    }
    
    return doz.object(baseSchema);
};

const regularUser = createUserSchema(false);
const adminUser = createUserSchema(true);

const testRegularUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
};

const testAdminUser = {
    id: 2,
    name: 'Admin User',
    email: 'admin@example.com',
    permissions: ['read', 'write', 'delete'],
    isAdmin: true
};

const parsedRegularUser = regularUser.parse(testRegularUser);
const parsedAdminUser = adminUser.parse(testAdminUser);

console.log('Regular user:', parsedRegularUser);
console.log('Admin user:', parsedAdminUser);
console.log();

// 8. Type safety demonstration
console.log('8. Type Safety Demonstration:');
// This will show TypeScript type inference in action
const user = parsedUser;
console.log('User name (string):', user.name.toUpperCase());
console.log('User age (number):', user.age + 10);
console.log('User is student (boolean):', user.isStudent ? 'Yes' : 'No');
console.log('User hobbies (string[]):', user.hobbies.join(', '));

// TypeScript will catch this at compile time:
// user.age.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'number'
// user.name + 10; // This would work but is not type-safe

console.log('\n=== Demo Complete ===');