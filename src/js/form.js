import '../scss/form.scss';
import { addPerson, getPersonInfoByid, editPerson } from './store';
import { v4 as uuidv4 } from 'uuid';
import { renderCalendar } from './calendar';
import { addToList, editInListFromForm } from './list';

const form = document.querySelector('.form');
const formTitle = document.querySelector('.form-title');
const formButton = document.querySelector('.form-button');
const personName = document.querySelector('#form-name');
const personBirthday = document.querySelector('#birtday-date');
const personEmail = document.querySelector('#form-email');
const personPhone = document.querySelector('#form-phone');


let editpersonID = null;
//if not null => editing person mode

const editPersonForm = (personID) => {
    form.scrollIntoView({ behavior: "smooth" });
    formTitle.textContent = "Edit person";
    formButton.textContent = "Edit";
    const person = getPersonInfoByid(personID);
    editpersonID = personID;
    personName.value = person.name;
    personBirthday.value = person.birthday;
    personEmail.value = person.email;
    personPhone.value = person.phone;
}

const resetForm = () => {
    form.reset();
    formTitle.textContent = "Add Person";
    formButton.textContent = "Add";
    editpersonID = null;
}

const submitForm = (e) => {
    e.preventDefault();
    const birthdayValue = new Date(personBirthday.value);
    if (new Date() < birthdayValue) {
        alert("The date must be from past");
        return;
    }
    const isDate = personBirthday.value.toString().match(/\d{4}-\d{2}-\d{2}/);
    if (!isDate) {
        alert("The date must be in format: rrrr-mm-dd ");
        return;
    }
    const person = {
        id: uuidv4(),
        name: personName.value,
        birthday: personBirthday.value,
        email: personEmail.value,
        phone: personPhone.value
    }
    if (!editpersonID) {   //new person
        addPerson(person); //add to local storage
        addToList(person);
        alert('Person added');
    } else {     //edit person
        editPerson(person, editpersonID); //edit in local storage
        editInListFromForm(person, editpersonID);
        alert('Editing complete');
    }
    document.querySelector('#calendar').scrollIntoView({ behavior: "smooth" });
    //After adding the person => scroll to the calendar 
    renderCalendar();
    // render calendar again (maybe the day added is from this month)
    resetForm();
}
form.addEventListener('submit', submitForm, true)


export { editPersonForm };