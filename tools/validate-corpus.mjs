import fs from "node:fs";
import vm from "node:vm";
import { parse } from "yaml";

const root = new URL("../", import.meta.url);
const path = (file) => new URL(file, root);
const writeJson = process.argv.includes("--write-json");
const VERSION = "1.7";
const LICENSE = "CC BY 4.0";
const SOURCE = "https://kishormorol.github.io/SkillsAllYouNeed/";

function read(file) {
  return fs.readFileSync(path(file), "utf8");
}

function fail(message) {
  throw new Error(message);
}

function loadData() {
  const source = read("data.js");
  const sandbox = {
    document: {
      createElement: () => ({}),
      head: { appendChild: () => {} }
    },
    localStorage: { getItem: () => "[]", setItem: () => {} },
    console
  };

  vm.runInNewContext(
    `${source}\n;globalThis.__corpus = { ECO, ECOSYSTEMS, SKILLS, HOWTO, MATRIX_ROWS, CATEGORIES, STATUSES, NEW_IDS };`,
    sandbox,
    { filename: "data.js" }
  );

  return sandbox.__corpus;
}

function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function issueField(id, expectedType) {
  const field = issueForm.body?.find((item) => item.id === id);
  if (!field) fail(`submit-capability.yml is missing ${id}`);
  if (field.type !== expectedType) fail(`submit-capability.yml ${id} must use type ${expectedType}`);
  if (field.validations?.required !== true) {
    fail(`submit-capability.yml ${id} must set validations.required to true`);
  }
  return field;
}

function issueOptions(id) {
  const options = issueField(id, "dropdown").attributes?.options;
  if (!Array.isArray(options)) fail(`submit-capability.yml ${id} must define dropdown options under attributes`);
  return options;
}

const data = loadData();
const jsonPath = path("skills.json");
const skillsJson = JSON.parse(read("skills.json"));
const styles = read("styles.css");
const issueTemplate = read(".github/ISSUE_TEMPLATE/submit-capability.yml");
const issueForm = parse(issueTemplate);
parse(read(".github/workflows/validate-corpus.yml"));

const ecosystemNames = Object.keys(data.ECO);
const skillIds = new Set();
const skillsWithHowto = data.SKILLS.map((skill) => ({
  ...skill,
  howto: skill.howto || data.HOWTO[skill.id]
}));

for (const skill of skillsWithHowto) {
  for (const field of ["id", "name", "ecosystem", "category", "status", "description", "trigger", "howto", "example", "source"]) {
    if (!skill[field]) fail(`${skill.id || skill.name || "unknown skill"} is missing ${field}`);
  }
  if (skillIds.has(skill.id)) fail(`duplicate skill id: ${skill.id}`);
  skillIds.add(skill.id);
  if (!data.ECO[skill.ecosystem]) fail(`${skill.id} uses unknown ecosystem: ${skill.ecosystem}`);
  if (!data.CATEGORIES.includes(skill.category)) fail(`${skill.id} uses unknown category: ${skill.category}`);
  if (!data.STATUSES.includes(skill.status)) fail(`${skill.id} uses unknown status: ${skill.status}`);
}

for (const id of Object.keys(data.HOWTO)) {
  if (!skillIds.has(id)) fail(`HOWTO references missing skill: ${id}`);
}

for (const [ecosystem, config] of Object.entries(data.ECO)) {
  if (!config.prefix) fail(`${ecosystem} is missing a CSS prefix`);
  if (!config.color) fail(`${ecosystem} is missing a color`);
  if (!config.glyph) fail(`${ecosystem} is missing a glyph`);
  if (!config.blurb) fail(`${ecosystem} is missing a blurb`);
  if (!styles.includes(`--eco-${config.prefix}:`)) fail(`styles.css missing --eco-${config.prefix}`);
}

for (const row of data.MATRIX_ROWS) {
  if (row.length !== ecosystemNames.length + 1) {
    fail(`matrix row "${row[0]}" has ${row.length - 1} cells; expected ${ecosystemNames.length}`);
  }
  for (const value of row.slice(1)) {
    if (!["y", "p", "n"].includes(value)) fail(`matrix row "${row[0]}" has invalid value: ${value}`);
  }
}

for (const id of data.NEW_IDS) {
  if (!skillIds.has(id)) fail(`NEW_IDS references missing skill: ${id}`);
}

for (const [field, type] of Object.entries({
  name: "input",
  ecosystem: "dropdown",
  category: "dropdown",
  status: "dropdown",
  description: "textarea",
  trigger: "input",
  howto: "textarea",
  example: "textarea",
  source: "input"
})) {
  issueField(field, type);
}

for (const [id, expected] of [["ecosystem", ecosystemNames], ["category", data.CATEGORIES], ["status", data.STATUSES]]) {
  const actual = issueOptions(id);
  if (!sameJson(actual, expected)) {
    fail(`submit-capability.yml ${id} options are stale: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)}`);
  }
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(skillsJson.generated)) fail("skills.json generated date must use YYYY-MM-DD");

const expectedJson = {
  version: VERSION,
  generated: skillsJson.generated,
  count: skillsWithHowto.length,
  ecosystems: ecosystemNames,
  description: `SkillsAllYouNeed — open registry of AI skills for ${ecosystemNames.slice(0, -1).join(", ")}, and ${ecosystemNames.at(-1)}.`,
  license: LICENSE,
  source: SOURCE,
  skills: skillsWithHowto
};

if (writeJson) {
  expectedJson.generated = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(jsonPath, `${JSON.stringify(expectedJson, null, 2)}\n`);
  console.log(`wrote skills.json (${expectedJson.count} skills)`);
}

const currentJson = writeJson ? JSON.parse(read("skills.json")) : skillsJson;
const comparableExpectedJson = writeJson ? expectedJson : { ...expectedJson, generated: currentJson.generated };

if (!sameJson(currentJson, comparableExpectedJson)) {
  fail("skills.json is out of sync with data.js; run `node tools/validate-corpus.mjs --write-json`");
}

console.log(`corpus ok: ${skillsWithHowto.length} skills, ${ecosystemNames.length} ecosystems, ${data.MATRIX_ROWS.length} matrix rows`);
