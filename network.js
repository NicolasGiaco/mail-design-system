import axios from "axios";
import CONFIG from "./config.js";

// TODO: implement error logic et clean code

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
        username: CONFIG.username,
        password: CONFIG.password,
      },
    }
  );

  console.log("Upload finish !");
}

async function uploadTemplate(translated_key, html) {
  try {
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
        Locale: translated_key,
        Name: "Translated_" + translated_key,
        OwnerType: "user",
        Presets: "Test",
        Purposes: ["transactional"],
      },
      {
        auth: {
          username: CONFIG.username,
          password: CONFIG.password,
        },
      }
    );
    const ID = response.data.Data[0]["ID"];

    updateExistingTemplate(html, ID);
  } catch (error) {
    console.error(
      "An error occured while creating template, please make sure a template with the same name isn't in Mailjet"
    );
  }
}

export { uploadTemplate };
