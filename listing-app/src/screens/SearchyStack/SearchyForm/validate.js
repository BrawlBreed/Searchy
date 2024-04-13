export function validateSellingForm(fields, errors){
    if(!fields.title){
        errors.title = 'Заглавието е задължително'
    }
    else if(fields.title.length < 3){
        errors.title = 'Заглавието трябва да е поне 3 символа'
    }
    else{
        errors.title = '' 
    }
    if(!fields.description){
        errors.description = 'Описанието е задължително'
    }
    else if(fields.description.length < 10){
        errors.description = 'Описанието трябва да е поне 10 символа'
    }
    else{
        errors.description = ''
    }
    if(!fields.price ){
        errors.price = 'Цената е задължителна'
    }
    else if(fields.price < 0){
        errors.price = 'Цената не може да е отрицателна'
    }
    else{
        errors.price = ''
    }
    if(!fields.condition){
        errors.condition = 'Изберете състояние'
    }
    else{
        errors.condition = ''
    }

    return errors
}
export function validateSearchyForm(fields, errors){
    if(!fields.title){
        errors.title = 'Заглавието е задължително'
    }
    else if(fields.title.length < 3){
        errors.title = 'Заглавието трябва да е поне 3 символа'
    }
    else{
        errors.title = '' 
    }
    if(!fields.description){
        errors.description = 'Описанието е задължително'
    }
    else if(fields.description.length < 10){
        errors.description = 'Описанието трябва да е поне 10 символа'
    }
    else{
        errors.description = ''
    }
    if(!fields.inquiry){
        errors.inquiry = 'Полето е задължително'
    }
    else if(fields.inquiry.length < 5){
        errors.inquiry = 'Текстът трябва да е поне 5 символа'
    }
    else{
        errors.inquiry = ''
    }
    return errors
}