import { Email } from '@mui/icons-material';
import { z } from 'zod';
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

/**
 * ! !!!!!!! ATTENTION !!!!!!!!
 *
 * @docs  https://github.com/colinhacks/zod#strings
 * TODO: Adjust the "User" schema below to whatever you think makes sense.
 * No adjustments needed for any other schema
 *
 * ! !!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/**
 * * *******************
 *    DB Models
 * * *******************
 */
export const userRoles = [
  'Controller',
  'Administrator',
  'Base user',
  'Astronaut',
] as const;
const userRoleSchema = z.enum(userRoles);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * @summary     Schema for a "user" entity type
 */
export const User = z.object({
  _id: z.string().uuid(),
  role: userRoleSchema,
  name: z.object({
    familyName: z.string().min(1, { message: "Must be 1 or more characters long" }).max(100, { message: "Must be 100 or fewer characters long" }),
    givenName: z.string().min(1, { message: "Must be 1 or more characters long" }).max(100, { message: "Must be 100 or fewer characters long" }),
    middleName: z.string().optional(),
    suffix: z.string().optional(),
    title: z.string().optional(),
  }),
  email: z.string().email({ message: "Invalid email address"}),
  companyName: z.string().min(1, { message: "Must be 1 or more characters long" }).max(100, { message: "Must be 100 or fewer characters long" }),
  address: z.object({
    streetAddress: z.string().min(2, { message: "Must be 2 or more characters long" }).max(100, { message: "Must be 100 or fewer characters long" }),
    extendedAddress: z.string().optional(),
    postalCode: z.string().min(2, { message: "Must be 2 or more characters long" }).max(20, { message: "Must be 50 or fewer characters long" }),
    region: z.string().min(2, { message: "Must be 2 or more characters long" }).max(50, { message: "Must be 50 or fewer characters long" }),
    locality: z.string().min(2, { message: "Must be 5 or more characters long" }).max(50, { message: "Must be 15 or fewer characters long" }),
    countryCodeAlpha3: z.string().min(1, { message: "Must be 5 or more characters long" }).max(20, { message: "Must be 15 or fewer characters long" })
  })
});
export type User = z.infer<typeof User>;

// ----------------------------------------------------------------------

/**
 * * *******************
 *    Mutations
 * * *******************
 */
export const createUserSchema = User.pick({
  role: true,
  name: true,
  email: true,
  companyName: true,
  address: true
});
export type CreateUser = z.infer<typeof createUserSchema>;

export const updateUserSchema = User.pick({
  role: true,
  name: true,
  email: true,
  companyName: true,
  address: true
}).partial();
export type UpdateUser = z.infer<typeof updateUserSchema>;

// ----------------------------------------------------------------------

/**
 * * *******************
 *    Default Values
 * * *******************
 */
export const defaultValuesUser = (): CreateUser => ({
  role: 'Astronaut',
  name: {
    familyName: '',
    givenName: '',
    middleName: '',
    suffix: '',
    title: '',
  },
  email: '',
  companyName: '',
  address: {
    streetAddress: '',
    extendedAddress: '',
    postalCode: '',
    region: '',
    locality: '',
    countryCodeAlpha3: ''
  }
});

