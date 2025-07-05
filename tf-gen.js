const { removeStopwords } = require("stopword");
const removePunc = require("remove-punctuation");


// const documents = [
//   "The sky is Blue",
//   "The sun is bright today",
//   "The sun in the sky is bright",
//   "We can see the shining sun, the bright sun",
// ];

/** 
 * ["The sky is Blue",
  "The sun is bright today"
  "The sun in the sky is bright"
  "We can see the shining sun the bright sun"]
 * 
  "The sky is Blue\r"

  ["the", 'sky', 'is', 'Blue\r']
 * 
 
  [blue, bright, can see shining sky sun sun, today]
  [the], ['Blue', ''];
*/

//Reading file content and pushing them into a documents array

let documents = [];
const fs = require("fs");
const path = require("path");

const N = 3023;
for (let i = 1; i <= N; i++) {
  const str = path.join(__dirname, "Problems");
  const str1 = path.join(str, `problem_text_${i}.txt`);
  console.log(str1);
  const question = fs.readFileSync(str1).toString();
  //   console.log(question);
  documents.push(question);
  // console.log(str1);
}
//splitting paras into lines and lines into words and then finally generating key words by removing unwanted carriage characters

let docKeywords = [];
for (let i = 0; i < documents.length; i++) {
  const lines = documents[i].split("\n");
  // console.log(lines);
  const docWords = [];
  for (let k = 0; k < lines.length; k++) {
    const temp1 = lines[k].split(" ");

    temp1.forEach((e) => {
      e = e.split("\r");
      if (e[0].length) docWords.push(e[0]);
    });
  }
 // removing stop words and sorthing them again converting them into lower case and removing punctuations
  const newString = removeStopwords(docWords);
  newString.sort();
  let temp = [];
  for (let j = 0; j < newString.length; j++) {
    newString[j] = newString[j].toLowerCase();
    newString[j] = removePunc(newString[j]);
    if (newString[j] !== "") temp.push(newString[j]);
  }

  docKeywords.push(temp);
}


let sum = 0;
// calculating document length for each document
for (let i = 0; i < N; i++) {
  const length = docKeywords[i].length;
  sum += length;
  fs.appendFileSync("length.txt", length + "\n");
  console.log(length);
}

// generating global unique key words

let keywords = [];
for (let i = 0; i < N; i++) {
  for (let j = 0; j < docKeywords[i].length; j++) {
    if (keywords.indexOf(docKeywords[i][j]) === -1)
      keywords.push(docKeywords[i][j]);
  }
}

keywords.sort();
// writing all global unique words into keywords.txt
const W = keywords.length;
keywords.forEach((word) => {
  fs.appendFileSync("keywords.txt", word + "\n");
});

// calculating Term freq for each keyword w.r.t to each document
let TF = new Array(N);
for (let i = 0; i < N; i++) {
  TF[i] = new Array(W).fill(0); //making all zero
  let map = new Map();
  docKeywords[i].forEach((key) => {
    return map.set(key, 0);
  });

//keywords for each document along with their frequencies added to the map
  docKeywords[i].forEach((key) => {
    let cnt = map.get(key);
    cnt++;
    return map.set(key, cnt);
  });

// calculate TF
  docKeywords[i].forEach((key) => {
    const id = keywords.indexOf(key);
    if (id !== -1) {
      TF[i][id] = map.get(key) / docKeywords[i].length;
    }
  });
}


for (let i = 0; i < N; i++) {
  for (let j = 0; j < W; j++) {
    //ith document and jth keyword TF not equal to zero then pushing them to TF.txt
    if (TF[i][j] != 0)
      fs.appendFileSync("TF.txt", i + " " + j + " " + TF[i][j] + "\n"); // storing actual count because of BM_25 formula
  }

}


// calculating IDF formula for BM-25
let IDF = new Array(W);
for (let i = 0; i < W; i++) {
  let cnt = 0;
  for (let j = 0; j < N; j++) {
    if (TF[j][i]) {
      cnt++;
    }
  }

  if (cnt) IDF[i] = Math.log((N - cnt + 0.5) / (cnt + 0.5) + 1) + 1;
}

//APPENDING IDF VALUES TO IDF.TXT

IDF.forEach((word) => {
  fs.appendFileSync("IDF.txt", word + "\n");
});

// let TFIDF = new Array(N);

// for (let i = 0; i < N; i++) {
//   TFIDF[i] = new Array(W);
//   for (let j = 0; j < W; j++) {
//     TFIDF[i][j] = TF[i][j] * IDF[j];
//   }
// }

// // console.log("TFIDF cal done");

// for (let i = 0; i < N; i++) {
//   for (let j = 0; j < W; j++) {
//     if (TFIDF[i][j] != 0)
//       fs.appendFileSync("TFIDF.txt", i + " " + j + " " + TFIDF[i][j] + "\n");
//   }

//   fs.appendFileSync("TFIDF.txt", "\n".toString());
// }

// for (let i = 0; i < N; i++) {
//   let sqrsum = 0;
//   for (let j = 0; j < W; j++) {
//     sqrsum += TFIDF[i][j] * TFIDF[i][j];
//   }

//   fs.appendFileSync("Magnitude.txt", Math.sqrt(sqrsum) + "\n");
// }

// // const query =
// //   "minimum number of elements you need to add to make the sum of the array equal to goal.";
// // const oldString = query.split(" ");
// // const newString = removeStopwords(oldString);
// // newString.sort(); // newString is an array
// // let queryKeywords = [];

// // for (let j = 0; j < newString.length; j++) {
// //   newString[j] = newString[j].toLowerCase();
// //   newString[j] = removePunc(newString[j]);
// //   if (newString[j] !== "") queryKeywords.push(newString[j]);
// // }
// // // console.log(queryKeywords);
// // // now we need to filter out those keywords which are present in our corpse
// // let temp = [];
// // for (let i = 0; i < queryKeywords.length; i++) {
// //   const id = keywords.indexOf(queryKeywords[i]);
// //   if (id !== -1) {
// //     temp.push(queryKeywords[i]);
// //   }
// // }

// // queryKeywords = temp;
// // queryKeywords.sort();
// // console.log(queryKeywords);

// // let qTF = new Array(W).fill(0);
// // let qTFIDF = new Array(W).fill(0);
// // let map = new Map();
// // queryKeywords.forEach((key) => {
// //   return map.set(key, 0);
// // });

// // queryKeywords.forEach((key) => {
// //   let cnt = map.get(key);
// //   cnt++;
// //   return map.set(key, cnt);
// // });

// // queryKeywords.forEach((key) => {
// //   const id = keywords.indexOf(key);
// //   if (id !== -1) {
// //     qTF[id] = map.get(key) / queryKeywords.length;
// //     qTFIDF[id] = qTF[id] * IDF[id];
// //   }
// // });

// // // console.log(qTFIDF);

// // // SIMILARITY OF EACH DOC WITH QUERY STRING
// // const arr = [];

// // for (let i = 0; i < N; i++) {
// //   const s = cosineSimilarity(TFIDF[i], qTFIDF);
// //   // console.log(s);
// //   arr.push({ id: i, sim: s });
// // }

// // arr.sort((a, b) => b.sim - a.sim);
// // for (let i = 0; i < 5; i++) {
// //   console.log(arr[i]);
// // }
