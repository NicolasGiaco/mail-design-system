function findMatchingTranslation(string, translations, translations_keys) {
  for (const key of translations_keys) {
    const values = Object.values(translations[key]);

    return searchSanitizedStringInArray(string, values) !== -1 ? key : -1;
  }
}

function searchSanitizedStringInArray(string, stringArray) {
  const sanitizeString = string.replace(/\s/g, "");

  for (let j = 0; j < stringArray.length; j++) {
    if (stringArray[j].replace(/\s/g, "").match(sanitizeString)) return j;
  }
  return -1;
}

export { findMatchingTranslation };
