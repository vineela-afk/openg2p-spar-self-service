"use client";
import {useLocale} from "next-intl";
import {useTranslations} from "next-intl";
import {Suspense} from "react";
import {AuthUtil} from "@/app/components/auth";
import {UpdateFaBox} from "@/app/components";
import {prefixBasePath} from "@/utils/path";
import Loading from "../loading";

export default function Next() {
  const localActive = useLocale();
  AuthUtil({failedRedirectUrl: `/${localActive}/login`});

  const t = useTranslations("Update");

  return (
    <main>
      <div className="flex flex-row ">
        <div className="2xl:h-screen bg-gray-100 basis-1/2 flex items-center justify-center ">
          <div className="pl-6 mt-16 pt-2 pb-0 mb-0 ">
            <img src={prefixBasePath("/img/infographic_01.png")} alt="person" />
          </div>
        </div>
        <div className=" max-w-sm flex flex-col m-8 pl-6 basis-1/2 ">
          <nav className="items-center p-1 text-md text-gray-600 bg-white rounded-3xl">
            <Suspense fallback={<Loading />}>
              <UpdateFaBox />
            </Suspense>
          </nav>
        </div>
      </div>
    </main>
  );
}
