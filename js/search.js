import {loadData, createURL, formatCPF, validateCPF} from './utils.js';

const searchForm = document.getElementById('searchForm');
const nameDropdown = document.getElementById("checkboxName");
const cpfDropdown = document.getElementById("checkboxCPF");
const cpfInput = document.getElementById('input-cpf');
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

function openPages(field) {
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
        window.open(createURL(websiteData[websiteName].url, encodedInput), "_blank");
      } catch (error) {
        continue;
      }
    }
  }
}

createDropdownItems(nameDropdown, websiteData, "name");
createDropdownItems(cpfDropdown, websiteData, "cpf");

searchForm.addEventListener('submit', function(e) {
  if (!validateCPF(cpfInput.value)) {
    e.preventDefault();
    alert('CPF inválido. Verifique o número digitado.');
    cpfInput.focus();
  } else {
    openPages("name");
    openPages("cpf");
  }
});

cpfInput.addEventListener("input", function() {
  this.value = formatCPF(this.value);
});