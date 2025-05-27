import { CLIENT_ID, CLIENT_SECRET } from "@/constants";
import { UserSession } from "@/schemas/database";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/database";

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: "code not found!" }, { status: 400 });
    }

    const url = new URL("https://oauth.bitrix.info/oauth/token");
    url.searchParams.set("grant_type", "authorization_code");
    url.searchParams.set("client_id", CLIENT_ID);
    url.searchParams.set("client_secret", CLIENT_SECRET);
    url.searchParams.set("code", code);

    const userSession: UserSession = await fetch(url).then((res) => res.json());
    let userDomain = userSession.client_endpoint;
    userDomain = userDomain.slice(8, userDomain.length - 6);

    // save user to database
    const obj = await db.Load();
    obj[userDomain] = userSession;
    await db.Write(obj);

    // set cookie and redirect to home page 
    const cookiesStore = await cookies();
    cookiesStore.set("session", JSON.stringify(userSession), {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 180 * 24 * 60 * 60,
    });

    const headerList = await headers();
    const app_domain = headerList.get("host");
    return NextResponse.redirect(`https://${app_domain}`);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
