import { getPersonInfoByid } from './store';
import { nasaApiKey } from './list';
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.modal__content__btn--close');



const closeModal = () => {
    modal.classList.remove('active')
    const modal__content__birthday = document.querySelector('.modal__content__birthday');
    modal__content__birthday.innerHTML = '';
};

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    //clicked outside the modal content
    if (e.target.className != 'modal__content') {
        closeModal();
    }
})

const putDataToModalContent = (astronomyData) => {
    const modal__content__birthday = document.querySelector('.modal__content__birthday');
    const newNode = document.createElement('div');
    newNode.className = "modal__content__birthday";
    newNode.innerHTML += `
    <img alt="${astronomyData.title}" src="${astronomyData.url}"> 
        <span>${astronomyData.title}</span>  
        <p>${astronomyData.explanation}</p>                
   `;
    modal__content__birthday.parentNode.replaceChild(newNode, modal__content__birthday);
}


const openModal = (id) => {
    const person = getPersonInfoByid(id);
    fetch(`https://api.nasa.gov/planetary/apod?date=${person.birthday}&api_key=${nasaApiKey}`)
        .then(response => response.json())
        .then(data => putDataToModalContent(data))
        .catch(e => console.log(e));
    modal.classList.add('active');
}

export { openModal }