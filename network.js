import axios from "axios";
// TODO: implement error logic

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
      Locale: translated_key,
      Name: "Transleted " + translated_key,
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

export { uploadTemplate };
