const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler =document.querySelector(".theme-toggler");
const dateDiv = document.querySelector('#update-date');
const totalBookingsDiv = document.querySelector('#totalBookings');
const totalUsersDiv = document.querySelector('#totalUsers');
const totalIncomeDiv = document.querySelector('#totalIncome');

const date = new Date();
dateDiv.textContent = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

menuBtn.addEventListener('click', () => {
   sideMenu.style.display = 'block';

})
closeBtn.addEventListener('click', () => {
    sideMenu.style.display ='none';
})
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables'); 

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

})
const fetchTours = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/tours`);
        if(!response.ok){
            throw new Error('Error fetching tours');
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
    }
}

const viewTour = (id) =>{
    console.log(id);
}
const injectTours = async () =>{
    const tours = await fetchTours();

    tours.map(tour =>{
        console.log(tour);
        const tr = document.createElement('tr');
        const trContent = `  
        <td>${tour.tourName}</td>
        <td>${tour.price}</td>
        <td>${tour.description}</td>
        <td>${tour.duration}</td>
        <td class="primary detailsBtn">Details</td>`;
        tr.innerHTML = trContent;
        document.querySelector('table tbody').appendChild(tr);
    });
}
injectTours();

const updateTotalBookings = async () =>{
    try{
        const response = await fetch('http://localhost:8080/totalBookings');
        if(!response.ok){
            throw new Error('Error fetching totalBookings');
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}

const injectTotalBookings = async () =>{
    const { totalBookings } = await updateTotalBookings();
    totalBookingsDiv.textContent = totalBookings;
}

injectTotalBookings();

const updateTotalUsers = async () =>{
    try{
        const response = await fetch('http://localhost:8080/totalUsers');
        if(!response.ok){
            throw new Error('Error fetching totalUsers');
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}

const injectValueUser = async () =>{
    const { totalUsers } = await updateTotalUsers();
    totalUsersDiv.textContent = totalUsers;
}

injectValueUser();

const updateTotalPrices = async () =>{
    try{
        const response = await fetch('http://localhost:8080/totalPrices');
        if(!response.ok){
            throw new Error('Error fetching totalPrices');
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
    }
}

const injectValuePrice = async () =>{
    const { totalPrices } = await updateTotalPrices();
    totalIncomeDiv.textContent = '$'+totalPrices;
}

injectValuePrice();