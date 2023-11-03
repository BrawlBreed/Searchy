export function generateRandomItemId(existingIds = []) {
    const idLength = 12; // Generate a 9-digit ID
    let randomId;
    let isUnique = false;
  
    while (!isUnique) {
      // Generate a random ID
      randomId = '';
      for (let i = 0; i < idLength; i++) {
        const digit = Math.floor(Math.random() * 10); // Generate a random digit (0-9)
        randomId += digit.toString();
      }
  
      // Check if the generated ID is unique
      if (!existingIds.includes(randomId)) {
        isUnique = true;
      }
    }
  
    return randomId;
  }  