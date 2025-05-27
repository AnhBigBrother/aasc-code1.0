"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ContactData,
  ContactDataSchema,
  ContactPayload,
} from "@/schemas/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { bitrix24Request } from "@/actions/bitrix24";
import { toast } from "sonner";
import { TableDataItem } from "..";

const EditContact = ({
  ID,
  NAME,
  LAST_NAME,
  ADDRESS,
  ADDRESS_REGION,
  ADDRESS_COUNTRY,
  ADDRESS_PROVINCE,
  ADDRESS_CITY,
}: TableDataItem) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const form = useForm<ContactData>({
    resolver: zodResolver(ContactDataSchema),
    defaultValues: {
      first_name: NAME,
      last_name: LAST_NAME,
      email: "",
      phone_number: "",
      website: "",
      address: ADDRESS,
      city: ADDRESS_CITY,
      region: ADDRESS_REGION,
      province: ADDRESS_PROVINCE,
      country: ADDRESS_COUNTRY,
      bank: "",
      bank_account_number: "",
    },
  });
  useEffect(() => {
    if (isOpen) {
      setIsPending(true);
      // get contact's email, phone, website
      bitrix24Request("crm.contact.get", { ID: ID })
        .then(({ result }: { result: ContactPayload["FIELDS"] }) => {
          console.log("contact data:", result);
          form.setValue("email", result.EMAIL[0].VALUE);
          form.setValue("phone_number", result.PHONE[0].VALUE);
          form.setValue("website", result.WEB[0].VALUE);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong, try later!", {
            position: "top-right",
          });
        });

      // get the requisite's ID of the contact
      bitrix24Request("crm.requisite.list", {
        filter: { ENTITY_ID: ID },
        select: ["ID"],
      })
        .then(({ result: [{ ID }] }) => {
          console.log("requisite ID:", ID);
          // get the bankdetail from the contact's requisite
          bitrix24Request("crm.requisite.bankdetail.list", {
            filter: { ENTITY_ID: ID },
            select: ["ID", "ENTITY_ID", "RQ_BANK_NAME", "RQ_ACC_NUM"],
          }).then(
            ({ result: [{ ID, ENTITY_ID, RQ_BANK_NAME, RQ_ACC_NUM }] }) => {
              console.log("bankdetail:", {
                ID,
                ENTITY_ID,
                RQ_BANK_NAME,
                RQ_ACC_NUM,
              });
              // update form values
              form.setValue("bank", RQ_BANK_NAME);
              form.setValue("bank_account_number", RQ_ACC_NUM);
            },
          );
        })
        .catch((err) => {
          console.error(err);
          toast.error("Something went wrong, try later!", {
            position: "top-right",
          });
        })
        .finally(() => setIsPending(false));
    }
  }, [isOpen]);
  const onSubmit = async (data: ContactData) => {
    setIsPending(true);
    const payload: ContactPayload = {
      FIELDS: {
        NAME: data.first_name,
        LAST_NAME: data.last_name,
        HAS_PHONE: "Y",
        HAS_EMAIL: "Y",
        EMAIL: [
          {
            VALUE: data.email,
            VALUE_TYPE: "HOME",
          },
        ],
        PHONE: [
          {
            VALUE: data.phone_number,
            VALUE_TYPE: "HOME",
          },
        ],
        WEB: [
          {
            VALUE: data.website,
            VALUE_TYPE: "HOME",
          },
        ],
        ADDRESS: data.address,
        ADDRESS_CITY: data.city,
        ADDRESS_PROVINCE: data.province,
        ADDRESS_REGION: data.region,
        ADDRESS_COUNTRY: data.country,
      },
    };
    console.log(payload);
    bitrix24Request("crm.contact.add", payload)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsPending(false));
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="cursor-pointer w-full px-3 py-1 text-start rounded-md hover:bg-secondary">
        Edit
      </DialogTrigger>
      <DialogContent className="max-w-fit flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit contact</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex w-screen max-w-[52rem] bg-accent flex-col gap-6 rounded-xl border p-5 sm:p-10"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-2 w-full items-start gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background"
                        placeholder="John"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background"
                        placeholder="Doe"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="grid grid-cols-2 w-full items-start gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@abc.xyz"
                        className="bg-background"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0123456789"
                        className="bg-background [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
            </div>
            <div className="grid grid-cols-2 w-full items-start gap-6">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://abc.xyz"
                        className="bg-background"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <div className="grid grid-cols-3 gap-2 items-start">
                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem className="w-full col-span-1">
                      <FormLabel>Bank</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="XXB"
                          className="bg-background"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="bank_account_number"
                  render={({ field }) => (
                    <FormItem className="w-full col-span-2">
                      <FormLabel>Bank number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9123 4567"
                          type="number"
                          className="bg-background [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full items-start">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Wololo street"
                        className="bg-background"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>
              <div className="grid grid-cols-4 gap-2 w-full">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Phu ly"
                          className="bg-background"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="province"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ha nam"
                          className="bg-background"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Dong Bac"
                          className="bg-background"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Viet Nam"
                          className="bg-background"
                          {...field}
                        ></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                className="bg-background cursor-pointer border"
                disabled={isPending}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer"
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export { EditContact };
