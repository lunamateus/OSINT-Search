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
