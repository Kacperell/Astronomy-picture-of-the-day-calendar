import { getPeople, removePerson } from './store';
import { renderCalendar } from './calendar';
import { editPersonForm } from './form';
const nasaApiKey = 'l9CTWt6TvhkpZyXICmCPvzo8zNw7vsXl1Ps1XXx7';

const listContainer = document.querySelector('.list');

const editbtnclicked = (e) => {
    const personLI = e.target.parentNode.parentNode;
    const personID = personLI.getAttribute("idpersoninlist");
    editPersonForm(personID);
}

const editInListFromForm = (person, editpersonID) => {
    //remove old li
    const liInList = document.querySelectorAll('[idpersoninlist]')
    for (let i = 0; i < liInList.length; i++) {
        if (liInList[i].getAttribute("idpersoninlist") == editpersonID) {
            liInList[i].remove();
            break;
        }
    }
    //Add new li
    addToList(person);
}

const deletebtnclicked = (e) => {
    const personLI = e.target.parentNode.parentNode;
    const personID = personLI.getAttribute("idpersoninlist");
    removePerson(personID); //remove from local storage
    renderCalendar();
    personLI.remove();
}


const addToList = async (person) => {
    fetch(`https://api.nasa.gov/planetary/apod?date=${person.birthday}&api_key=${nasaApiKey}`)
        .then(response => response.json())
        .then((data) => {
            putLiToList(person, data)
        })
        .catch(e => console.log(e));
}
const putLiToList = (person, astronomyData) => {
    const li = document.createElement('li');
    li.setAttribute('idpersoninlist', person.id);
    li.innerHTML = `
    <div class="list__astronomy-info"> 
    <img alt="${astronomyData.title}" src='${astronomyData.url}'> 
    <span>${person.birthday}</span>
    </div>
    <div class="list__person-info"> 
    <span>${person.name}</span> 
     <span>${person.email}</span>
    </div>
    `;
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add("list__buttons")

    //edit btn
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "Edit";
    btnEdit.addEventListener('click', editbtnclicked, true)
    buttonsDiv.appendChild(btnEdit);

    //delete btn
    const btnDelete = document.createElement("button");
    btnDelete.textContent = "Delete";
    btnDelete.addEventListener('click', deletebtnclicked, true)
    buttonsDiv.appendChild(btnDelete);

    li.appendChild(buttonsDiv);
    listContainer.appendChild(li);
}

const renderList = async () => {
    listContainer.innerHTML = '';
    let people = getPeople();
    if (!people.length) {
        return;
    }
    let list = new DocumentFragment()
    people.forEach((person) => {
        //we add each person to the list
        addToList(person);
        // There is no point in adding all of them at once because we have to wait for the api photo
    });

    listContainer.appendChild(list);

}
renderList(); //render on start


export { renderList, addToList, editInListFromForm, nasaApiKey };