const destinationsDiv = document.getElementById('destinations');
const searchInput = document.getElementById('search');

const fetchDestinations = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/destinations`);
        if(!response.ok) throw new Error(response.statusText);
        return response.json();
    } catch(error){
        console.error("Fetch error : ", error);
    }
}

const injectDestinations = async () =>{
    const destinations = await fetchDestinations();
    const searchQuery = search.value.toLowerCase();
    destinationsDiv.innerHTML = '';
    destinations.forEach((destination, index) => {
        const { destinationName, description, imageUrl } = destination;
        const isVisible =
            destinationName.toLowerCase().includes(searchQuery) ||
            description.toLowerCase().includes(searchQuery);

        if (isVisible) {
            destinationsDiv.innerHTML += `
                <div class="bg-blue-100 w-64 h-72 rounded-2xl flex justify-between flex-col p-6">
                    <div class="w-full h-4/6 mb-4">
                        <img src=${imageUrl} class="w-full h-full rounded-2xl"/>
                    </div>
                    <div>
                        <h1>${destinationName}</h1>
                        <p>${description}</p>
                    </div>
                </div>
            `;
        }
    });
};
search.addEventListener('input', injectDestinations);

// Initial call to load destinations
 
injectDestinations();