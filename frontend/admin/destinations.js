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