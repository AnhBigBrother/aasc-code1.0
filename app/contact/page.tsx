import { ContactList } from "@/components/contact-list";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AASC-1.0 | Contact",
};

export default async function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between p-20 gap-16 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col gap-3 justify-center items-center">
        <ContactList />
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
          href="/"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          {"Go to home page ->"}
        </a>
      </footer>
    </div>
  );
}
