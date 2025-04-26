import {getRequestConfig} from "next-intl/server";
import {notFound} from "next/navigation";
import {getSupportedLocales} from "@/utils/lang";

export default getRequestConfig(async ({locale}) => {
  if (!getSupportedLocales().includes(locale as any)) notFound();

  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
