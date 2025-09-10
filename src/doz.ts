// doz

// export default class doz  {
//     constructor(data: unknown) {
//         //
//     }

//     public parse(data: unknown) {
        
//     }

//     public string(s: unknown) {
//         if (typeof s === 'string') {
//             return s;
//         }
//         return String(s);
//     }

// }


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


// Externalized methods
const createStringParser = () => {
    return {
        parse: (i: unknown): string => {
            if (typeof i !== 'string') {
                throw createTypeError('string', i);
            }
            return i;
        }
    };
};

const createNumberParser = () => {
    return {
        parse: (i: unknown): number => {
            if (typeof i !== 'number') {
                throw createTypeError('number', i);
            }
            return i;
        }
    };
};

const createBooleanParser = () => {
    return {
        parse: (i: unknown): boolean => {
            if (typeof i !== 'boolean') {
                throw createTypeError('boolean', i);
            }
            return i;
        }
    };
};

// Type for basic parsers (no circular dependency)
type BasicDozSchema = ReturnType<typeof createStringParser> | ReturnType<typeof createNumberParser> | ReturnType<typeof createBooleanParser>;

const createArrayParser = (schema: BasicDozSchema) => {
    return {
        parse: (i: unknown) => {
            if (!Array.isArray(i)) {
                throw createTypeError('array', i);
            }

            for (const item of i) {
                schema.parse(item);
            }

            return i;
        }
    };
};

const createObjectParser = (schema: Record<string, BasicDozSchema>) => {
    return {
        parse: (i: unknown) => {
            if (typeof i !== 'object' || i === null) {
                throw createTypeError('object', i);
            }

            const obj = i as Record<string, unknown>;
            const result: Record<string, unknown> = {};

            for (const [key, valueSchema] of Object.entries(schema)) {
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

            return result;
        }
    };
};

// Complete type for all doz method return types (defined after all functions)
type DozSchema = BasicDozSchema | ReturnType<typeof createArrayParser> | ReturnType<typeof createObjectParser>;

export const doz = {
    string: createStringParser,
    number: createNumberParser,
    boolean: createBooleanParser,
    array: createArrayParser,
    object: createObjectParser
};
