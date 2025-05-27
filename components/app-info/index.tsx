"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { bitrix24Request } from "@/actions/bitrix24";

export function AppInfo() {
  const [appInfo, setAppInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getAppInfo = async () => {
    setIsLoading(true);
    setAppInfo("");
    bitrix24Request("app.info")
      .then((data) => {
        if (data.error || data.server_error) {
          console.error(data);
          toast.error("Something went wrong, try later", {
            position: "top-right",
          });
          return;
        }
        setAppInfo(JSON.stringify(data.result, null, 2));
        toast.success("Success!", {
          position: "top-right",
        });
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong, try later", {
          position: "top-right",
        });
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <div className="flex flex-col items-center justify-start gap-2">
      <Button
        className="w-fit cursor-pointer"
        disabled={isLoading}
        onClick={getAppInfo}
        type="button"
      >
        {"Get the app info ->"}
      </Button>
      {appInfo && <pre className="bg-accent rounded-md p-3">{appInfo}</pre>}
      {isLoading && (
        <div className="w-full h-52 p-3 flex items-center justify-center">
          <div className="w-10 h-10 border-b-2 border-foreground rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}
