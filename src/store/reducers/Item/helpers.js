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

export function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getDurationFromFirestoreTimestamp(firestoreTimestamp) {
  // Convert Firestore timestamp to JavaScript Date object
  const pastDate = new Date(firestoreTimestamp?.seconds * 1000 + firestoreTimestamp?.nanoseconds / 1000000);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const diffInMs = currentDate.getTime() - pastDate.getTime();

  // Convert the difference to minutes, hours, days
  const diffInMinutes = Math.round(diffInMs / 60000); // 60,000 milliseconds in a minute
  const diffInHours = Math.round(diffInMs / 3600000); // 3,600,000 milliseconds in an hour
  const diffInDays = Math.round(diffInMs / 86400000); // 86,400,000 milliseconds in a day

  // Determine the most appropriate unit to display
  if (diffInDays > 0) {
    return diffInDays + ' ден' + (diffInDays > 1 ? 'а' : '');
  } else if (diffInHours > 0) {
    return diffInHours + ' час' + (diffInHours > 1 ? 'а' : '');
  } else if (diffInMinutes > 0) {
    return diffInMinutes + ' минути' + (diffInMinutes > 1 ? '' : '');
  } else {
    return 'Сега';
  }
}
