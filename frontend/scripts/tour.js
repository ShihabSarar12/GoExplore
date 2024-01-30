const toursDiv = document.getElementById('tours');
const searchInput = document.getElementById('search');


const fetchTours = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/tours`);
        if(!response.ok) throw new Error(response.statusText);
        return response.json();
    } catch(error){
        console.error("Fetch error : ", error);
    }
}

const bookTours = (tourId) => {
    location.replace(`http://127.0.0.1:5500/frontend/pages/SingleTour.html?tourId=${tourId}`);
}

const injectTours = async () => {
    const tours = await fetchTours();
    const searchQuery = search.value.toLowerCase();
    toursDiv.innerHTML = '';

    tours.forEach((tour, index) => {
        const { tourId, tourName, description, price, reviews, duration, imageUrl } = tour;
        const isVisible = tourName.toLowerCase().includes(searchQuery) ||
                          description.toLowerCase().includes(searchQuery);

        if (isVisible) {
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
                    <button class="bg-blue-700 px-2 py-1 rounded-lg mt-2 text-white" onclick="bookTours(${tourId})">Book</button>
                </div>
            `;
        }
    });
}


search.addEventListener('input', injectTours);
injectTours();

const stars = document.querySelectorAll(".stars i");

let review = 0;
stars.forEach((star, index1) => {
  star.addEventListener("click", () => {
    stars.forEach((star, index2) => {
      index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
    });
    review = index1 + 1;
    //TODO update review here in a function

  });
});
