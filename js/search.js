import { createDropdownItems } from './createDropdownItems.js';
import {loadData, createURL, getFormatFunction, getValidationFunction, setValidation, isValid} from './utils.js';

const dropdowns = document.querySelectorAll("ul.dropdown-menu");
const inputTexts = document.querySelectorAll("input[type='text']");
const countryCodeDiv = document.getElementById("countryCodeDiv");
const websiteData = await loadData('sources');
const countryData = await loadData('countryCodes');
let linksToOpen = [];

function filterJsonByAttribute(json, attribute) {
  return Object.entries(json).filter(([key, value]) => value.info.includes(attribute));
}

function sortEntries(entries) {
  const [firstEntry, ...restEntries] = entries;
  const sortedRestEntries = restEntries.sort(([aKey], [bKey]) => aKey.localeCompare(bKey));
  return [firstEntry, ...sortedRestEntries];
}

function addInputListenerAndFormat(elementId, formatFunction, validationFunction) {
  const inputElement = document.getElementById(elementId);
  inputElement.addEventListener("input", function(e) {
    const formattedValue = formatFunction(e.target.value);
    e.target.value = formattedValue;
    if (validationFunction) {
      setValidation(e.target, validationFunction(formattedValue));
    }
  });
}

function createEventListenersOnCheckboxes(field) {
  const checkboxes = document.querySelectorAll(`[data-text=${field}] input[type='checkbox']`);
  const selectAllCheckbox = document.getElementById(`todos-${field}-option`);

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

function getLinks(field) {
  const checkboxes = document.querySelectorAll(`[data-text=${field}] input[type='checkbox']:checked`);
  let inputValue = document.getElementById(`input-${field}`).value;
  let encodedInput = "";
  let links = [];

  if (!inputValue) return;

  if (field === "phone") {
    inputValue = document.getElementById("countryCodeSelector").value + inputValue;
  }
  encodedInput = encodeURIComponent(inputValue);

  checkboxes.forEach((checkbox) => {
    try {
      const websiteName = checkbox.id.split("-")[0];
      if (websiteName == "todos") return;
      const website = websiteData[websiteName];
      links.push(createURL(website.url, encodedInput, website.quotes));
    } catch (error) {
      console.error(error);
    }
  });
  return links;
}

function openLinks(links) {
  links.forEach(link => {
    window.open(link, "_blank");
  });
}

function openConfirmDialog() {
  const searchModal = new bootstrap.Modal(document.getElementById('searchModal'));
  const sourcesCount = linksToOpen.length

  if (sourcesCount > 0) {
    const confirmText = document.getElementById("confirmText");
    document.getElementById("selectedSourcesCount").innerHTML = sourcesCount;
    if (sourcesCount == 1) {
      confirmText.innerHTML = "fonte de pesquisa que abrirá em outra aba"
    } else {
      confirmText.innerHTML = "fontes de pesquisa que abrirão em outras abas"
    }
    searchModal.show();
  } else {
    const toast = document.getElementById('nothingToSearchToast');
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
  }
}

function initializeEventListeners() {
  inputTexts.forEach(input => {
    const field = input.getAttribute("data-text");
    const formatFunction = getFormatFunction(field);
    const validationFunction = getValidationFunction(field);
    input.addEventListener("blur", function() {
      setValidation(this, !this.value.length ? null : isValid(field, this.value));
    });
    addInputListenerAndFormat(`input-${field}`, formatFunction, validationFunction);
  });

  document.getElementById('search-button').addEventListener('click', function(e) {
    e.preventDefault();
    linksToOpen = [];
  	for (const input of inputTexts) {
      if (input.value) {
        const type = input.getAttribute("data-text");
        if (isValid(type, input.value)) {
          linksToOpen.push(...getLinks(type));
        }
      }
    }
    openConfirmDialog();
  });

  document.getElementById('confirmSearchBtn').addEventListener('click', function() {
    openLinks(linksToOpen);
    const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
    searchModal.hide();
  });
}

function initializeCountrySelector() {
  const countryCodeSelector = document.createElement("select");
  countryCodeSelector.classList.add("form-select");
  countryCodeSelector.id = "countryCodeSelector";

  countryData.forEach(country => {
    const option = document.createElement("option");
    option.value = `+${country.code}`;
    option.textContent = `${country.iso} +${country.code}`;
    if (country.iso === "BR") option.selected = true;
    countryCodeSelector.appendChild(option);
  });

  countryCodeDiv.appendChild(countryCodeSelector);
}

function initializeDropdowns() {
  dropdowns.forEach(dropdown => {
    const field = dropdown.getAttribute('data-text');
    const items = filterJsonByAttribute(websiteData, field);
    const sortedItems = sortEntries(items);
    createDropdownItems(dropdown, sortedItems, field);
    createEventListenersOnCheckboxes(field);
  });
}

initializeDropdowns();
initializeCountrySelector();
initializeEventListeners();
