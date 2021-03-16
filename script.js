import mjml2html from "mjml";
import fs from "fs";

// We first get translations from translation.json

const json = fs.readFileSync("translation.json");
const translations = JSON.parse(json);

const mjmlFile = fs.readFileSync("template.mjml").toString().split("\n");

let mjmlFormatted = "";

for (let iterator in mjmlFile) {
  const mjmlText = mjmlFile[iterator];

  if (mjmlText.includes("mj-text")) {
    const mjmlTextSanatized = mjmlText.replace(/(<([^>]+)>)/gi, "");

    mjmlFormatted += mjmlText;
  } else mjmlFormatted += mjmlFile[iterator];
}

/*
  Compile an mjml string
*/
const htmlOutput = mjml2html(mjmlFormatted, {});

// console.log(htmlOutput);
