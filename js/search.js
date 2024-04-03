import {loadData, createURL, formatCPF, formatUsername, toDigits, toAlphaNum, setValidation, isValid} from './utils.js';

const searchForm = document.getElementById('search-form');
const dropdowns = document.querySelectorAll("ul.dropdown-menu");
const inputTexts = document.querySelectorAll("input[type='text']");
const countryCodeDiv = document.getElementById("countryCodeDiv");
const websiteData = await loadData('sources');
const countryData = await loadData('countryCodes');

function createDropdownItems(container, items, field) {
  for (let key in items) {
    if (!items[key].info.includes(field)) {
      continue;
    }
    const checkboxSection = document.createElement("li");
    checkboxSection.classList.add("dropdown-item");

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.classList.add("form-check-input");
    checkboxInput.classList.add("me-1");
    checkboxInput.id = `${key}-${field}-option`;
    checkboxInput.checked = true;

    const checkboxLabel = document.createElement("label");
    checkboxLabel.classList.add("form-check-label");
    checkboxLabel.htmlFor = checkboxInput.id;
    checkboxLabel.textContent = items[key].fullName;

    checkboxSection.appendChild(checkboxInput);
    checkboxSection.appendChild(checkboxLabel);
    container.appendChild(checkboxSection);
  }
  createEventListeners(field);
}

function createEventListeners(field) {
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

function addSelectorOptions(countryCodes, id) {
  const selectElement = document.createElement("select");
  selectElement.classList.add("form-select");
  selectElement.id = id;

  countryCodes.forEach(function(country) {
    const optionElement = document.createElement("option");
    optionElement.value = `+${country.code}`;
    optionElement.textContent = `+${country.code}`;
    if (country.iso == "BR") optionElement.selected;
    selectElement.appendChild(optionElement);
  });

  return selectElement;
}

function openPages(field) {
  const checkboxes = document.querySelectorAll(`[data-text=${field}] input[type='checkbox']`);
  let inputValue = document.getElementById(`input-${field}`).value;
  let encodedInput = "";

  if (!inputValue) {
    return;
  } else {
    if (field == "phone") {
      inputValue = document.getElementById("countryCodeSelector").value + inputValue;
    }
    encodedInput = encodeURIComponent(inputValue);
  }

  for (let i = 1; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      try {
        const websiteName = checkboxes[i].id.split("-")[0];
        const website = websiteData[websiteName];
        window.open(createURL(website.url, encodedInput, website.quotes), "_blank");
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  }
}

countryCodeDiv.appendChild(addSelectorOptions(countryData, "countryCodeSelector"));

for (let dropdown of dropdowns) {
  createDropdownItems(dropdown, websiteData, dropdown.getAttribute('data-text'));
}

for (let input = 1; input < inputTexts.length; input++) {
  inputTexts[input].addEventListener("blur", function() {
    setValidation(this, !this.value.length ? null : isValid(this.getAttribute("data-text"), this.value));
  });
}

document.getElementById('input-cpf').addEventListener("input", function(e) {
  e.target.value = formatCPF(e.target.value);
  setValidation(e.target, e.target.value.length < 14 ? null : isValid("cpf", e.target.value));
});

document.getElementById('input-username').addEventListener("input", function(e) {
  e.target.value = formatUsername(e.target.value);
});

document.getElementById('input-phone').addEventListener("input", function(e) {
  e.target.value = toDigits(e.target.value);
});

document.getElementById('input-plate').addEventListener("input", function(e) {
  e.target.value = toAlphaNum(e.target.value);
  setValidation(e.target, e.target.value.length < 7 ? null : isValid("plate", e.target.value));
});

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  for (const input of inputTexts) {
    const type = input.getAttribute("data-text");
    if (isValid(type, input.value)) {
      openPages(type);
    } else {
      input.focus();
    }
  }
});