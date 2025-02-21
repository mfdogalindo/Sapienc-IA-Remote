import { useFetcher } from "@remix-run/react";
import { ReactElement } from "react";

export function SendCommand({
   children,
   instruction,
   data,
}: {
   children: ReactElement;
   instruction: string;
   data?: any;
}) {
   const fetcher = useFetcher();

   const sendCommand = async () => {
      const formData = new FormData();
      formData.append("command", "publish");
      formData.append("instruction", instruction);
      formData.append("data", JSON.stringify(data));
      await fetcher.submit(formData, { method: "POST", action: "/command" });
   };

   return <button onClick={sendCommand}>{children}</button>;
}
