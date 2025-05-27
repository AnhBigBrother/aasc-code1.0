import { z } from "zod";

const AuthSchema = z.object({
  address: z.string().url(),
});

type AuthType = z.infer<typeof AuthSchema>;

export { AuthSchema, type AuthType };
