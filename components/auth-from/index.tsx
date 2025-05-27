"use client";

import { useForm } from "react-hook-form";
import { AuthSchema, AuthType } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CLIENT_ID } from "@/constants";
import { createRandomString } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export function AuthForm() {
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<AuthType>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      address: "",
    },
  });

  const onSubmit = async ({ address }: AuthType) => {
    setIsPending(true);

    const app_domain = window.location.origin;
    const consentUrl = `${address}/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=https://${app_domain}/api/oauth/handler&response_type=code&state=${createRandomString(12)}`;

    window.location.href = consentUrl;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        <p>You are not authenticated</p>
        <p>Please login with your Bitrix24 address</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="https://xxx.bitrix24.yyy"
                    type="url"
                  ></Input>
                </FormControl>
                <FormMessage> </FormMessage>
              </FormItem>
            )}
          ></FormField>
          <Button
            type="submit"
            className="w-fit cursor-pointer"
            disabled={isPending}
          >
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
}
