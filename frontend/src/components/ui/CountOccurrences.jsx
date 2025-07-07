// src/utils/searchUtils.js

export const countOccurrences = (data, searchQuery, searchFields) => {
    const lowerQuery = searchQuery.toLowerCase();
    return data.reduce((acc, item) => {
      return acc + searchFields.reduce((count, field) => {
        const fieldValue = getNestedValue(item, field) || '';
        const matches = fieldValue.toString().toLowerCase().match(new RegExp(lowerQuery, 'g'));
        return count + (matches ? matches.length : 0);
      }, 0);
    }, 0);
  };
  
  const getNestedValue = (obj, keyPath) => {
    return keyPath.split('.').reduce((acc, key) => acc && acc[key], obj);
  };