import {redirect} from "next/navigation";
import {getDefaultLocale} from "@/utils/lang";

export default function RootPage() {
  const defaultLocale = getDefaultLocale();
  redirect(`/${defaultLocale}`);
}
