import Person from './person';
const app = document.querySelector('#app');
let persons = [
    new Person('Peter', 'Lin', 26, 'male'),
    new Person('Bill', 'Chen', 28, 'male'),
    new Person('Flora', 'Hsu', 25, 'female'),
];
persons = [...persons, new Person('小明', '李')];

persons.forEach(p=>{
    app.innerHTML += `<div data-age="${p.age}">${p.firstname} ${p.lastname} ${p.age}\歲\</div>`;
});