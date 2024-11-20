// utils.js

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Check if the date is valid
    if (isNaN(date)) {
      return "Invalid Date";
    }
  
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  