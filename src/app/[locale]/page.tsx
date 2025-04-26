import {useLocale} from "next-intl";
import {AuthUtil} from "../components/auth";

export default function Root() {
  const localActive = useLocale();
  const authUtilProps = {
    successRedirectUrl: `/${localActive}/home`,
    failedRedirectUrl: `/${localActive}/login`,
  };

  return <AuthUtil {...authUtilProps} />;
}
