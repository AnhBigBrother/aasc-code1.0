"use server";

import { CLIENT_ID, CLIENT_SECRET } from "@/constants";
import { UserSession } from "@/schemas/database";
import * as db from "@/lib/database";
import { cookies } from "next/headers";

export async function bitrix24Request(
  path: string,
  payload?: { [keys: string]: any },
) {
  try {
    const cookiesStore = await cookies();
    const userSession: UserSession = await db.JsonSafeParse(
      cookiesStore.get("session")?.value || "",
    );
    if (
      !userSession.access_token ||
      !userSession.refresh_token ||
      !userSession.client_endpoint
    ) {
      return { error: "Cookies failed" };
    }

    const url = `${userSession.client_endpoint}${path}`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        ...payload,
        auth: userSession.access_token,
      }),
    });
    const respJson = await resp.json();

    if (!resp.ok) {
      if (respJson.error !== "expired_token") {
        return { error: respJson };
      }

      // if access_token expired, get new access_token
      const getAccessTokenUrl = `https://oauth.bitrix.info/oauth/token/?grant_type=refresh_token&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${userSession.refresh_token}`;
      const tokensResp = await fetch(getAccessTokenUrl);
      const tokensRespJson = await tokensResp.json();
      if (!tokensResp.ok) {
        return { error: tokensRespJson };
      }

      // update new tokens
      userSession.access_token = tokensRespJson.access_token;
      userSession.refresh_token = tokensRespJson.refresh_token;
      userSession.expires = tokensRespJson.expires;
      userSession.expires_in = userSession.expires_in;
      const obj = await db.Load();
      let userDomain = userSession.client_endpoint;
      userDomain = userDomain.slice(8, userDomain.length - 6);
      obj[userDomain] = userSession;
      await db.Write(obj);
      cookiesStore.set("session", JSON.stringify(userSession), {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 180 * 24 * 60 * 60,
      });

      // request with new access_token
      const newUrl = `${userSession.client_endpoint}${path}`;
      const newResp = await fetch(newUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...payload,
          auth: userSession.access_token,
        }),
      });
      const newRespJson = await newResp.json();
      if (!newResp.ok) {
        return { error: newRespJson };
      }

      return newRespJson;
    }

    return respJson;
  } catch (err) {
    return {
      server_error: err,
    };
  }
}
