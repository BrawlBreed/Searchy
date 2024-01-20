export function validateEmailForm(fields, errors) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!fields.email) {
        errors.email = 'Полето е задължително';
    } else if (!emailRegex.test(fields.email)) {
        errors.email = 'Невалиден имейл адрес';
    } else {
        errors.email = '';
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!fields.password) {
        errors.password = 'Полето е задължително';
    } else if (!passwordRegex.test(fields.password.trim())) {
        errors.password = 'Невалидна парола';
    } else {
        errors.password = '';
    }

    return errors;
}
  
export function validatePhoneForm(fields, errors) {
    const phoneRegex = /^[0-9]{9}$/; // Assuming 10-digit phone numbers

    if (!fields.phone) {
      errors.phone = 'Полето е задължително';
    } else if (!phoneRegex.test(fields.phone)) {
      errors.phone = 'Невалиден телефонен номер';
    } else {
      errors.phone = '';
    }      
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    
    if (!fields.password) {
        errors.password = 'Полето е задължително';
    } else if (!passwordRegex.test(fields.password.trim())) {
        errors.password = 'Невалидна парола';
    } else {
        errors.password = '';
    }

    return errors;
}
  
