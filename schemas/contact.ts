import { z } from "zod";

const ContactDataSchema = z.object({
  first_name: z.string().min(2, { message: "Name at least 2 characters" }),
  last_name: z.string().min(2, { message: "Name at least 2 characters" }),
  address: z.string().nonempty({ message: "This field is required" }),
  city: z.string().nonempty({ message: "This field is required" }),
  region: z.string().nonempty({ message: "This field is required" }),
  province: z.string().nonempty({ message: "This field is required" }),
  country: z.string().nonempty({ message: "This field is required" }),
  phone_number: z
    .string()
    .min(9, { message: "Phone at least 9 digits" })
    .max(11, { message: "Phone at most 11 digits" }),
  email: z.string().email(),
  website: z.string().url(),
  bank: z.string().nonempty({ message: "Bank is required" }),
  bank_account_number: z
    .string()
    .min(9, { message: "Account at least 9 digits" })
    .max(15, { message: "Account at most 11 digits" }),
});

type ContactData = z.infer<typeof ContactDataSchema>;

export { ContactDataSchema, type ContactData };

export type ContactPayload = {
  FIELDS: {
    NAME: string;
    LAST_NAME: string;
    HAS_PHONE: "Y" | "N";
    HAS_EMAIL: "Y" | "N";
    EMAIL: [
      {
        VALUE: string;
        VALUE_TYPE: "HOME" | "WORK";
      },
    ];
    PHONE: [
      {
        VALUE: string;
        VALUE_TYPE: "HOME" | "WORK";
      },
    ];
    WEB: [
      {
        VALUE: string;
        VALUE_TYPE: "HOME" | "WORK";
      },
    ];
    ADDRESS: string;
    ADDRESS_CITY: string;
    ADDRESS_PROVINCE: string;
    ADDRESS_REGION: string;
    ADDRESS_COUNTRY: string;
  };
};
