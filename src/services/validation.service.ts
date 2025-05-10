/**
 * Validation service for Firestore data
 *
 * This service provides utilities for validating data using valibot schemas,
 * including Firestore data converters that automatically validate data.
 */

import { type DocumentData, type FirestoreDataConverter } from 'firebase/firestore';
import {
  safeParse,
  parse,
  ValiError,
  type BaseSchema,
  type BaseIssue,
  type InferInput,
  type SafeParseResult,
  type InferOutput,
  type InferIssue,
  is,
  assert,
} from 'valibot';
import {
  baseEntitySchema,
  userSchema,
  honoreeSchema,
  birthdayPageSchema,
  messageSchema,
  gameSchema,
  giftItemSchema,
  partyPlanSchema,
  partyAttendeeSchema,
  formatValiError,
} from 'src/schemas';

type ParseErrorResult<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> =
  SafeParseResult<T> & { success: false };

type ConverterOpts<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> = {
  onError?: (err: ParseErrorResult<T>) => void;
};

/**
 * Utility class for validation-related functions
 */
export class ValidationService<
  Input extends InferInput<T>,
  Output extends InferOutput<T>,
  Issues extends InferIssue<T>,
  T extends BaseSchema<unknown, DocumentData, BaseIssue<unknown>>,
> {
  public converter: FirestoreDataConverter<Output>;
  constructor(
    public schema: BaseSchema<Input, Output, Issues>,
    opts?: ConverterOpts<T>
  ) {
    this.converter = this.createValidatedConverter(schema, opts);
  }

  /**
   * Creates a Firestore data converter with valibot validation
   *
   * @param schema The valibot schema to validate against
   * @param options Configuration options for the converter
   * @returns A FirestoreDataConverter with validation
   */
  private createValidatedConverter(
    schema: BaseSchema<Input, Output, Issues>,
    opts?: ConverterOpts<T>
  ): FirestoreDataConverter<Output> {
    return {
      fromFirestore(snapshot, options) {
        const data = snapshot.data(options);

        // Add the id to the data for validation
        const entityData = {
          id: snapshot.id,
          ...data,
        };

        // Validate the data using valibot
        const result = safeParse(schema, entityData);

        if (!result.success) {
          const error = new ValiError(result.issues);
          const path = snapshot.ref.path;
          const id = snapshot.id;

          // Log the error
          console.error(`Validation error for ${path}:`, id, result.issues.toString());

          // Call custom error handler if provided
          if (opts?.onError) {
            opts.onError(result);
          }

          throw new Error(`Invalid data at ${path}: ${formatValiError(error)}`);
        }

        // If validation passes, return the validated object
        return result.output;
      },
      toFirestore(entity: DocumentData) {
        // Remove the id field as it's not stored in the document
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...entityData } = entity;
        return entityData;
      },
    };
  }

  parse(data: unknown): Output {
    return parse(this.schema, data);
  }

  safeParse(data: unknown): SafeParseResult<T> {
    return safeParse(this.schema, data);
  }

  validate(data: unknown): boolean {
    return is(this.schema, data);
  }

  assert(data: unknown): void {
    return assert(this.schema, data);
  }
}
// Create converters for all entity types
export const baseEntityValidationService = new ValidationService(baseEntitySchema);
export const userValidationService = new ValidationService(userSchema);
export const honoreeValidationService = new ValidationService(honoreeSchema);
export const birthdayPageValidationService = new ValidationService(birthdayPageSchema);
export const messageValidationService = new ValidationService(messageSchema);
export const gameValidationService = new ValidationService(gameSchema);
export const giftItemValidationService = new ValidationService(giftItemSchema);
export const partyPlanValidationService = new ValidationService(partyPlanSchema);
export const partyAttendeeValidationService = new ValidationService(partyAttendeeSchema);
