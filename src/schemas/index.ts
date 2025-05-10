/**
 * Valibot schemas for all entity types in the application
 *
 * This file contains validation schemas for all entity types defined in src/types/index.ts.
 * These schemas can be used to validate data coming from Firestore or user input.
 */

import { Timestamp } from 'firebase/firestore';
import {
  object,
  string,
  array,
  boolean,
  number,
  record,
  union,
  literal,
  optional,
  custom,
  email,
  minLength,
  maxLength,
  minValue,
  maxValue,
  type ValiError,
  type BaseSchema,
  type BaseIssue,
  type BaseSchemaAsync,
  pipe,
  any,
  type InferInput,
} from 'valibot';

/**
 * Custom validator for Firebase Timestamp
 * Ensures that a value is a valid Firebase Timestamp instance
 */
export const timestampSchema = custom<Timestamp>(
  value => value instanceof Timestamp,
  'Must be a valid Firebase Timestamp'
);

/**
 * Optional Timestamp schema for nullable/optional timestamp fields
 * Accepts either a Firebase Timestamp or a JavaScript Date object
 */
export const optionalTimestampSchema = optional(
  union([
    timestampSchema,
    custom<Date>(value => value instanceof Date, 'Must be a valid Date object'),
  ])
);

/**
 * Base entity schema with common fields
 * All entities in the system extend from this base schema
 */
export const baseEntitySchema = object({
  id: pipe(string(), minLength(1, 'ID cannot be empty')),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

/**
 * User schema
 * Represents a user in the system
 */
export const userSchema = object({
  ...baseEntitySchema.entries,
  email: pipe(string(), email('Must be a valid email address')),
  subscriptionTier: optional(string()),
});

/**
 * Honoree schema
 * Represents a person being celebrated
 */
export const honoreeSchema = object({
  ...baseEntitySchema.entries,
  firstName: pipe(
    string(),
    minLength(1, 'First name cannot be empty'),
    maxLength(100, 'First name is too long')
  ),
  birthDate: timestampSchema,
  interests: pipe(
    array(pipe(string(), minLength(1, 'Interest cannot be empty'))),
    minLength(0, 'Interests must be an array')
  ),
});

/**
 * BirthdayPage schema
 * Represents a birthday celebration page
 */
export const birthdayPageSchema = object({
  ...baseEntitySchema.entries,
  title: pipe(string(), minLength(1, 'Title cannot be empty'), maxLength(200, 'Title is too long')),
  theme: pipe(string(), minLength(1, 'Theme cannot be empty')),
  customInterests: pipe(
    array(pipe(string(), minLength(1, 'Custom interest cannot be empty'))),
    minLength(0, 'Custom interests must be an array')
  ),
  customMessage: string(),
  celebratedAge: pipe(
    number(),
    minValue(0, 'Age cannot be negative'),
    maxValue(150, 'Age is too high')
  ),
  isPublished: boolean(),
  publishedAt: optionalTimestampSchema,
  publicId: optional(string()),
});

/**
 * Message schema
 * Represents a message from a well-wisher
 */
export const messageSchema = object({
  ...baseEntitySchema.entries,
  senderName: pipe(
    string(),
    minLength(1, 'Sender name cannot be empty'),
    maxLength(100, 'Sender name is too long')
  ),
  senderEmail: pipe(string(), email('Must be a valid email address')),
  content: pipe(
    string(),
    minLength(1, 'Message content cannot be empty'),
    maxLength(2000, 'Message content is too long')
  ),
  stickerId: string(),
  giftCardInfo: optional(record(string(), optional(any()))),
  status: union([literal('pending'), literal('approved'), literal('rejected')]),
});

/**
 * Game schema
 * Represents an interactive game on the birthday page
 */
export const gameSchema = object({
  ...baseEntitySchema.entries,
  type: union([
    literal('quiz'),
    literal('fill-in-the-blanks'),
    pipe(string(), minLength(1, 'Game type cannot be empty')),
  ]),
  title: pipe(
    string(),
    minLength(1, 'Game title cannot be empty'),
    maxLength(100, 'Game title is too long')
  ),
  successMessage: string(),
  configuration: record(string(), optional(any())),
});

/**
 * GiftItem schema
 * Represents a gift item on a wishlist
 */
export const giftItemSchema = object({
  ...baseEntitySchema.entries,
  name: pipe(
    string(),
    minLength(1, 'Gift name cannot be empty'),
    maxLength(100, 'Gift name is too long')
  ),
  description: pipe(
    string(),
    minLength(1, 'Description cannot be empty'),
    maxLength(500, 'Description is too long')
  ),
  price: pipe(number(), minValue(0, 'Price cannot be negative')),
  affiliateLink: string(),
  imageUrl: string(),
  isCustom: boolean(),
  isClaimed: boolean(),
  claimedBy: optional(string()),
});

/**
 * PartyPlan schema
 * Represents a physical party plan
 */
export const partyPlanSchema = object({
  ...baseEntitySchema.entries,
  date: timestampSchema,
  invitationMessage: pipe(
    string(),
    minLength(1, 'Invitation message cannot be empty'),
    maxLength(1000, 'Invitation message is too long')
  ),
});

/**
 * PartyAttendee schema
 * Represents an attendee of a physical party
 */
export const partyAttendeeSchema = object({
  ...baseEntitySchema.entries,
  name: pipe(
    string(),
    minLength(1, 'Attendee name cannot be empty'),
    maxLength(100, 'Attendee name is too long')
  ),
  numberOfPeople: pipe(
    number(),
    minValue(1, 'Number of people must be at least 1'),
    maxValue(100, 'Number of people is too high')
  ),
});

// Type definitions for the schemas
export type BaseEntity = InferInput<typeof baseEntitySchema>;
export type User = InferInput<typeof userSchema>;
export type Honoree = InferInput<typeof honoreeSchema>;
export type BirthdayPage = InferInput<typeof birthdayPageSchema>;
export type Message = InferInput<typeof messageSchema>;
export type Game = InferInput<typeof gameSchema>;
export type GiftItem = InferInput<typeof giftItemSchema>;
export type PartyPlan = InferInput<typeof partyPlanSchema>;
export type PartyAttendee = InferInput<typeof partyAttendeeSchema>;

/**
 * Helper function to format validation errors into a readable string
 * @param error The ValiError object from valibot
 * @returns A formatted error string
 */
export function formatValiError<
  T extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(error: ValiError<T>): string {
  return error.issues
    .map(issue => `${issue.path?.map(p => p.key).join('.')} - ${issue.message}`)
    .join(', ');
}
