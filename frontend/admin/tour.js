if(!localStorage.getItem('admin')){
    location.replace('http://127.0.0.1:5500/frontend/admin/login.html');
}
const adminDiv = document.querySelector('#admin');
const themeToggler =document.querySelector(".theme-toggler");
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables'); 

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

});

async function addTour() {
    try {
        const tourName = document.getElementById('tourName').value;
        const tourDescription = document.getElementById('tourDescription').value;
        const tourImageUrl = document.getElementById('tourImageUrl').value;
        const tourPrice = document.getElementById('tourPrice').value;
        const tourReviews = document.getElementById('tourReviews').value;
        const tourDuration = document.getElementById('tourDuration').value;

        const response = await fetch('http://localhost:8080/addTour', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tourName,
                tourDescription,
                tourImageUrl,
                price: tourPrice,
                reviews: tourReviews,
                duration: tourDuration,
            }),
        });

        if (!response.ok) {
            throw new Error('Error adding tour');
        }

        const result = await response.json();
        console.log(result); 
        location.reload();
    } catch (error) {
        console.error('Error adding tour:', error);
    }
}

let adminUser = localStorage.getItem('admin');
adminUser = JSON.parse(adminUser);
adminDiv.textContent = adminUser.adminName;
const dateDiv = document.querySelector('#update-date');
const date = new Date();
dateDiv.textContent = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

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
const injectTours = async () =>{
    const tours = await fetchTours();

    tours.map(tour =>{
        const tr = document.createElement('tr');
        const trContent = `  
        <td>${tour.tourName}</td>
        <td>${tour.price}</td>
        <td>${tour.description}</td>
        <td>${tour.duration}</td>
        `;
        tr.innerHTML = trContent;
        document.querySelector('table tbody').appendChild(tr);
    });
}
injectTours();