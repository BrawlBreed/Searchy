export function dateStringToDDMMYYYY(dateString) {
    // Parse the date string into a Date object
    const date = new Date(dateString);
  
    // Validate the date object
    if (isNaN(date)) {
      throw new Error('Input string is not a valid Date');
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
  