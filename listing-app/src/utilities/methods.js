export function dateStringToDDMMYYYY(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);
  
    // Validate the date object
    if (isNaN(date)) {
      return;
    }
  
    // Extract the day, month, and year from the Date object
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    // Return the formatted string
    return `${day}.${month}.${year}г.`;
  }

  export function filterFalsyValues(array) {
    return Array.from(new Set(array?.filter(item => item) || ['']));
  }
  
  export function calculatePromotionScore(amountPaid) {
    // Get the current date and time
    const currentDate = new Date();

    // Convert the current date to a numeric value (like a timestamp)
    const numericDate = currentDate.getTime();

    // Scale down the numeric date to ensure it adds a small value
    // The scaling factor can be adjusted as needed
    const dateScore = numericDate * 0.000000000001;

    // Add the scaled date score to the amount paid
    const score = amountPaid + dateScore;

    return score;
  }

  export function getRemainingCountOrTen(arrayLength) {
    if (arrayLength === 0) return 0; // If no items, return 0
    const remaining = arrayLength % 10;
    return remaining === 0 ? 10 : remaining;
  }
    