import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { AppLocale, locales } from "@/lib/utils";


function isSupportedLocale(locale: string | undefined): locale is AppLocale {
  return locales.includes(locale as AppLocale);
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get("NEXT_LOCALE")?.value;

  const acceptedLocale = headerStore
    .get("accept-language")
    ?.split(",")
    .map((value) => value.split(";")[0]?.trim().toLowerCase())
    .find((value) => isSupportedLocale(value) || isSupportedLocale(value?.split("-")[0]));

  const locale = isSupportedLocale(cookieLocale)
    ? cookieLocale
    : isSupportedLocale(acceptedLocale)
      ? acceptedLocale
      : isSupportedLocale(acceptedLocale?.split("-")[0])
        ? acceptedLocale.split("-")[0]
        : "en";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});