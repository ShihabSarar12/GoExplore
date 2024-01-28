//FIXME tous deletion problem
const deleteTour = async (id) =>{
    try{
        const response = await fetch(`http://localhost:8080/tours/${id}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if(!response.ok){
            throw new Error('Error fetching tours');
        }
        const data = await response.json();
        location.reload();
        return data;
    } catch(error){
        console.error(error);
    }
}
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
        <td>
            <div class="flex justify-between w-full h-full">
                <button onclick="deleteTour(${tour.tourId})"><i class="fa fa-close"></i></button>
            </div>
        </td>
        `;
        tr.innerHTML = trContent;
        document.querySelector('table tbody').appendChild(tr);
    });
}
injectTours();