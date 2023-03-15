// const id = require("./id.json");
let n = 660;
const start = Date.now();
var gplay = require("google-play-scraper");
const fs = require("fs");
const data = [
  "Location",
  "Personal info",
  "Financial info",
  "Health and fitness",
  "Messages",
  "Photos and videos",
  "Audio",
  "Files and docs",
  "Contacts",
  "App activity",
  "App info and performance",
  "Device or other IDs",
  "App Name",
  "Genre",
];

const idx = {
  Location: 0,
  "Personal info": 1,
  "Financial info": 2,
  "Health and fitness": 3,
  Messages: 4,
  "Photos and videos": 5,
  Audio: 6,
  "Files and docs": 7,
  Contacts: 8,
  "App activity": 9,
  "App info and performance": 10,
  "Device or other IDs": 11,
  "App Name": 12,
  Genre: 13,
};
const id = [];
const title = [];
const genr = [];
let finalGenre = null;

async function apps() {
  await gplay
    .list({
      country: "in",
      category: gplay.category.WATCH_FACE,
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

  console.log(id);
  console.log(title);
}

async function gen() {
  for (let i = 0; i < 3; ++i) {
    await gplay.app({ appId: id[i] }).then(function x(y) {
      genr.push(y.genre);
    });
  }

  if (genr[1] == genr[2]) finalGenre = genr[1];
  else finalGenre = genr[0];

  console.log(genr);
  console.log(finalGenre);
}

let final = [];
final.push(data);

async function main() {
  for (let i = 0; i < n; ++i) {
    await gplay.datasafety({ appId: id[i] }).then(function x(y) {
      let rowData = Array(data.length).fill(-1);
      let cData = Array(data.length).fill(-1);
      let sData = Array(data.length).fill(-1);

      //   gplay.app({ appId: id[i] }).then(function (z) {
      rowData[idx["App Name"]] = title[i];
      rowData[idx["Genre"]] = finalGenre;
      //   });

      //   console.log(0);

      y.collectedData.forEach((element) => {
        // console.log(1);
        if (idx[element.type] !== undefined) {
          cData[idx[element.type]] = element.optional;
        }
      });

      y.sharedData.forEach((element) => {
        // console.log(2);
        if (idx[element.type] !== undefined) {
          sData[idx[element.type]] = element.optional;
        }
      });

      for (let i = 0; i < 12; i++) {
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
      console.log(cData);
      console.log(sData);
      console.log(rowData);
      //   console.log(cData);
      //   console.log(final);
      //   console.log("---------------------------");
    });
  }

  let csv = final
    .map((item) => {
      var row = item;
      return row.join(",");
    })
    .join("\n");

  await fs.writeFileSync("./data.csv", csv);

  //   console.log(final);
  const end = Date.now();
  console.log(`Execution time: ${end - start} ms`);
  console.log(`Execution time: ${(end - start) / n} ms`);
}

apps()
  .then(() => gen())
  .then(() => main());
