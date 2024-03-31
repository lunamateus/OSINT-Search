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

export function createURL(domain, path) {
  return `${domain}"${path}"`;
}

function onlyDigitis(str) {
  return str.replace(/\D+/g, '');
}

export function isValidName(strName) {
  return strName.length == 0 || strName.length > 3 ? true : false; 
}

export function isValidCPF(strCPF) {
  strCPF = onlyDigitis(strCPF);
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

export function formatCPF(input) {
  let cpf = onlyDigitis(input);

  if (cpf.length > 9) {
    cpf = `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}-${cpf.substr(9, 2)}`;
  } else if (cpf.length > 6) {
    cpf = `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}.${cpf.substr(6, 3)}`;
  } else if (cpf.length > 3) {
    cpf = `${cpf.substr(0, 3)}.${cpf.substr(3, 3)}`;
  }
  return cpf;
}