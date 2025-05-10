# Valibot Schemas

This directory contains [valibot](https://valibot.dev/) schemas for all entity types in the application. These schemas are used to validate data coming from Firestore or user input.

## Usage

### Basic Validation

```typescript
import { safeParse } from 'valibot';
import { honoreeSchema, formatValiError } from 'src/schemas';

// Data to validate
const data = {
  id: 'some-id',
  firstName: 'John',
  birthDate: new Timestamp(...),
  interests: ['coding', 'music'],
  createdAt: new Timestamp(...),
  updatedAt: new Timestamp(...)
};

// Validate the data
const result = safeParse(honoreeSchema, data);

if (!result.success) {
  // Handle validation error
  console.error(`Validation error: ${formatValiError(result.error)}`);
} else {
  // Use the validated data
  const validatedData = result.output;
  // ...
}
```

### Using ValidationService

The `ValidationService` provides utilities for validating data:

```typescript
import { ValidationService } from 'src/services/validation.service';
import { honoreeSchema } from 'src/schemas';

// Validate data (throws on error)
try {
  const validatedData = ValidationService.validate(honoreeSchema, data);
  // Use validatedData...
} catch (error) {
  // Handle validation error
}

// Safe validation (doesn't throw)
const result = ValidationService.safeValidate(honoreeSchema, data);
if (result.success) {
  // Use result.output...
} else {
  // Handle result.error...
}
```

### Using Firestore Converters

The `validation.service.ts` file provides pre-configured Firestore converters for all entity types:

```typescript
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from 'src/config/firebase';
import { honoreeConverter } from 'src/services/validation.service';

// Get a document with automatic validation
const honoreeRef = doc(db, `/users/${userId}/honorees/${honoreeId}`)
  .withConverter(honoreeConverter);
const snapshot = await getDoc(honoreeRef);

if (snapshot.exists()) {
  // Data is already validated
  const honoree = snapshot.data();
  // ...
}
```

### Creating Custom Converters

You can create custom converters for specific use cases:

```typescript
import { createValidatedConverter } from 'src/services/validation.service';
import { honoreeSchema } from 'src/schemas';

// Create a converter that logs errors but doesn't throw
const customConverter = createValidatedConverter(honoreeSchema, {
  throwOnError: false,
  onError: (error, path, id) => {
    // Custom error handling
    console.warn(`Validation warning for ${path}/${id}:`, error);
  }
});
```

## Available Schemas

- `baseEntitySchema` - Base schema with common fields (id, createdAt, updatedAt)
- `userSchema` - User entity
- `honoreeSchema` - Honoree entity
- `birthdayPageSchema` - Birthday page entity
- `messageSchema` - Message entity
- `gameSchema` - Game entity
- `giftItemSchema` - Gift item entity
- `partyPlanSchema` - Party plan entity
- `partyAttendeeSchema` - Party attendee entity

Each schema includes appropriate validation rules for its fields.
