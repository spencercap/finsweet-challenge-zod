# Doz - Type-Safe Data Validation Library

_FYI: this is a clone of [zod](https://zod.dev/) for the finsweet interview's coding challenge_

A lightweight TypeScript library for runtime type validation and parsing of unknown data structures.

## Overview

Doz provides a simple, class-based API for validating and parsing data at runtime. It's designed to help you safely handle unknown data (like JSON from APIs or user input from Forms or other places) by providing type-safe validation with clear error messages.

## Features

- **Type-safe validation**: Ensure data matches expected types at runtime
- **Clear error messages**: Detailed error reporting with context information
- **Class-based API**: Simple, composable validation classes
- **TypeScript support**: Full type inference and type safety
- **Lightweight**: Minimal dependencies and small bundle size

## Installation

This is a local project. The library is located in `src/doz.ts`.

## API Reference

### Core Functions

#### `doz.string()`
Creates a string parser that validates input is a string.

```typescript
const stringParser = doz.string();
const result = stringParser.parse("hello"); // Returns: "hello"
stringParser.parse(123); // Throws: Expected string, but received number
```

#### `doz.number()`
Creates a number parser that validates input is a number.

```typescript
const numberParser = doz.number();
const result = numberParser.parse(42); // Returns: 42
numberParser.parse("42"); // Throws: Expected number, but received string
```

#### `doz.boolean()`
Creates a boolean parser that validates input is a boolean.

```typescript
const booleanParser = doz.boolean();
const result = booleanParser.parse(true); // Returns: true
booleanParser.parse("true"); // Throws: Expected boolean, but received string
```

#### `doz.array(schema)`
Creates an array parser that validates all elements match the provided schema.

```typescript
const stringArrayParser = doz.array(doz.string());
const result = stringArrayParser.parse(["a", "b", "c"]); // Returns: ["a", "b", "c"]
stringArrayParser.parse(["a", 123]); // Throws: Expected string, but received number
```

#### `doz.object(schema)`
Creates an object parser that validates object properties match the provided schema.

```typescript
const userParser = doz.object({
  name: doz.string(),
  age: doz.number(),
  isActive: doz.boolean()
});

const result = userParser.parse({
  name: "John",
  age: 30,
  isActive: true
}); // Returns: { name: "John", age: 30, isActive: true }

userParser.parse({
  name: "John",
  age: "30" // Wrong type
}); // Throws: Expected number, but received string (for property: 'age')
```

## Usage Examples

### Two Approaches to Creating Schemas

Doz provides two ways to create and use schemas, both offering the same functionality:

1. **Factory Function Approach** (Recommended): Uses the `doz` object with methods like `doz.string()`, `doz.number()`, etc.
2. **Direct Class Instantiation**: Directly instantiate classes like `new DozString()`, `new DozNumber()`, etc.

Both approaches provide identical functionality and type safety. Choose the one that fits your coding style and project preferences.

### Basic Type Validation

#### Factory Function Approach (Recommended)
```typescript
import { doz } from './src/doz';

// Validate a string
const name = doz.string().parse(userInput);

// Validate a number
const count = doz.number().parse(data.count);

// Validate a boolean
const enabled = doz.boolean().parse(config.enabled);
```

#### Direct Class Instantiation
```typescript
import { DozString, DozNumber, DozBoolean } from './src/doz';

// Validate a string
const stringSchema = new DozString();
const name = stringSchema.parse(userInput);

// Validate a number
const numberSchema = new DozNumber();
const count = numberSchema.parse(data.count);

// Validate a boolean
const booleanSchema = new DozBoolean();
const enabled = booleanSchema.parse(config.enabled);
```

### Array Validation

#### Factory Function Approach
```typescript
// Validate an array of strings
const tags = doz.array(doz.string()).parse(data.tags);

// Validate an array of numbers
const scores = doz.array(doz.number()).parse(data.scores);
```

#### Direct Class Instantiation
```typescript
import { DozArray, DozString, DozNumber } from './src/doz';

// Validate an array of strings
const stringArraySchema = new DozArray(new DozString());
const tags = stringArraySchema.parse(data.tags);

// Validate an array of numbers
const numberArraySchema = new DozArray(new DozNumber());
const scores = numberArraySchema.parse(data.scores);
```

### Object Validation

#### Factory Function Approach
```typescript
// Define a user schema
const userSchema = doz.object({
  id: doz.number(),
  name: doz.string(),
  email: doz.string(),
  isVerified: doz.boolean(),
  tags: doz.array(doz.string())
});

// Parse user data
const user = userSchema.parse(apiResponse);
```

#### Direct Class Instantiation
```typescript
import { DozObject, DozNumber, DozString, DozBoolean, DozArray } from './src/doz';

// Define a user schema
const userSchema = new DozObject({
  id: new DozNumber(),
  name: new DozString(),
  email: new DozString(),
  isVerified: new DozBoolean(),
  tags: new DozArray(new DozString())
});

// Parse user data
const user = userSchema.parse(apiResponse);
```

### Nested Object Validation

#### Factory Function Approach
```typescript
// Define nested schemas
const addressSchema = doz.object({
  street: doz.string(),
  city: doz.string(),
  zipCode: doz.string()
});

const userSchema = doz.object({
  name: doz.string(),
  address: addressSchema,
  phoneNumbers: doz.array(doz.string())
});

const user = userSchema.parse(userData);
```

#### Direct Class Instantiation
```typescript
import { DozObject, DozString, DozArray } from './src/doz';

// Define nested schemas
const addressSchema = new DozObject({
  street: new DozString(),
  city: new DozString(),
  zipCode: new DozString()
});

const userSchema = new DozObject({
  name: new DozString(),
  address: addressSchema,
  phoneNumbers: new DozArray(new DozString())
});

const user = userSchema.parse(userData);
```

## Error Handling

Doz provides detailed error messages to help with debugging:

### Type Errors
```typescript
try {
  doz.string().parse(123);
} catch (error) {
  console.log(error.message); // "Expected string, but received number"
}
```

### Validation Errors
```typescript
try {
  doz.object({ name: doz.string() }).parse({});
} catch (error) {
  console.log(error.message); // "Missing required property: name"
}
```

### Context-Aware Errors
```typescript
try {
  doz.object({ age: doz.number() }).parse({ age: "30" });
} catch (error) {
  console.log(error.message); // "Expected number, but received string (for property: 'age')"
}
```

## TypeScript Integration

Doz is fully typed and provides excellent TypeScript support with both approaches:

### Factory Function Approach
```typescript
import { doz } from './src/doz';

// Type inference works automatically
const stringParser = doz.string();
const result: string = stringParser.parse("hello");

// Object schema with full type inference
const userSchema = doz.object({
  name: doz.string(),
  age: doz.number()
});
const user = userSchema.parse(data); // user.name is string, user.age is number
```

### Direct Class Instantiation
```typescript
import { DozString, DozObject, DozNumber } from './src/doz';

// Type inference works automatically
const stringParser = new DozString();
const result: string = stringParser.parse("hello");

// Object schema with full type inference
const userSchema = new DozObject({
  name: new DozString(),
  age: new DozNumber()
});
const user = userSchema.parse(data); // user.name is string, user.age is number
```

## Architecture

The library is built with a class-based approach:

- **Schema Classes**: Each type has a corresponding class that extends the base `DozSchema` class
- **Error Builders**: Centralized error creation with context awareness
- **Type Safety**: Full TypeScript integration with proper type inference
- **Composability**: Schema classes can be combined to create complex validation schemas

### Internal Structure

- `createTypeError()`: Creates type mismatch errors with detailed information
- `createValidationError()`: Creates validation errors with context
- `DozSchema<T>`: Abstract base class for all schema types
- `DozString`, `DozNumber`, `DozBoolean`: Basic type schema classes
- `DozArray<T>`: Array validation with element schema
- `DozObject<T>`: Object validation with property schemas

## Development

This project uses:
- TypeScript for type safety
- Vite for development and building
- pnpm for package management

### Scripts
- `pnpm dev`: Start development server
- `pnpm build`: Build the project
- `pnpm preview`: Preview the built project

## License

This project is part of the Finsweet Challenge 2.
