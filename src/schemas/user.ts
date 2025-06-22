import { z } from 'zod';

const AddressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: z.object({
    lat: z.string(),
    lng: z.string(),
  }),
});

const CompanySchema = z.object({
  name: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  phone: z.string(),
  website: z.string(),
  address: AddressSchema,
  company: CompanySchema,
});

export type User = z.infer<typeof UserSchema>;

export const UserAddressSchema = AddressSchema;
export const UserCompanySchema = CompanySchema;