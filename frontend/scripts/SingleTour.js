const fetchSingleTour = async () =>{
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get('tourId');
    try{
        const response = await fetch(`http://localhost:8080/tours/${tourId}`);
        if(!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        console.log(data);
        return data;
    } catch(error){
        console.error("Fetch error : ", error);
    }
}

const showSingleTour = async () =>{
    const tour = await fetchSingleTour();
    document.getElementById('single-tour').innerHTML = `
        <h2 class="text-2xl">${tour.tourName}</h2>
        <p>${tour.description}</p>
    `;
}

showSingleTour();