import Image from "next/image";
import { AppInfo } from "@/components/app-info";
import { AuthForm } from "@/components/auth-from";
import { cookies } from "next/headers";
import { UserSession } from "@/schemas/database";
import { JsonSafeParse } from "@/lib/database";

export default async function Home() {
  const cookiesStore = await cookies();
  const userSession: UserSession = await JsonSafeParse(
    cookiesStore.get("session")?.value || "",
  );
  return (
    <div className="min-h-screen flex flex-col justify-between p-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="flex grow flex-col gap-[32px] row-start-2 items-center justify-center">
        <h1 className="text-3xl font-bold">
          Hello{" "}
          {userSession.client_endpoint &&
          userSession.client_endpoint.length > 15
            ? userSession.client_endpoint.slice(
                8,
                userSession.client_endpoint.length - 6,
              )
            : "World"}
        </h1>
        {!userSession.refresh_token ? <AuthForm /> : <AppInfo />}
      </main>
      <footer className="row-start-3 flex gap-2 flex-col items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://www.bitrix24.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          {"Bitrix24.com"}
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/contact"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          {"Go to contact list (ex2) ->"}
        </a>
      </footer>
    </div>
  );
}
