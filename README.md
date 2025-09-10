# Doz - Type-Safe Data Validation Library

_FYI: this is a clone of [zod](https://zod.dev/) for the finsweet interview's coding challenge_

A lightweight TypeScript library for runtime type validation and parsing of unknown data structures.

## Overview

Doz provides a simple, functional API for validating and parsing data at runtime. It's designed to help you safely handle unknown data (like JSON from APIs or user input from Forms or other places) by providing type-safe validation with clear error messages.

## Features

- **Type-safe validation**: Ensure data matches expected types at runtime
- **Clear error messages**: Detailed error reporting with context information
- **Functional API**: Simple, composable validation functions
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

### Basic Type Validation

```typescript
import { doz } from './src/doz';

// Validate a string
const name = doz.string().parse(userInput);

// Validate a number
const count = doz.number().parse(data.count);

// Validate a boolean
const enabled = doz.boolean().parse(config.enabled);
```

### Array Validation

```typescript
// Validate an array of strings
const tags = doz.array(doz.string()).parse(data.tags);

// Validate an array of numbers
const scores = doz.array(doz.number()).parse(data.scores);
```

### Object Validation

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

### Nested Object Validation

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

Doz is fully typed and provides excellent TypeScript support:

```typescript
import { doz, DozSchema } from './src/doz';

// Type inference works automatically
const stringParser = doz.string();
const result: string = stringParser.parse("hello");

// You can also use the DozSchema type for more complex scenarios
const schema: DozSchema = doz.object({
  name: doz.string(),
  age: doz.number()
});
```

## Architecture

The library is built with a functional approach:

- **Parser Functions**: Each type has a corresponding parser creation function
- **Error Builders**: Centralized error creation with context awareness
- **Type Safety**: Full TypeScript integration with proper type inference
- **Composability**: Parsers can be combined to create complex validation schemas

### Internal Structure

- `createTypeError()`: Creates type mismatch errors with detailed information
- `createValidationError()`: Creates validation errors with context
- `createStringParser()`, `createNumberParser()`, `createBooleanParser()`: Basic type parsers
- `createArrayParser()`: Array validation with element schema
- `createObjectParser()`: Object validation with property schemas

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
