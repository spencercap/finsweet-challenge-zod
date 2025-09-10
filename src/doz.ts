// doz - Class-based Type-Safe Data Validation Library

// Error builder that infers expected type from method name
const createTypeError = (expectedType: string, actualValue: unknown, context?: string) => {
    const actualType = typeof actualValue;
    let baseMessage = `Expected ${expectedType}, but received ${actualType}`;
    
    // If it's an object, try to get more specific information
    if (actualType === 'object' && actualValue !== null) {
        if (Array.isArray(actualValue)) {
            baseMessage = `Expected ${expectedType}, but received array`;
        } else {
            // Try to get the constructor name or object type
            const constructorName = (actualValue as any).constructor?.name || 'object';
            baseMessage = `Expected ${expectedType}, but received ${constructorName}`;
        }
    }
    
    const contextMessage = context ? ` (${context})` : '';
    return new Error(`${baseMessage}${contextMessage}`);
};

const createValidationError = (message: string, context?: string) => {
    const contextMessage = context ? ` (${context})` : '';
    return new Error(`${message}${contextMessage}`);
};

// Base class for all doz schemas
abstract class DozSchema<T> {
    abstract parse(input: unknown): T;
}

// Primitive type classes
class DozString extends DozSchema<string> {
    parse(input: unknown): string {
        if (typeof input !== 'string') {
            throw createTypeError('string', input);
        }
        return input;
    }
}

class DozNumber extends DozSchema<number> {
    parse(input: unknown): number {
        if (typeof input !== 'number') {
            throw createTypeError('number', input);
        }
        return input;
    }
}

class DozBoolean extends DozSchema<boolean> {
    parse(input: unknown): boolean {
        if (typeof input !== 'boolean') {
            throw createTypeError('boolean', input);
        }
        return input;
    }
}

// Array class
class DozArray<T> extends DozSchema<T[]> {
    private elementSchema: DozSchema<T>;
    
    constructor(elementSchema: DozSchema<T>) {
        super();
        this.elementSchema = elementSchema;
    }

    parse(input: unknown): T[] {
        if (!Array.isArray(input)) {
            throw createTypeError('array', input);
        }

        for (const item of input) {
            this.elementSchema.parse(item);
        }

        return input as T[];
    }
}

// Object class
class DozObject<T extends Record<string, any>> extends DozSchema<T> {
    private schema: { [K in keyof T]: DozSchema<T[K]> };
    
    constructor(schema: { [K in keyof T]: DozSchema<T[K]> }) {
        super();
        this.schema = schema;
    }

    parse(input: unknown): T {
        if (typeof input !== 'object' || input === null) {
            throw createTypeError('object', input);
        }

        const obj = input as Record<string, unknown>;
        const result: Record<string, unknown> = {};

        for (const [key, valueSchema] of Object.entries(this.schema)) {
            if (!(key in obj)) {
                throw createValidationError(`Missing required property: ${key}`);
            }
            try {
                result[key] = valueSchema.parse(obj[key]);
            } catch (error) {
                // Re-throw with key context if it's a type error
                if (error instanceof Error && error.message.includes('Expected')) {
                    throw createTypeError(error.message.split('Expected ')[1].split(',')[0], obj[key], `for property: '${key}'`);
                }
                throw error;
            }
        }

        return result as T;
    }
}

// Export the main doz object with class constructors
export const doz = {
    string: () => new DozString(),
    number: () => new DozNumber(),
    boolean: () => new DozBoolean(),
    array: <T>(elementSchema: DozSchema<T>) => new DozArray(elementSchema),
    object: <T extends Record<string, any>>(schema: { [K in keyof T]: DozSchema<T[K]> }) => new DozObject(schema)
};

// Export the base class and specific classes for advanced usage
export { DozSchema, DozString, DozNumber, DozBoolean, DozArray, DozObject };