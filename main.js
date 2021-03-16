import mjml2html from "mjml";
import fs from "fs";
import { uploadTemplate } from "./network.js";
import {
  findMatchingTranslation,
  searchSanitizedStringInArray,
} from "./utils.js";

/**
 * VARIABLES
 */

// We first get translations from translation.json and mjmlFile text

const json = fs.readFileSync("translation.json");
const mjmlFile = fs.readFileSync("template.mjml").toString().split("\n");
const translations = JSON.parse(json);
const translations_keys = Object.keys(translations);

let translation_found = undefined;

/**
 * FUNCTIONS
 */

// This function will allow us to translate
// ! should be in a different file and cleaner
function tryToTranslateText(string, originalString) {
  const values_from_translation_found = Object.values(
    translations[translation_found]
  );
  const found = searchSanitizedStringInArray(
    string,
    values_from_translation_found
  );

  if (found >= 0)
    for (let it = 0; it < translated_array.length; it++) {
      const key = translations_keys[it];
      const sanatizeSentence = string.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
      const replacedSentence = originalString.replace(
        sanatizeSentence,
        Object.values(translations[key])[found]
      );

      replacedSentence
        ? (translated_array[it] += replacedSentence)
        : console.log(
            "Warning: translation not found ! Please check your translations files"
          );
    }

  return found === -1 ? false : true;
}

/**
 * MAIN
 */

// First we try to find the translation key so we know what to translate
// We iterate through the mjml to get the first mjmjl-text

for (let iterator in mjmlFile) {
  const mjmlText = mjmlFile[iterator];

  if (mjmlText.includes("mj-text")) {
    /*
     ** We sanitize the mjml-text because it include some htmltag
     ** Then, we try to find a matching sentence with others translations
     ** so we know which language is being use in the mjml
     */
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

// TODO: if no matching translation, handle herror
if (!translation_found) {
  console.error(
    "Error: no matching translation found ! Please check your files"
  );
}

console.log("Language detectd ! : " + translation_found);

// Now that we have our translation key, we translate
// This array is our result, Array[0] contains the mjml string for EN, Array[1] => Fr, etc ...
const translated_array = new Array(translations_keys.length).fill("");

for (let iterator in mjmlFile) {
  const mjmlText = mjmlFile[iterator];

  if (mjmlText.includes("mj-text")) {
    // We check if line contain text, then we sanatize it and we try to translate it
    const mjmlTextSanatized = mjmlText.replace(/(<([^>]+)>)/gi, "");
    const hasTranslated = tryToTranslateText(
      mjmlTextSanatized,
      mjmlFile[iterator]
    );

    //If not, we place original one
    if (!hasTranslated)
      for (const translation in translated_array) {
        translated_array[translation] += mjmlFile[iterator];
      }
  } else {
    for (const translation in translated_array) {
      translated_array[translation] += mjmlFile[iterator];
    }
  }
}

console.log("Sending HTML ...");

// NETWORK logic

for (let it = 0; it < translated_array.length; it++) {
  const { html } = mjml2html(translated_array[it], {});
  const translated_key = translations_keys[it];

  uploadTemplate(translated_key, html);
}
