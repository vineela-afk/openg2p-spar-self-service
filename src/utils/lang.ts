export function getDefaultLocale() {
  return process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "en";
}

export function getSupportedLocales() {
  const localesStr = process.env.NEXT_PUBLIC_LANGUAGES_SUPPORTED || "en fr tl";
  const defaultLocale = getDefaultLocale();
  const localesArr = localesStr.split(/\s+/).filter((item) => item !== defaultLocale);
  localesArr.unshift(defaultLocale);
  return localesArr;
}
