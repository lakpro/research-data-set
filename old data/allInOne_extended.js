// const id = require("./id.json");
let n = 300;
const start = Date.now();
let x = 1;
var gplay = require("google-play-scraper");
const fs = require("fs");
const data = [
  "Approximate location",
  "Precise location",
  "Name",
  "Email address",
  "User IDs",
  "Address",
  "Phone number",
  "Race and ethnicity",
  "Political or religious beliefs",
  "Sexual orientation",
  "Other info",
  "User payment info",
  "Purchase history",
  "Credit score",
  "Other financial info",
  "Health info",
  "Fitness info",
  "Emails",
  "SMS or MMS",
  "Other in-app messages",
  "Photos",
  "Videos",
  "Voice or sound recordings",
  "Music files",
  "Other audio files",
  "Files and docs",
  "Calendar",
  "Contacts",
  "App interactions",
  "In-app search history",
  "Installed apps",
  "Other user-generated content",
  "Other actions",
  "Web browsing history",
  "Crash logs",
  "Diagnostics",
  "Other app performance data",
  "Device or other IDs",
  "App Name",
  "Genre",
];

const idx = {
  "Approximate location": 0,
  "Precise location": 1,
  Name: 2,
  "Email address": 3,
  "User IDs": 4,
  Address: 5,
  "Phone number": 6,
  "Race and ethnicity": 7,
  "Political or religious beliefs": 8,
  "Sexual orientation": 9,
  "Other info": 10,
  "User payment info": 11,
  "Purchase history": 12,
  "Credit score": 13,
  "Other financial info": 14,
  "Health info": 15,
  "Fitness info": 16,
  Emails: 17,
  "SMS or MMS": 18,
  "Other in-app messages": 19,
  Photos: 20,
  Videos: 21,
  "Voice or sound recordings": 22,
  "Music files": 23,
  "Other audio files": 24,
  "Files and docs": 25,
  Calendar: 26,
  Contacts: 27,
  "App interactions": 28,
  "In-app search history": 29,
  "Installed apps": 30,
  "Other user-generated content": 31,
  "Other actions": 32,
  "Web browsing history": 33,
  "Crash logs": 34,
  Diagnostics: 35,
  "Other app performance data": 36,
  "Device or other IDs": 37,
  "App Name": 38,
  Genre: 39,
};
const id = [];
const title = [];
const genr = [];
let finalGenre = null;

async function apps() {
  try {
    await gplay
      .list({
        country: "in",
        category: gplay.category.SHOPPING,
        collection: gplay.collection.TOP_FREE,
        num: n,
      })
      .then(function (info) {
        for (let i = 0; i < n; ++i) {
          id.push(info[i].appId);
          title.push(info[i].title);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  } catch (e) {
    console.log(e);
  }

  // console.log(id);
  // console.log(title);
}

async function gen() {
  await gplay.app({ appId: id[1] }).then(function x(y) {
    finalGenre = y.genre;
  });
  // console.log(genr);
  // console.log(finalGenre);
}

let final = [];
final.push(data);

async function main() {
  try {
    for (let i = 3; i < n; ++i) {
      await gplay.datasafety({ appId: id[i] }).then(function x(y) {
        let rowData = Array(data.length).fill(-1);
        let cData = Array(data.length).fill(-1);
        let sData = Array(data.length).fill(-1);

        rowData[idx["App Name"]] = title[i];
        rowData[idx["Genre"]] = finalGenre;

        y.collectedData.forEach((element) => {
          if (idx[element.data] !== undefined) {
            cData[idx[element.data]] = element.optional;
          }
        });

        y.sharedData.forEach((element) => {
          if (idx[element.data] !== undefined) {
            sData[idx[element.data]] = element.optional;
          }
        });

        for (let i = 0; i < 38; i++) {
          // Not present case is done here
          if (cData[i] === -1 && sData[i] === -1) {
            rowData[i] = 0;
          } else if (cData[i] === -1 && sData[i] === true) {
            rowData[i] = 0.875;
          } else if (cData[i] === -1 && sData[i] === false) {
            rowData[i] = 1;
          }

          // present
          else if (cData[i] != -1) {
            // cData is optional
            if (cData[i] === true && sData[i] === true) {
              rowData[i] = 0.375;
            } else if (cData[i] === true && sData[i] === false) {
              rowData[i] = 0.75;
            } else if (cData[i] === true && sData[i] === -1) {
              rowData[i] = 0.125;
            }

            //cData is mandatory
            else if (cData[i] === false && sData[i] === true) {
              rowData[i] = 0.5;
            } else if (cData[i] === false && sData[i] === false) {
              rowData[i] = 0.625;
            } else if (cData[i] === false && sData[i] === -1) {
              rowData[i] = 0.25;
            }
          }
        }

        final.push(rowData);
        // console.log(cData);
        // console.log(sData);
        // console.log(rowData);
      });

      let csv = final
        .map((item) => {
          var row = item;
          return row.join(",");
        })
        .join("\n");

      await fs.writeFileSync("./data.csv", csv);

      const end = Date.now();
      console.log(x);
      console.log(`Execution time: ${end - start} ms`);
      console.log(`Per APP: ${(end - start) / x} ms`);
      x++;
    }
  } catch (e) {
    console.log(e);
  }
}

apps()
  .then(() => gen())
  .then(() => main());
