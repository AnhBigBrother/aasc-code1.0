"use server";

import { DATABASE_DIR } from "@/constants";
import { Database } from "@/schemas/database";
import * as fs from "fs";

export async function JsonSafeParse(str: string): Promise<any> {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
}

// Read data from database.json
export async function Load(): Promise<Database> {
  return JsonSafeParse(fs.readFileSync(DATABASE_DIR, "utf8"));
}

// Write object 'obj' into databse.json
export async function Write(obj: Database) {
  const data = JSON.stringify(obj, null, 2);
  fs.writeFileSync(DATABASE_DIR, data, "utf8");
}
