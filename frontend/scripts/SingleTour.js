let user = localStorage.getItem('user');
user= JSON.parse(user);
const params = new URLSearchParams(window.location.search);
const tourId = params.get('tourId');
const fetchSingleTour = async () =>{
    
    try{
        const response = await fetch(`http://localhost:8080/tours/${tourId}`);
        if(!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        console.log(data.tourId);
        return data;
    } catch(error){
        console.error("Fetch error : ", error);
    }
}

const bookTour = async (tourId, userID) =>{
    try{
        const response = await fetch(`http://localhost:8080/addBookings`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tourId,
                userID
            })
        });
        if(!response.ok) throw new Error(response.statusText);
        document.getElementById('booked').classList.remove('hidden');
        document.getElementById('bookBtn').classList.add('hidden');
    } catch(error){
        console.error("Fetch error : ", error);
    }
}

const showSingleTour = async () => {
    const tour = await fetchSingleTour();
    const singleTourContainer = document.getElementById('single-tour');

    singleTourContainer.innerHTML = `
    <div class="w-screen h-screen bg-white border border-gray-200 rounded-lg shadow-md dark:bg-white-800 dark:border-gray-700">
        <a href="#">
            <img class="rounded-t-lg object-cover w-full h-80" src="${tour.imageUrl}" alt="${tour.tourName}" />
        </a>
        <div class="p-5 flex gap-4 justify-center items-center flex-col">
            <div>
                <a href="#">
                <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-black">${tour.tourName}</h5>
                </a>
                <p class="mb-3 text-black-700 dark:text-black-400">${tour.description}</p>
                <p class="mb-3 font-normal text-black-700 dark:text-black-400">Price: $${tour.price}</p>
                <p class="text-black-700 dark:text-black-400">Duration: ${tour.duration} days</p>
             </div>
             <button id="bookBtn" onclick="bookTour(${tour.tourId}, ${user.userID})" class="bg-blue-600 px-2 py-1 rounded-lg text-white">Book NOW</button>
        </div>
    </div>
    `;
};


showSingleTour();

const stars = document.querySelectorAll(".stars i");
const insertReview = async (newReview) =>{
    try{
        const response = await fetch(`http://localhost:8080/tours/${tourId}`);
        if(!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        const { tourName, price, description, reviews, duration, imageUrl } = data;
        const updatedReview = (newReview + reviews)/2;
        const insert = await fetch(`http://localhost:8080/tours/${tourId}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tourName, 
                price, 
                description, 
                reviews: updatedReview, 
                duration, 
                imageUrl
            })
        });
        if(!insert.ok) throw new Error(response.statusText);
        alert('Thanks for your feedback!');
    } catch(error){
        console.error("Fetch error : ", error);
    }
}
let review = 0;
stars.forEach((star, index1) => {
  star.addEventListener("click", () => {
    stars.forEach((star, index2) => {
      index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
    });
    review = index1 + 1;
    insertReview(review);
  });
});