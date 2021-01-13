const getPeople = () => {
    let people;
    if (localStorage.getItem('people') === null) {
        people = [];
    } else {
        people = JSON.parse(localStorage.getItem('people'));
    }
    return people;
}

const addPerson = (person) => {
    const people = getPeople();
    people.push(person);
    localStorage.setItem('people', JSON.stringify(people));
}

const editPerson = (personToEdit, editpersonID) => {
    const people = getPeople();
    people.forEach((person, index) => {
        if (person.id === editpersonID) {
            people[index] = personToEdit;
        }
    });
    localStorage.setItem('people', JSON.stringify(people));
}

const removePerson = (id) => {
    const people = getPeople();
    people.forEach((person, index) => {
        if (person.id === id) {
            people.splice(index, 1);
        }
    });
    localStorage.setItem('people', JSON.stringify(people));
}


const getPersonInfoByid = (id) => {
    const people = getPeople();
    let person;
    for (let i = 0; i < people.length; i++) {
        if (people[i].id == id) {
            person = people[i];
            return person;
        }
    }
    return false;
}


export { getPeople, addPerson, editPerson, removePerson, getPersonInfoByid };