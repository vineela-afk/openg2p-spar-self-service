import {NextRequest} from "next/server";
import createMiddleware from "next-intl/middleware";
import {getSupportedLocales} from "@/utils/lang";

const nextIntlMiddleware = createMiddleware({
  locales: getSupportedLocales(),
  defaultLocale: "en",
});

export function middleware(request: NextRequest) {
  if (getSupportedLocales().some((lang: string) => request.nextUrl.pathname.startsWith(`/${lang}`))) {
    return nextIntlMiddleware(request);
  }
}
