import {loadData, createURL, formatCPF, isValidName, isValidCPF, isValidIP} from './utils.js';

const searchForm = document.getElementById('searchForm');
const nameDropdown = document.getElementById("checkboxName");
const cpfDropdown = document.getElementById("checkboxCPF");
const ipDropdown = document.getElementById("checkboxIP");
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
  const checkboxes = document.querySelectorAll(`.${field} input[type='checkbox']`);
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
  const input = document.getElementById(`input-${field}`);
  const checkboxes = document.querySelectorAll(`.${field} input[type='checkbox']`);
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
        continue;
      }
    }
  }
}

createDropdownItems(nameDropdown, websiteData, "name");
createDropdownItems(cpfDropdown, websiteData, "cpf");
createDropdownItems(ipDropdown, websiteData, "ip");

searchForm.addEventListener('submit', function(e) {
  if (isValidName(nameInput.value)) {
    openPages("name");
  } else {
    e.preventDefault();
    nameInput.focus();
  }
  if (isValidCPF(cpfInput.value)) {
    openPages("cpf");
  } else {
    e.preventDefault();
    cpfInput.focus();
  }
  if(isValidIP(ipInput.value)) {
    openPages("ip", false);
  }
});

nameInput.addEventListener("blur", function() {
  const strLength = this.value.length;
  if (!strLength) {
    this.classList.remove("is-valid");
    this.classList.remove("is-invalid");
  } else if (strLength < 3) {
    this.classList.remove("is-valid");
    this.classList.add("is-invalid");
  } else {
    this.classList.remove("is-invalid");
    this.classList.add("is-valid");
  }
});

cpfInput.addEventListener("input", function() {
  this.value = formatCPF(this.value);
  if (this.value.length < 14) {
    this.classList.remove("is-valid");
    this.classList.remove("is-invalid");
  } else {
    this.classList.add(isValidCPF(cpfInput.value) ? "is-valid" : "is-invalid");
  }
});

