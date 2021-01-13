import '../scss/calendar.scss';
import { getPeople } from './store';
import { openModal } from './modal';

const date = new Date();
const calculateAgeInYears = (date) => {
    const birthday = new Date(date);
    const now = new Date();
    const current_year = now.getFullYear();
    const year_diff = current_year - birthday.getFullYear();
    const birthday_this_year = new Date(current_year, birthday.getMonth(), birthday.getDate());
    const has_had_birthday_this_year = (now >= birthday_this_year);
    return has_had_birthday_this_year
        ? year_diff + 1
        : year_diff;
    //round up 
}


const checkDateIsInBirthdayList = (day, people) => {
    let dateToCompare = ``;
    let month = date.getMonth() + 1;
    month = month.toString();
    if (month.length == 1) {
        dateToCompare += `0${month}-`;
    } else {
        dateToCompare += `${month}-`;
    }
    day = day.toString();
    if (day.length == 1) {
        dateToCompare += `0${day}`;
    } else {
        dateToCompare += `${day}`;
    }
    let birthdaydayInfo = false;
    for (let i = 0; i < people.length; i++) {
        //we do not take into account the first five characters, e.g. '1997-' because birthdays are every year
        if (people[i].birthday.slice(5) == dateToCompare) {
            birthdaydayInfo = ` 
            ${people[i].name}
            Age: ${calculateAgeInYears(people[i].birthday)}
            ${people[i].email} `
            return {
                info: birthdaydayInfo,
                id: people[i].id
            };
        }
    }
    return false;
}

const birthDayDateClickEventsListeners = () => {
    const birthdays = document.querySelectorAll('.calendar__days__day--birthday');
    birthdays.forEach(function (day) {
        day.addEventListener('click', () => {
            openModal(day.id);
        })
    });
}

const renderCalendar = async () => {
    let people = await getPeople();
    date.setDate(1);
    const monthDays = document.querySelector(".calendar__days");
    const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDate();
    const prevLastDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        0
    ).getDate();
    const firstDayIndex = date.getDay() - 1;
    const lastDayIndex = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
    ).getDay();
    const nextDays = 7 - lastDayIndex;

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    document.querySelector(".calendar__month__current--month").textContent = `${months[date.getMonth()]}`;
    document.querySelector(".calendar__month__current--year").textContent = `${date.getFullYear()}`;

    let days = "";
    for (let x = firstDayIndex; x > 0; x--) {
        days += `<div class="calendar__days__day calendar__days__day--prev-date">
        <span> ${prevLastDay - x + 1}</span>
        <span> </span>
       </div>`;
    }
    for (let i = 1; i <= lastDay; i++) {
        const result = checkDateIsInBirthdayList(i, people);
        const birthdaydayInfo = result.info;
        const birthdaydayID = result.id;
        if (birthdaydayInfo) {
            days += `<div tabindex="0" role="button" class='calendar__days__day calendar__days__day--birthday' id='${birthdaydayID}'>
            <span>${i}  </span>    
             <span  class='birthday--info'>${birthdaydayInfo}  </span>  
            </div>`;
        }
        else if (    //Today's date       
            i === new Date().getDate() && date.getMonth() === new Date().getMonth()
        ) {
            days += `<div class="calendar__days__day calendar__days__day--today">   <span>${i}</span>
            <span>Today </span>  </div>`;
        } else {
            days += `<div class="calendar__days__day">
            <span>${i}</span>
            <span> </span>  
            </div>`;
        }
    }
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="calendar__days__day calendar__days__day--next-date">     
        <span>${j}</span>
        <span> </span> 
         </div>`;
        monthDays.innerHTML = days;
    }

    birthDayDateClickEventsListeners(); // set event listener for birthday after render calendar

};

renderCalendar();

document.querySelector(".calendar__month__arrow--prev").addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

document.querySelector(".calendar__month__arrow--next").addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

export { renderCalendar };
