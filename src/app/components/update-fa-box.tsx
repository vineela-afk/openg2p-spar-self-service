"use client";
import {useLocale} from "next-intl";
import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import {prefixBaseApiPath, prefixBasePath} from "@/utils/path";
import {linkFa} from "@/utils/link";
import {updateFa} from "@/utils/update";
import {FormLevel, FormLevelValue, KeyValue} from "@/types/dfsp-levels";
import {useUnlinked} from "../store/auth-context";
import {useSubmission} from "../store/auth-context";
type State = {
  choices: KeyValue[];
  levels: FormLevel[];
};

export interface LinkOrUpdate {
  strategy_id?: number | null;
  fa_type?: string;
  bank_name?: string;
  bank_code?: string;
  branch_name?: string;
  branch_code?: string;
  account_number?: string;
  wallet_provider_name?: string;
  wallet_provider_code?: string;
  mobile_number?: string;
  email_address?: string;
}

export default function UpdateFaBox() {
  const localActive = useLocale();
  const t = useTranslations("Update");
  const {setDataSubmitted} = useSubmission();
  const {isUnLinked, setUnLinked} = useUnlinked();

  const [subTab, setSubTab] = useState(0);
  const [formData, setFormData] = useState<State>({choices: [], levels: []});

  const [finalData, setFinalData] = useState<LinkOrUpdate>({});

  const [Level, setLevel] = useState<FormLevel[]>();
  //  0 - empty/default. 1 - update form. 2 - loading. 3 - succ. 4 - fail.
  const [renderState, setRenderState] = useState(0);
  const router = useRouter();
  const [isValidEmail, isntValidEmail] = useState(true);
  const [isValidPhone, isntValidPhone] = useState(true);
  const [isValidAcc, isntValidAcc] = useState(true);
  const [levelsSet, setLevelsSet] = useState(false);

  function pushOrResetArrayAfterIndex<T>(arr: T[], index: number, value: T) {
    if (arr.length <= index) {
      arr.push(value);
    } else {
      arr[index] = value;
      arr.length = index + 1;
    }
  }
  function fetchLevelsAndRender(
    tab: any,
    localFormData: State,
    listIndex: number,
    parentLevelId: number,
    parentValuelId: number,
    levelValueId?: number
  ) {
    const requestBodyforlevels = {
      request_header: {},
      request_pagination: {
        request_page: 0,
        page_size: 0,
      },
      request_payload: {
        parent: parentLevelId,
      },
    };
    fetch(prefixBaseApiPath("/dfsp/getLevels"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyforlevels),
    }).then((levelRes) => {
      levelRes.json().then((levelResJson: {response_payload?: FormLevel[]}) => {
        const levels = levelResJson.response_payload || [];
        if (levels.length > 0) {
          let formDataToPush: FormLevel;
          if (tab === 1 || tab === 0) {
            formDataToPush = levels[0];
          } else if (tab === 2) {
            formDataToPush = levels[1];
          } else {
            formDataToPush = levels[2];
          }

          if (formDataToPush.input_type === "select") {
            levelValueId = formDataToPush.id;
            const requestBodyforlevelvalues = {
              request_header: {},
              request_pagination: {
                request_page: 0,
                page_size: 0,
              },
              request_payload: {
                level_id: levelValueId,
                parent: parentValuelId,
              },
            };
            fetch(prefixBaseApiPath("/dfsp/getLevelValues"), {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBodyforlevelvalues),
            })
              .then((levelValueRes) => {
                levelValueRes.json().then((levelValueResJson: {response_payload?: FormLevelValue[]}) => {
                  const levelValues = levelValueResJson.response_payload || [];
                  formDataToPush.options = levelValues;
                  pushOrResetArrayAfterIndex(localFormData.levels, listIndex, formDataToPush);
                  setFormData(localFormData);
                });
              })
              .catch(() => {
                pushOrResetArrayAfterIndex(localFormData.levels, listIndex, formDataToPush);
                setFormData(localFormData);
              });
          } else {
            pushOrResetArrayAfterIndex(localFormData.levels, listIndex, formDataToPush);
            setFormData(localFormData);
          }
        }
      });
    });
  }

  function initialFetchLevels(tab: number, listIndex: number, localFormData: State, parentLevelId: number) {
    const requestBodyforlevels = {
      request_header: {},
      request_pagination: {
        request_page: 0,
        page_size: 0,
      },
      request_payload: {
        parent: parentLevelId,
      },
    };
    fetch(prefixBaseApiPath("/dfsp/getLevels"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBodyforlevels),
    }).then((levelRes) => {
      levelRes.json().then((levelResJson: {response_payload?: FormLevel[]}) => {
        const levels = levelResJson.response_payload || [];
        if (levels.length > 0) {
          if (!levelsSet) {
            setLevel(levels);
            setLevelsSet(true);
          }
        }
      });
    });
  }
  function updateFaSubmit() {
    setRenderState(2);
    if (renderState !== 1 && renderState !== 2) {
      setRenderState(1);
      const localFormData = structuredClone(formData);
      initialFetchLevels(0, 0, localFormData, 0);
    } else {
      let emailIsValid = true;
      let phoneIsValid = true;
      let accIsValid = true;
      formData.levels.forEach((x, i) => {
        if (x.name === "Email address") {
          const regex = new RegExp(x.validation_regex);
          const value = formData.choices[i]?.value || "";
          if (!value || value === "" || !regex.test(value)) {
            emailIsValid = false;
          }
        }
        if (x.name === "Mobile Number") {
          const regex = new RegExp(x.validation_regex);
          const value = formData.choices[i]?.value || "";
          if (!value || value === "" || !regex.test(value)) {
            phoneIsValid = false;
          }
        }
        if (x.name === "Account") {
          const regex = new RegExp(x.validation_regex);
          const value = formData.choices[i]?.value || "";

          if (!value || value === "" || !regex.test(value)) {
            accIsValid = false;
          } else {
            console.log("Valid account value:", value);
          }
        }
      });
      if (!emailIsValid || !phoneIsValid || !accIsValid) {
        setRenderState(1);
        if (!emailIsValid) {
          isntValidEmail(false);
        }
        if (!phoneIsValid) {
          isntValidPhone(false);
        }
        if (!accIsValid) {
          isntValidAcc(false);
        }
        return;
      }
      if (formData.choices[0].key == "Bank") {
        finalData.fa_type = "bank";
        finalData.strategy_id = formData.choices[0].strategy;
        finalData.bank_name = formData.choices[0].value;
        finalData.bank_code = formData.choices[0].code;
        finalData.branch_name = formData.choices[1].value;
        finalData.branch_code = formData.choices[1].code;
        finalData.account_number = formData.choices[2].value;
      } else if (formData.choices[0].key == "Mobile Wallet") {
        finalData.fa_type = "mobile_wallet_provider";
        finalData.wallet_provider_name = formData.choices[0].value;
        finalData.strategy_id = formData.choices[0].strategy;
        finalData.wallet_provider_code = formData.choices[0].code;
        finalData.mobile_number = formData.choices[1].value;
      } else if (formData.choices[0].key == "Email Wallet") {
        finalData.fa_type = "email_wallet_provider";
        finalData.wallet_provider_name = formData.choices[0].value;
        finalData.strategy_id = formData.choices[0].strategy;
        finalData.wallet_provider_code = formData.choices[0].code;
        finalData.email_address = formData.choices[1].value;
      }

      if (!isUnLinked) {
        updateFa(finalData);
        setDataSubmitted(true);
        console.log("Form Data upon submission:", formData);
        setRenderState(3);
        router.push(`/${localActive}/status`);
      } else {
        linkFa(finalData);
        setUnLinked(false);
        console.log("Form Data upon submission:", formData);
        setRenderState(3);
        router.push(`/${localActive}/status`);
      }
    }
  }

  function onFieldChange(tab: number, listIndex: number, code: string) {
    const localFormData = structuredClone(formData);
    const formLevel = formData.levels[listIndex];
    let selectedOption: FormLevelValue;
    let namevalue: string = "";
    let strategy: number = 0;
    formLevel.options?.forEach((x) => {
      if (x.code === code) {
        selectedOption = x;
        namevalue = x.name;
        strategy = x.strategy_id;
        fetchLevelsAndRender(0, localFormData, listIndex + 1, selectedOption.level_id, selectedOption.id);
        return;
      }
    });
    const codeObject = {
      key: formLevel.name,
      value: namevalue,
      code,
      strategy,
    };

    pushOrResetArrayAfterIndex(localFormData.choices, listIndex, codeObject);
    if (formLevel.input_type == "input") {
      localFormData.choices[listIndex] = {key: formLevel.name, value: code};
      setFormData(localFormData);
      return;
    }
  }
  const handleTabClick = (tab: any, id: number, parent: number) => {
    const updatedFormData = {...formData};
    setSubTab(tab);
    const vals = Level;
    if (vals) {
      const tabIndex = vals.findIndex((option) => option.id === id);
      fetchLevelsAndRender(tab, formData, 0, parent, 0, id);
      if (tabIndex !== -1) {
        const selectedOption = vals[tabIndex];
        setFormData(updatedFormData);
      }
    }
  };
  useEffect(() => {
    updateFaSubmit();
  }, []);

  const renderFormInputs = (subTab: number) => (
    <div>
      {formData.levels.map((x, i) => (
        <div key={`input-${x.level_type}`} className="mb-2 mt-0 p-0">
          {x.input_type === "select" ? (
            <div>
              <label className="text-black text-sm">{x.name}</label>
              <select
                className="outline-none w-full border-t-2 p-3 border border-gray-500 shadow-md rounded-md bg-white"
                onChange={(event) => onFieldChange(subTab, i, event.target.value)}
                value={formData.choices[i]?.code}
                required
              >
                <option value="">Select {x.name}</option>
                {x.options?.map((y, j) => (
                  <option className="p-4" key={`input-option-${y.code}`} value={y.code}>
                    {y.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex flex-col">
              <label className="text-sm text-black">{x.name}</label>
              <input
                type="text"
                className="outline-none w-full p-2 mt-1 rounded-md border"
                onChange={(event) => onFieldChange(subTab, i, event.target.value)}
                value={formData.choices[i]?.value || ""}
                placeholder={`Type ${x.name}`}
                required
              />
              {x.level_type === "email_address" &&
                (formData.choices[i]?.value.length === 0 || !formData.choices[i]?.value.includes("@")) && (
                  <p className="text-sm text-red-500">Invalid {x.name}</p>
                )}
              {x.level_type === "mobile_number" &&
                (formData.choices[i]?.value.length === 0 || formData.choices[i]?.value.length !== 10) && (
                  <p className="text-sm text-red-500">Invalid Phone Number</p>
                )}
              {x.level_type === "account" &&
                (!formData.choices[i]?.value || formData.choices[i]?.value === "") && (
                  <p className="text-sm text-red-500">Invalid {x.name}</p>
                )}
              <div className="flex flex-row gap-4">
                <button
                  className="inline-block mt-4  shadow-md shadow-orange-300 text-white text-sm  bg-black rounded-3xl w-1/2 text-center   hover:bg-customYellow"
                  onClick={() => updateFaSubmit()}
                >
                  {t("submit")}
                </button>

                <div className="inline-block shadow-md shadow-gray-300 mt-4 border border-gray-500 rounded-3xl w-1/2 text-center p-2 hover:border-black hover:border-2">
                  <Link href={`/${localActive}/home`} className="text-gray-500 text-sm">
                    CANCEL
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
  const subTabs = [1, 2, 3];

  return (
    <>
      <div className="2xl:m-36 container ">
        <div className="text-orange-500 text-2xl ">{t("update")}</div>
        <div className="w-full border-b-2 border-orange-200 border-opacity-100 p-2 flex items-start space-x-4"></div>
        {renderState === 1 && (
          <div className="">
            {
              <>
                <div className="mt-2 text-black text-sm">Type</div>
                <div className="flex flex-col mt-1">
                  <div className="flex flex-row gap-4 ">
                    {Level?.map((option, j) => (
                      <div key={`option-${j}`}>
                        <div className="flex flex-row gap-8">
                          <div
                            className={`border-2 border-gray-300 rounded-md w-24 h-24 mr-2 flex-shrink-0 focus:outline-none transition duration-300 transform hover:border-orange-500 hover:shadow-lg ${subTab === j + 1 ? "border-orange-500" : ""}`}
                            onClick={() => handleTabClick(j + 1, option.id, option.parent)}
                          >
                            <div className="flex flex-col m-6 mt-4">
                              <Image
                                className={`w-10 h-10 square-full ${subTab === j + 1 ? "opacity-100" : "opacity-30"}`}
                                src={prefixBasePath(`/img/${option.name}.png`)}
                                alt={option.name}
                                width={50}
                                height={50}
                              />
                              <p
                                className={`text-center text-xs ${subTab === j + 1 ? "text-orange-500" : "text-gray-400"}`}
                              >
                                {option.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {subTab === 1 && renderFormInputs(1)}
                    {subTab === 2 && renderFormInputs(2)}
                    {subTab === 3 && renderFormInputs(3)}
                  </div>
                </div>
              </>
            }
          </div>
        )}
      </div>
    </>
  );
}
