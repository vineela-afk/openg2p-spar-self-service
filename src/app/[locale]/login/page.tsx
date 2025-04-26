import {useLocale} from "next-intl";
import {AuthUtil} from "@/app/components/auth";
import LoginBox from "./loginbox";

export default function Login() {
  const localActive = useLocale();
  return (
    <main className="overflow:hidden">
      <AuthUtil successRedirectUrl={`/${localActive}/home`} />
      <LoginBox />
    </main>
  );
}
