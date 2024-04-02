import {loadData, createURL, formatCPF, setValidation, isValid} from './utils.js';

const searchForm = document.getElementById('search-form');
const dropdowns = document.querySelectorAll("ul.dropdown-menu");
const inputTexts = document.querySelectorAll("input[type='text']");
const nameInput = document.getElementById('input-name');
const cpfInput = document.getElementById('input-cpf');
const ipInput = document.getElementById('input-ip');
const websiteData = await loadData('sources');

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

function openPages(field, quotes = true) {
  const checkboxes = document.querySelectorAll(`[data-text=${field}] input[type='checkbox']`);
  const input = document.getElementById(`input-${field}`);
  const encodedInput = encodeURIComponent(input.value);
  
  if (!encodedInput) {
    return;
  }
  for (let i = 1; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      try {
        const websiteName = checkboxes[i].id.split("-")[0];
        window.open(createURL(websiteData[websiteName].url, encodedInput, quotes), "_blank");
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  }
}

for (let dropdown of dropdowns) {
  createDropdownItems(dropdown, websiteData, dropdown.getAttribute('data-text'));
}

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

nameInput.addEventListener("blur", function() {
  setValidation(this, !this.value.length ? null : isValid('name', this.value));
});

cpfInput.addEventListener("input", function() {
  this.value = formatCPF(this.value);
  setValidation(this, this.value.length < 14 ? null : isValid('cpf', this.value));
});

ipInput.addEventListener("blur", function() {
  setValidation(this, !this.value.length ? null : isValid('ip', this.value));
});