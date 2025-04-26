"use client";
import React from "react";
import Image from "next/image";

import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { prefixBasePath } from "@/utils/path";
import { useAuth } from "@/app/store/auth-context";
import { AuthUtil } from "@/app/components/auth";
export default function ProfilePage() {
  const localActive = useLocale();
  AuthUtil({ failedRedirectUrl: `/${localActive}/login` });

  const t = useTranslations("Profile");
  const { profile } = useAuth();

  const profilePicture = profile?.picture || prefixBasePath("/img/user_image_02.png");
  return (
    <>
      <div>
        <div className="flex flex-row">
          <div className=" h-screen bg-gray-200 basis-1/4">
            <div className="w-1/2 m-24 ">
              <div className="relative ">
                <div className="absolute inset-0  bg-sky-300 rounded-lg blur"></div>
                <div className="relative p-3 bg-white ring-1 ring-gray-900/5 rounded-2xl leading-none flex items-top justify-start space-x-6">
                  <Image
                    src={profilePicture}
                    alt="Woman looking front"
                    className="relative object-cover object-center w-23 h-32 "
                    width={400}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="grid ml-12">
              <div className="item mt-12">
                <div className="m-12">
                  <div className="grid grid-cols-1 ">
                  <div className=" opacity-100 ">
                    <div className=" min-w-0 mt-2 ">
                      <div className="text-sm font-medium text-gray-600  no-underdivne ">{t("name")}</div>
                      <p className="text-2xl text-orange-500  ">{profile?.name}</p>
                  </div>
                </div>
                  </div>
                  <div className="grid grid-cols-2 gap-60 mt-2">
                    <div className="opacity-100 flex">
                      <div className="rounded-lg opacity-100 w-10 h-10 m-2 flex-shrink-0">
                        <img src={prefixBasePath("/img/phone.png")} alt="phone" />
                      </div>
                      <div className="flex-1 mt-2">
                        <div className="text-sm font-medium text-gray-600 no-underline flex items-start">{t("ph_no")}</div>
                        <p className="text-lg text-black font-bold">{profile?.phone_number}</p>
                      </div>
                    </div>
                    <div className="opacity-100 flex items-start pr-30">
                      <div className="rounded-lg opacity-100 w-10 h-10 m-2 flex-shrink-0">
                        <img src={prefixBasePath("/img/Email Wallet.png")} alt="email" />
                      </div>
                      <div className="flex-1 mt-2">
                        <div className="text-sm font-medium text-gray-600">{t("email")}</div>
                        <p className="text-lg text-black font-bold">{profile?.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-b-2 border-orange-200 border-opacity-100 p-2 flex items-start space-x-4"></div>
                  <div className="grid grid-cols-2 gap-60 mt-2">
                    <div className="opacity-100 flex">
                      <div className="rounded-lg opacity-100 w-10 h-10 m-2 flex-shrink-0">
                        <img src={prefixBasePath("/img/dob.png")} alt="phone" />
                      </div>
                      <div className="flex-1 mt-2">
                        <div className="text-sm font-medium text-gray-600 no-underline flex items-start">{t("dob")}</div>
                        <p className="text-lg text-black font-bold">{profile?.birthdate}</p>
                      </div>
                    </div>
                    <div className="opacity-100 flex items-start pr-30">
                      <div className="rounded-lg opacity-100 w-10 h-10 m-2 flex-shrink-0">
                        <img src={prefixBasePath("/img/gender.png")} alt="email" />
                      </div>
                      <div className="flex-1 mt-2">
                        <div className="text-sm font-medium text-gray-600">{t("email")}</div>
                        <p className="text-lg text-black font-bold">{profile?.gender}</p>
                      </div>
                    </div>

                  </div>
                  <div className="w-full border-b-2 border-orange-200 border-opacity-100 p-2 flex items-start space-x-4"></div>
                  <div className="mt-4 opacity-100 flex items-start">
                    <div className="flex-1 min-w-0 mt-2">
                      <p className="text-sm font-medium text-gray-600">{t("add")}</p>
                      <div className="flex flex-col w-1/2 border-dashed border-2 mt-2 square-full border-gray-400 p-4 rounded-2xl">
                        <p className="text-sm text-wrap  text-black">
                          {profile?.address && (
                            <>
                              {Object.keys(profile.address).map((key, index) => (
                                <div key={index} className="w-full">
                                  <p className="w-full">
                                    {t(key)} -- {profile.address[key]}
                                  </p>
                                </div>
                              ))}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-b-2 border-orange-200 border-opacity-100 p-2 flex items-start space-x-4"></div>
                </div>
              </div>
            </div>

            <div className="relative ">
              <Link href={`/${localActive}/home`} className="absolute bottom-0 right-0 m-4 mb-8">
                <Image
                  className="items-end"
                  src={prefixBasePath("/img/back_arrow_03.png")}
                  alt="person"
                  width={50}
                  height={50}
                />
              </Link>
            </div>
          </div>
        </div>
      </>
      );
}
