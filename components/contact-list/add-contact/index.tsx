"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ContactData, ContactDataSchema, ContactPayload } from "@/schemas/contact"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { bitrix24Request } from "@/actions/bitrix24"
import { toast } from "sonner"
import { TableDataItem } from ".."

const AddContact = ({ addItem }: { addItem: (item: TableDataItem) => void }) => {
  const [isPending, setIsPending] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const form = useForm<ContactData>({
    resolver: zodResolver(ContactDataSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      city: "",
      region: "",
      province: "",
      country: "",
      bank: "",
      bank_account_number: "",
      website: "",
    },
  })
  const onSubmit = async (data: ContactData) => {
    setIsPending(true)
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
    }
    console.log(payload)
    bitrix24Request("crm.contact.add", payload)
      .then(({ result }) => {
        addItem({
          ID: result,
          NAME: data.first_name,
          LAST_NAME: data.last_name,
          ADDRESS: data.address,
          ADDRESS_CITY: data.city,
          ADDRESS_COUNTRY: data.country,
          ADDRESS_PROVINCE: data.province,
          ADDRESS_REGION: data.region,
        })

        // get the requisite's ID of the contact
        bitrix24Request("crm.requisite.list", {
          filter: { ENTITY_ID: result },
          select: ["ID"],
        }).then(({ result: [{ ID }] }) => {
          // create new bankdetail inside the contact's requisite
          bitrix24Request("crm.requisite.bankdetail.add", {
            fields: {
              ENTITY_ID: ID,
              NAME: data.bank,
              RQ_BANK_NAME: data.bank,
              RQ_ACC_NUM: data.bank_account_number,
            },
          }).then((data) => {
            toast.success("Success!", { position: "top-right" })
          })
        })
      })
      .catch((err) => {
        console.error(err)
        toast.error("Something went wrong, try later!", {
          position: "top-right",
        })
      })
      .finally(() => {
        setIsPending(false)
        setIsOpen(false)
      })
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}>
      <DialogTrigger className='bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 rounded-md px-3 text-sm cursor-pointer'>
        Add new Contact
      </DialogTrigger>
      <DialogContent className='max-w-fit flex flex-col'>
        <DialogHeader>
          <DialogTitle>New contact</DialogTitle>
          <DialogDescription>Create a new contact.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className='flex w-screen max-w-[52rem] bg-accent flex-col gap-6 rounded-xl border p-5 sm:p-10'
            onSubmit={form.handleSubmit(onSubmit)}>
            <div className='grid grid-cols-2 w-full items-start gap-6'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-background'
                        placeholder='John'
                        {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}></FormField>
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input
                        className='bg-background'
                        placeholder='Doe'
                        {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}></FormField>
            </div>
            <div className='grid grid-cols-2 w-full items-start gap-6'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='johndoe@abc.xyz'
                        className='bg-background'
                        {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}></FormField>
              <FormField
                control={form.control}
                name='phone_number'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0123456789'
                        className='bg-background [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}></FormField>
            </div>
            <div className='grid grid-cols-2 w-full items-start gap-6'>
              <FormField
                control={form.control}
                name='website'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='https://abc.xyz'
                        className='bg-background'
                        {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}></FormField>
              <div className='grid grid-cols-3 gap-2 items-start'>
                <FormField
                  control={form.control}
                  name='bank'
                  render={({ field }) => (
                    <FormItem className='w-full col-span-1'>
                      <FormLabel>Bank</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='XXB'
                          className='bg-background'
                          {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}></FormField>
                <FormField
                  control={form.control}
                  name='bank_account_number'
                  render={({ field }) => (
                    <FormItem className='w-full col-span-2'>
                      <FormLabel>Bank number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='1234 5678 9123 4567'
                          type='number'
                          className='bg-background [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                          {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}></FormField>
              </div>
            </div>
            <div className='flex flex-col gap-3 w-full items-start'>
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Wololo street'
                        className='bg-background'
                        {...field}></Input>
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}></FormField>
              <div className='grid grid-cols-4 gap-2 w-full'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Phu ly'
                          className='bg-background'
                          {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}></FormField>
                <FormField
                  control={form.control}
                  name='province'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Province</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Ha nam'
                          className='bg-background'
                          {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}></FormField>
                <FormField
                  control={form.control}
                  name='region'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Dong Bac'
                          className='bg-background'
                          {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}></FormField>
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Viet Nam'
                          className='bg-background'
                          {...field}></Input>
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}></FormField>
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                type='button'
                variant='secondary'
                className='bg-background cursor-pointer border'
                disabled={isPending}
                onClick={() => form.reset()}>
                Reset
              </Button>
              <Button
                type='submit'
                disabled={isPending}
                className='cursor-pointer'>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { AddContact }
