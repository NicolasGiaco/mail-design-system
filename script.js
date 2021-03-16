import mjml2html from "mjml";
import fs from "fs";
import axios from "axios";

// We first get translations from translation.json

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function searchStringInArray(string, stringArray) {
  const sanitizeString = string.replace(/\s/g, "");

  for (let j = 0; j < stringArray.length; j++) {
    if (stringArray[j].replace(/\s/g, "").match(sanitizeString)) return j;
  }
  return -1;
}

function findMatchingTranslation(string) {
  for (const key of translations_keys) {
    const values = Object.values(translations[key]);

    return searchStringInArray(string, values) !== -1 ? key : -1;
  }
}

const json = fs.readFileSync("translation.json");
const translations = JSON.parse(json);
const translations_keys = Object.keys(translations);

const mjmlFile = fs.readFileSync("template.mjml").toString().split("\n");
let translation_found = undefined;

// First we try to find the translation key

for (let iterator in mjmlFile) {
  const mjmlText = mjmlFile[iterator];

  if (mjmlText.includes("mj-text")) {
    const mjmlTextSanatized = mjmlText.replace(/(<([^>]+)>)/gi, "");
    const keyFound = findMatchingTranslation(mjmlTextSanatized);

    if (keyFound !== -1) {
      translation_found = keyFound;
      break;
    }
  }
}

if (!translation_found) {
  console.error(
    "Error: no matching translation found ! Please check your files"
  );
}

console.log("Language detectd ! : " + translation_found);

// Now that we have our translation key, we translate

const transleted_array = new Array(translations_keys.length).fill("");

for (let iterator in mjmlFile) {
  const mjmlText = mjmlFile[iterator];

  if (mjmlText.includes("mj-text")) {
    const mjmlTextSanatized = mjmlText.replace(/(<([^>]+)>)/gi, "");
    const values_from_translation = Object.values(
      translations[translation_found]
    );

    /**
     * NOT FINISH, we have to implement translation logic
     */

    // const strInArray = searchStringInArray(
    //   mjmlTextSanatized,
    //   values_from_translation
    // );

    // if (strInArray > 0) {
    //     fo

    // } else {
    // for (let translation in transleted_array) {
    //   transleted_array[translation] += mjmlFile[iterator];
    // }
  } else {
    for (let translation in transleted_array) {
      transleted_array[translation] += mjmlFile[iterator];
    }
  }
}

// NETWORK logic

async function updateExistingTemplate(html, ID) {
  const response = await axios.post(
    `https://api.mailjet.com/v3/REST/template/${ID}/detailcontent`,
    {
      Headers: "",
      "Html-part": html,
      MJMLContent: "",
      "Text-part":
        "Dear passenger, welcome to Mailjet! May the delivery force be with you!",
    },
    {
      auth: {
        username: "ff3ca2010efd61d70273141b9974f699",
        password: "633aea732872d0753327da7b82d1d826",
      },
    }
  );
}

async function uploadTemplate(translated_key, html) {
  const response = await axios.post(
    "https://api.mailjet.com/v3/REST/template",
    {
      Author: "Nicolas GIACOMAROSA",
      Categories: ["transactional", "marketing"],
      Copyright: "Mailjet",
      Description: "Used to send out promo codes.",
      EditMode: 1,
      IsStarred: true,
      IsTextPartGenerationEnabled: true,
      Locale: translations_keys[translated_key],
      Name: "Transleted " + translations_keys[translated_key],
      OwnerType: "user",
      Presets: "Test",
      Purposes: ["transactional"],
    },
    {
      auth: {
        username: "ff3ca2010efd61d70273141b9974f699",
        password: "633aea732872d0753327da7b82d1d826",
      },
    }
  );

  const ID = response.data.Data[0]["ID"];

  updateExistingTemplate(html, ID);
}

console.log("Sending HTML ...");

for (let it = 0; it < transleted_array.length; it++) {
  const { html } = mjml2html(transleted_array[it], {});

  uploadTemplate(it, html);
}

// console.log(html);
