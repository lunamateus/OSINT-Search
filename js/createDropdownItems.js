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
}
