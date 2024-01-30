let user = localStorage.getItem('user');
user = JSON.parse(user);

const toursDiv = document.getElementById('booked');
const fetchBookings = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/bookings`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: user.userID
            })
        });
        if(!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        return data;
    } catch(error){
        console.error("Fetch error : ", error);
    }
}

const injectTours = async () =>{
    const bookedTours = await fetchBookings();
    const { result } = bookedTours;
    result.map((tour, index) => {
        const { tourName, description, price, reviews, duration, imageUrl } = tour;
        toursDiv.innerHTML += `
            <div class="bg-blue-100 w-64 h-72 rounded-2xl flex justify-between flex-col p-6">
                <div class="w-full h-4/6 mb-4">
                    <img src=${imageUrl} class="w-full h-full rounded-2xl"/>
                </div>
                <div>
                    <h1>${tourName}</h1>
                    <p>${description}</p>
                    <span>Price: ${price}</span>
                    <span>Review: ${reviews}</span>
                    <p>${duration} days</p>
                </div>
            </div>
        `;
    });
}

injectTours();

