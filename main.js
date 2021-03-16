import mjml2html from "mjml";
import fs from "fs";
import { uploadTemplate } from "./network.js";
import {
  findMatchingTranslation,
  searchSanitizedStringInArray,
} from "./utils.js";

// We first get translations from translation.json

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
    const keyFound = findMatchingTranslation(
      mjmlTextSanatized,
      translations,
      translations_keys
    );

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

function getAllTraductionExeptOriginal(string, originalString) {
  const values_from_translation_found = Object.values(
    translations[translation_found]
  );
  const found = searchSanitizedStringInArray(
    string,
    values_from_translation_found
  );

  if (found >= 0)
    for (let it = 1; it < transleted_array.length; it++) {
      const key = translations_keys[it];
      const sanatizeSentence = string.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
      const replacedSentence = originalString.replace(
        sanatizeSentence,
        Object.values(translations[key])[found]
      );

      replacedSentence
        ? (transleted_array[it] += replacedSentence)
        : console.log(
            "Warning: translation not found ! Please check your translations files"
          );
    }

  return found === -1 ? false : true;
}

// Now that we have our translation key, we translate

const transleted_array = new Array(translations_keys.length).fill("");

for (let iterator in mjmlFile) {
  const mjmlText = mjmlFile[iterator];

  if (mjmlText.includes("mj-text")) {
    const mjmlTextSanatized = mjmlText.replace(/(<([^>]+)>)/gi, "");

    const hasTranslated = getAllTraductionExeptOriginal(
      mjmlTextSanatized,
      mjmlFile[iterator]
    );

    if (!hasTranslated)
      for (let translation in transleted_array) {
        transleted_array[translation] += mjmlFile[iterator];
      }
  } else {
    for (let translation in transleted_array) {
      transleted_array[translation] += mjmlFile[iterator];
    }
  }
}

// NETWORK logic

console.log("Sending HTML ...");

for (let it = 0; it < transleted_array.length; it++) {
  const { html } = mjml2html(transleted_array[it], {});
  const translated_key = translations_keys[it];

  uploadTemplate(translated_key, html);
}
