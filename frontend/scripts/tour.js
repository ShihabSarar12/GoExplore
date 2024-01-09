const toursDiv = document.getElementById('tours');

const fetchTours = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/tours`);
        if(!response.ok) throw new Error(response.statusText);
        return response.json();
    } catch(error){
        console.error("Fetch error : ", error);
    }
}

const injectTours = async () =>{
    const tours = await fetchTours();
    tours.map((tour,index) =>{
        const { tourName, description, price, reviews, duration,imageUrl } = tour;
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
    })
}

injectTours();