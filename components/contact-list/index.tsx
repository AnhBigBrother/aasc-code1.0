"use client";

import { useEffect, useState } from "react";
import { AddContact } from "./add-contact";
import { bitrix24Request } from "@/actions/bitrix24";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { EditContact } from "./edit-contact";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { Item } from "@radix-ui/react-dropdown-menu";

export type TableDataItem = {
  ID: string;
  NAME: string;
  LAST_NAME: string;
  ADDRESS: string;
  ADDRESS_CITY: string;
  ADDRESS_PROVINCE: string;
  ADDRESS_REGION: string;
  ADDRESS_COUNTRY: string;
};

const ContactList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<TableDataItem[]>([]);

  useEffect(() => {
    setIsLoading(true);
    bitrix24Request("crm.contact.list", {
      select: [
        "ID",
        "NAME",
        "LAST_NAME",
        "ADDRESS",
        "ADDRESS_CITY",
        "ADDRESS_PROVINCE",
        "ADDRESS_REGION",
        "ADDRESS_COUNTRY",
      ],
    })
      .then(({ result }: { result: TableDataItem[] }) => {
        setTableData(result);
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
        toast("Something went wrong, try later!", { position: "top-right" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleDeleteContact = (ID: string) => {
    bitrix24Request("crm.contact.delete", { ID })
      .then(() => {
        setTableData((pre) => pre.filter((item) => item.ID != ID));
        toast.success("Success", {
          position: "top-right",
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong, try later", {
          position: "top-right",
        });
      });
  };

  return (
    <div className="flex w-full max-w-[72rem] h-full overflow-y-auto gap-5 flex-col items-center">
      <h1 className="w-full text-2xl font-semibold py-5 text-center">
        Contact list
      </h1>
      <Table className="w-full py-10">
        <TableCaption>
          {isLoading && (
            <div className="w-full p-3 flex items-center justify-center">
              <div className="w-8 h-8 border-b-2 border-foreground rounded-full animate-spin"></div>
            </div>
          )}
          {"A list of contacts."}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Province</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableData.length > 0 &&
            tableData.map((tableItem) => (
              <TableRow key={tableItem.ID}>
                <TableCell className="font-medium">{tableItem.ID}</TableCell>
                <TableCell>{tableItem.NAME}</TableCell>
                <TableCell>{tableItem.LAST_NAME}</TableCell>
                <TableCell>{tableItem.ADDRESS_CITY}</TableCell>
                <TableCell>{tableItem.ADDRESS_PROVINCE}</TableCell>
                <TableCell>{tableItem.ADDRESS_COUNTRY}</TableCell>
                <TableCell className="w-16 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-secondary outline-none hover:brightness-95 transition-all rounded-md px-3 text-sm cursor-pointer py-2">
                      <Ellipsis className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <EditContact {...tableItem} />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer w-full px-3 py-1 hover:bg-secondary text-base"
                        onClick={() => handleDeleteContact(tableItem.ID)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <AddContact
        addItem={(item: TableDataItem) => {
          setTableData((prev) => [...prev, item]);
        }}
      />
    </div>
  );
};

export { ContactList };
