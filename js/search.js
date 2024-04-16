import { createDropdownItems } from './createDropdownItems.js';
import {loadData, createURL, formatCPF, formatUsername, toDigits, toAlphaNum, setValidation, isValid} from './utils.js';

const searchForm = document.getElementById('search-form');
const dropdowns = document.querySelectorAll("ul.dropdown-menu");
const inputTexts = document.querySelectorAll("input[type='text']");
const countryCodeDiv = document.getElementById("countryCodeDiv");
const websiteData = await loadData('sources');
const countryData = await loadData('countryCodes');

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

function getFormatFunction(field) {
  switch (field) {
    case 'cpf':
      return formatCPF;
    case 'username':
      return formatUsername;
    case 'phone':
    case 'imei':
    case 'cnpj':
      return toDigits;
    case 'plate':
      return toAlphaNum;
    default:
      return (value) => value;
  }
}

function getValidationFunction(field) {
  switch (field) {
    case 'cpf':
      return (value) => value.length < 14 ? null : isValid(field, value);
    case 'plate':
      return (value) => value.length < 7 ? null : isValid(field, value);
    default:
      return null;
  }
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

function openPages(field) {
  const checkboxes = document.querySelectorAll(`[data-text=${field}] input[type='checkbox']:checked`);
  let inputValue = document.getElementById(`input-${field}`).value;
  let encodedInput = "";

  if (!inputValue) return;

  if (field === "phone") {
    inputValue = document.getElementById("countryCodeSelector").value + inputValue;
  }
  encodedInput = encodeURIComponent(inputValue);

  checkboxes.forEach((checkbox) => {
    try {
      console.log(checkbox);
      const websiteName = checkbox.id.split("-")[0];
      if (websiteName == "todos") return;
      const website = websiteData[websiteName];
      window.open(createURL(website.url, encodedInput, website.quotes), "_blank");
    } catch (error) {
      console.error(error);
    }
  });
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

  searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    for (const input of inputTexts) {
      if (input.value) {
        const type = input.getAttribute("data-text");
        if (isValid(type, input.value)) {
          openPages(type);
        } else {
          input.focus();
        }
      } else {
        continue;
      }
    }
  });
}

function initializeCountrySelector() {
  const countryCodeSelector = document.createElement("select");
  countryCodeSelector.classList.add("form-select");
  countryCodeSelector.id = "countryCodeSelector";

  countryData.forEach(country => {
    const option = document.createElement("option");
    option.value = `+${country.code}`;
    option.textContent = `+${country.code}`;
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
