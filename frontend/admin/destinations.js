if(!localStorage.getItem('admin')){
    location.replace('http://127.0.0.1:5500/frontend/admin/login.html');
}
const dateDiv = document.querySelector('#update-date');
const adminDiv = document.querySelector('#admin');
const themeToggler =document.querySelector(".theme-toggler");
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables'); 

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

});
let adminUser = localStorage.getItem('admin');
adminUser = JSON.parse(adminUser);
adminDiv.textContent = adminUser.adminName;
const date = new Date();
dateDiv.textContent = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const addDestination = async () =>{
    try {
        const destName = document.getElementById('destName').value;
        const destDescription = document.getElementById('destDescription').value;
        const destImageUrl = document.getElementById('destImageUrl').value;
        const destTourId = document.getElementById('destTourId').value;
        const response = await fetch('http://localhost:8080/addDestination', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destName,
                destDescription,
                destImageUrl,
                destTourId,
            }),
        });
        if (!response.ok) {
            throw new Error('Error adding destination');
        }
        location.reload();
    } catch (error) {
        console.error('Error adding destination:', error);
    }
}
const deleteDestinations = async (id) =>{
    try{
        const response = await fetch(`http://localhost:8080/destinations/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(!response.ok){
            throw new Error('Error fetching destinations');
        }
        const data = await response.json();
        location.reload();
        return data;
    } catch(error){
        console.error(error);
    }
}
const fetchDestinations = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/destinations`);
        if(!response.ok){
            throw new Error('Error fetching destinations');
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
    }
}
const injectDestinations = async () =>{
    const destinations = await fetchDestinations();
    destinations.map(destination =>{
        const tr = document.createElement('tr');
        const trContent = `  
        <td>${destination.destinationName}</td>
        <td>${destination.description}</td>
        <td>
            <div class="flex justify-between w-full h-full">
                <button onclick="deleteDestinations(${destination.destinationID})"><i class="fa fa-close"></i></button>
            </div>
        </td>
        `;
        tr.innerHTML = trContent;
        document.querySelector('#destinations').appendChild(tr);
    }); 
}

injectDestinations();