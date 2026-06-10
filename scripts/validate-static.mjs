import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, "index.html"), "utf8");

const requiredFiles = [
  "firestore.rules",
  "database.rules.json",
  "firestore.indexes.json",
  "src/data/seedRoadmaps.js",
  "src/data/resourcesCatalog.js"
];

for (const file of requiredFiles) {
  readFileSync(join(root, file), "utf8");
}

JSON.parse(readFileSync(join(root, "database.rules.json"), "utf8"));
JSON.parse(readFileSync(join(root, "firestore.indexes.json"), "utf8"));

const forbidden = [
  `local${"Storage"}`,
  `session${"Storage"}`,
  `Local ${"backup"} saved`,
  `local ${"backup"}`,
  `saved ${"locally"}`
];

const found = forbidden.filter(term => html.toLowerCase().includes(term.toLowerCase()));
if (found.length) {
  throw new Error(`Forbidden persistence copy/API found in index.html: ${found.join(", ")}`);
}

const requiredSnippets = [
  "getApps().length ? getApp() : initializeApp(firebaseConfig)",
  "signInWithPopup",
  "signInWithRedirect",
  "getRedirectResult",
  "users\", user.uid, \"roadmapProgress\"",
  "Could not save to Firebase. Please check your internet/Firebase rules."
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing required implementation snippet: ${snippet}`);
  }
}

console.log("Static validation passed.");
