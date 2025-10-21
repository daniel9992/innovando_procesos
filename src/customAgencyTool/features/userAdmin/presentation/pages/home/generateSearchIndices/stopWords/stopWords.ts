import stopWordEn from './stopWords-en.json';
import stopWordEs from './stopWords-es.json';

// const stopWordEs = require("./stopWords-es.json");
// const stopWordEn = require("./stopwrods-en.json");

const listOfEs: Array<string> = stopWordEs;
const listOfEn: Array<string> = stopWordEn;

export const STOP_WORDS: Set<string> = new Set([...listOfEs, ...listOfEn]);
