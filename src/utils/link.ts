import {LinkOrUpdate} from "../app/components/update-fa-box";
import {prefixBaseApiPath} from "./path";

export function linkFa(levelValues: LinkOrUpdate) {
  const requestBody = {
    request_header: {},
    request_pagination: {
      request_page: 0,
      page_size: 0,
    },
    request_payload: {
      fa: levelValues,
      name: "string",
      phone_number: "string",
      additional_info: [{}],
    },
  };

  fetch(prefixBaseApiPath("/link"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  console.log(levelValues);
}
