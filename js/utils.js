export async function loadData(fileName) {
  const file = `json/${fileName}.json`;
  try {
    const response = await fetch(file);
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error('Error loading file:', error);
  }
}

export function createURL(domain, path, quotes = true) {
  return quotes ? `${domain}"${path}"` : `${domain}${path}`;
}

export function toDigits(str) {
  return str.replace(/\D+/g, '');
}

export function toAlphaNum(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

export function formatUsername(str) {
  return str.replace(/[\s/]/g, ''); //removes whitespaces and slashes
}

export function setValidation(element, isValid = null) {
  if (isValid == null) {
    element.classList.remove("is-valid");
    element.classList.remove("is-invalid");
  } else if (isValid == true) {
    element.classList.remove("is-invalid");
    element.classList.add("is-valid");
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
  }
}

export function isValid(field, value) {
  if (field == 'name') {
    return isValidName(value);
  } else if (field == 'username') {
    return isValidUsername(value);
  } else if (field == 'cpf') {
    return isValidCPF(value);
  } else if (field == 'cnpj') {
    return isValidCNPJ(value);
  } else if (field == 'ip') {
    return isValidIP(value);
  } else if (field == 'plate') {
    return isValidPlate(value);
  } else if (field == 'phone') {
    return isValidPhone(value);
  } else if (field == 'imei') {
    return isValidIMEI(value);
  } else if (field == 'email') {
    return isValidEmail(value);
  }
  return true;
}

function isValidName(strName) {
  return strName.length >= 3; 
}

function isValidUsername(strName) {
  return strName.length >= 2; 
}

function isValidPhone(str) {
  return str.length >= 4 || str.length <= 18;
}

function isValidIMEI(str) {
  return str.length >= 14 || str.length <= 15;
}

function isValidCPF(strCPF) {
  strCPF = toDigits(strCPF);
  let sum = 0;
  let remainder;
  if (!strCPF) {
    return true;
  }
  if (strCPF == "00000000000") {
    return false;
  }
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if ((remainder == 10) || (remainder == 11)) {
    remainder = 0;
  }
  if (remainder != parseInt(strCPF.substring(9, 10)) ) {
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(strCPF.substring(i-1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if ((remainder == 10) || (remainder == 11)) {
    remainder = 0;
  }
  if (remainder != parseInt(strCPF.substring(10, 11))) {
    return false;
  }
  return true;
}

function isValidCNPJ(str) {
  return str.length >= 14;
}

export function formatCPF(input) {
  let cpf = toDigits(input);

  if (cpf.length > 9) {
    cpf = `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}-${cpf.substr(9, 2)}`;
  } else if (cpf.length > 6) {
    cpf = `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}`;
  } else if (cpf.length > 3) {
    cpf = `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}`;
  }
  return cpf;
}

export function formatPlate(input) {
  return onlyLetters(toDigits(input));
}

function isValidIP(ip) {
  if (ip.length == 0) { 
    return true;
  }
  // Check if the IP is valid IPv4
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
    return true;
  }
  // Check if the IP is valid IPv6
  if (/^([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}$/.test(ip) ||
      /^([0-9a-fA-F]{1,4}:){1,7}:$/.test(ip) ||
      /^([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}$/.test(ip) ||
      /^([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}$/.test(ip) ||
      /^([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}$/.test(ip) ||
      /^([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}$/.test(ip) ||
      /^([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}$/.test(ip) ||
      /^[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})$/.test(ip) ||
      /^:((:[0-9a-fA-F]{1,4}){1,7}|:)$/.test(ip)) {
    return true;
  }
  return false;
}

function isValidPlate(plate) {
  const platePattern = /^[a-zA-Z]{3}\d{1}[a-zA-Z\d]{1}\d{2}$/;
  return platePattern.test(toAlphaNum(plate));
}

function isValidEmail(str) {
  const platePattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]+)*$/;
  return platePattern.test(str);
}