import {loadData} from './utils.js';

const websiteData = await loadData('sources');
const text = document.getElementById("numOfSources");

text.innerHTML = Object.keys(websiteData).length;
