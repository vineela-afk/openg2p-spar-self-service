"use client";

import {Menu, Transition} from "@headlessui/react";
import {useLocale, useTranslations} from "next-intl";
import Image from "next/image";
import {useRouter, usePathname} from "next/navigation";
import {Fragment, useTransition} from "react";
import {getSupportedLocales} from "@/utils/lang";
import {prefixBasePath} from "@/utils/path";
function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const localActive = useLocale();
  const t = useTranslations();
  const currentPath = usePathname();
  const supportedLocales = getSupportedLocales();

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      const newPath = currentPath.replace(localActive, nextLocale);
      router.push(newPath);
    });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex justify-between items-center w-full gap-x-2 px-2 py-2 text-sm text-black hover:bg-gray-50">
          <Image
            src={prefixBasePath(t(`@flag_url_${localActive}`))}
            alt={localActive}
            width={20}
            height={20}
          />

          <span>{t(`@language_title_${localActive}`)}</span>
          <Image
            className="w-3 h-3 mr-2"
            src={prefixBasePath("/img/down_arrow.png")}
            alt="person"
            width={60}
            height={60}
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute flex-col right-0  z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 ring-gray-400  focus:outline-none">
          <div className="py-1 flex-col items-center">
            {supportedLocales.map((option: string) => (
              <Menu.Item key={`locale-${option}`}>
                {({active}) => (
                  <button
                    onClick={() => onSelectChange(option)}
                    className={classNames(
                      active ? "bg-gray-100 w-full text-gray-900" : "text-gray-700",
                      "px-4 py-2 text-sm flex items-center gap-2"
                    )}
                  >
                    <Image
                      src={prefixBasePath(t(`@flag_url_${option}`))}
                      alt={option}
                      width={20}
                      height={20}
                    />
                    <span>{t(`@language_title_${option}`)}</span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
