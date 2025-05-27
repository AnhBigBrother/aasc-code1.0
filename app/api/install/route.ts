import { CLIENT_ID } from "@/constants";
import { createRandomString } from "@/lib/utils";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const user_domain = searchParams.get("DOMAIN");
    if (!user_domain) {
      return NextResponse.json({ error: "DOMAIN not found!" }, { status: 400 });
    }

    const headerList = await headers();
    const app_domain = headerList.get("host");

    // redirect to bitrix24 consent screen after install app
    const url = new URL(`https://${user_domain}/oauth/authorize`);
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set(
      "redirect_uri",
      `https://${app_domain}/api/oauth/handler`,
    );
    url.searchParams.set("response_type", "code");
    url.searchParams.set("state", createRandomString(12));
    console.log(`App installed by ${user_domain}`)
    return NextResponse.redirect(url);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
