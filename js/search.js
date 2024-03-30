import {loadData} from './data.js';

const searchForm = document.getElementById('searchForm');
const userInput = document.getElementById("name");
const searchOptionsContainer = document.querySelector(".searchOptions");
const websiteData = await loadData('sources');

function createCheckBoxes(websites, container) {
  for (let key in websites) {
    const checkboxSection = document.createElement("div");
    checkboxSection.classList.add("form-check");
  
    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.classList.add("form-check-input");
    checkboxInput.id = `${key}Option`;
    checkboxInput.checked = true;
  
    const checkboxLabel = document.createElement("label");
    checkboxLabel.classList.add("form-check-label");
    checkboxLabel.htmlFor = checkboxInput.id;
    checkboxLabel.textContent = websites[key].fullName;
  
    checkboxSection.appendChild(checkboxInput);
    checkboxSection.appendChild(checkboxLabel);
  
    container.appendChild(checkboxSection);
  }

  createEventListeners();
}

function createEventListeners() {
  const selectAllCheckbox = document.getElementById("todosOption");
  const checkboxes = document.querySelectorAll(".searchOptions input[type='checkbox']");
  
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", (event) => {
      if (!event.target.checked) {
        selectAllCheckbox.checked = false;
      } else {
        let allChecked = true;
        for (let i = 0; i < checkboxes.length; i++) {
          const currentCheckbox = checkboxes[i];
          if (currentCheckbox !== selectAllCheckbox && !currentCheckbox.checked) {
            allChecked = false;
            return;
          }
        }
        selectAllCheckbox.checked = allChecked;
      }
    });
  });
  
  selectAllCheckbox.addEventListener("change", (event) => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = event.target.checked;
    });
  });
}

function googleSearch(input) {
  const url = `https://www.google.com/search?q="${input}"`;
  window.open(url, "_blank");
}

function transparenciaSearch(input) {
  const url = `https://portaldatransparencia.gov.br/busca?termo=${input}`;
  window.open(url, "_blank");
}

function jusbrasilSearch(input) {
  const url = `https://www.jusbrasil.com.br/busca?q="${input}"`;
  window.open(url, "_blank");
}

function escavadorSearch(input) {
  const url = `https://www.escavador.com/busca?qo=c&q=${input}`;
  window.open(url, "_blank");
}

function youtubeSearch(input) {
  const url = `https://www.youtube.com/results?search_query=${input}`;
  window.open(url, "_blank");
}

function createURL(domain, path) {
  return `${domain}"${path}"`;
}

createCheckBoxes(websiteData, searchOptionsContainer);

searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const encodedInput = encodeURIComponent(userInput.value);
  const checkboxes = document.querySelectorAll(".searchOptions input[type='checkbox']");

  for (let i = 1; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      const websiteId = checkboxes[i].id;
      const websiteName = websiteId.replace("Option", "");
      window.open(createURL(websiteData[websiteName].url, encodedInput), "_blank");
    }
  }
});