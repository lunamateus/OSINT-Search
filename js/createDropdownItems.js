export function createDropdownItems(container, items, field) {
  items.forEach(([key, value]) => {
    const checkboxSection = document.createElement("li");
    checkboxSection.classList.add("dropdown-item");

    const checkboxInput = document.createElement("input");
    checkboxInput.type = "checkbox";
    checkboxInput.classList.add("form-check-input", "me-1");
    checkboxInput.id = `${key}-${field}-option`;
    checkboxInput.checked = true;

    const checkboxLabel = document.createElement("label");
    checkboxLabel.classList.add("form-check-label");
    checkboxLabel.htmlFor = checkboxInput.id;
    checkboxLabel.textContent = value.fullName;
    if (value.fullName == "Todos") {
      checkboxLabel.style.fontWeight = "bold";
    }

    checkboxSection.appendChild(checkboxInput);
    checkboxSection.appendChild(checkboxLabel);
    container.appendChild(checkboxSection);
  });
  createEventListenersOnCheckboxes(field);
}

function createEventListenersOnCheckboxes(field) {
  const checkboxes = document.querySelectorAll(`[data-text=${field}] input[type='checkbox']`);
  const selectAllCheckbox = document.getElementById(`todos-${field}-option`);

  function updateBadgeCount(display = true) {
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked && checkbox.id !== `todos-${field}-option`);
    const badge = document.getElementById(`badge-${field}`);
    badge.textContent = checkedCheckboxes.length;
    badge.style.display = display ? "inline" : "none";
  }
  updateBadgeCount(false);

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
            break;
          }
        }
        selectAllCheckbox.checked = allChecked;
      }
      updateBadgeCount();
    });
  });
  selectAllCheckbox.addEventListener("change", (event) => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = event.target.checked;
    });
    updateBadgeCount();
  });
}