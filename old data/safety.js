const id = require("./id.json");
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

let final = [];
final.push(data);

async function main() {
  for (let i = 0; i < n; ++i) {
    await gplay.datasafety({ appId: id[i] }).then(function x(y) {
      let rowData = Array(data.length).fill(-1);
      let cData = Array(data.length).fill(-1);
      let sData = Array(data.length).fill(-1);

      gplay.app({ appId: id[i] }).then(function (z) {
        cData[idx["App Name"]] = z.title;
        cData[idx["Genre"]] = z.genre;
      });

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

      final.push(cData);
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

main();
