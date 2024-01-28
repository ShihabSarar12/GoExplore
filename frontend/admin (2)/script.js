// script.js
function showDashboard() {
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("destination").style.display = "none";
    document.getElementById("tour").style.display = "none";
    document.getElementById("booking").style.display = "none";
    document.getElementById("user").style.display = "none";


}

function showDestination() {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("destination").style.display = "block";
    document.getElementById("tour").style.display = "none";
    document.getElementById("booking").style.display = "none";
    document.getElementById("user").style.display = "none";
}

function showTour() {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("destination").style.display = "none";
    document.getElementById("tour").style.display = "block";
    document.getElementById("booking").style.display = "none";
    document.getElementById("user").style.display = "none";

}
function showbooking() {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("destination").style.display = "none";
    document.getElementById("tour").style.display = "none";
    document.getElementById("booking").style.display = "block";
    document.getElementById("user").style.display = "none";
}
function showuser() {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("destination").style.display = "none";
    document.getElementById("tour").style.display = "none";
    document.getElementById("booking").style.display = "none";
    document.getElementById("user").style.display = "block";
}
// Initial view (dashboard)
showDashboard();




//destination


const fetchDestinations = async () => {
    try {
        const response = await fetch(`http://localhost:8080/destinations`);
        if (!response.ok) {
            throw new Error('Error fetching destinations');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

const fetchTourDetails = async (tourId) => {
    try {
        const response = await fetch(`http://localhost:8080/tours/${tourId}`);
        if (!response.ok) {
            throw new Error('Error fetching tour details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tour details:', error);
        return null;
    }
};

// const injectDestinationsTable = async () => {
//     const destinations = await fetchDestinations();
//     const tbody = document.getElementById('destination-table-body');
//     tbody.innerHTML = '';

//     destinations.forEach(destination => {
//         const tr = document.createElement('tr');
//         const trContent = `
//             <td>${destination.destinationID}</td>
//             <td>${destination.destinationName}</td>
//             <td>${destination.description}</td>
//             <td><img src="${destination.imageUrl}" alt="${destination.tourName}" style="width: 120px;"></td>
//             <td>${destination.tourId}</td>
//             <td class="primary"><a href="#" onclick="openModal(${destination.tourId})">Details</a></td>
//         `;
//         tr.innerHTML = trContent;
//         tbody.appendChild(tr);
//     });
// };

const deleteDestination = async (destinationID) => {
    try {
        const response = await fetch(`http://localhost:8080/destinations/${destinationID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error deleting destination');
        }

        // Remove the deleted row from the table
        const row = document.getElementById(`destination-row-${destinationID}`);
        row.remove();
    } catch (error) {
        console.error('Error deleting destination:', error);
    }
};

const injectDestinationsTable = async () => {
    const destinations = await fetchDestinations();
    const tbody = document.getElementById('destination-table-body');
    tbody.innerHTML = '';

    destinations.forEach(destination => {
        const tr = document.createElement('tr');
        tr.id = `destination-row-${destination.destinationID}`; // Add a unique ID to each row
        const trContent = `
            <td>${destination.destinationID}</td>
            <td>${destination.destinationName}</td>
            <td>${destination.description}</td>
            <td><img src="${destination.imageUrl}" alt="${destination.tourName}" style="width: 120px;"></td>
            <td>${destination.tourId}</td>
            <td class="primary"><a href="#" onclick="openModal(${destination.tourId})">Details</a></td>
            <td class="primary"><button onclick="deleteDestination(${destination.destinationID})">Delete</button></td>
        `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    });
};




const openModal = async (tourId) => {
    const tourDetails = await fetchTourDetails(tourId);
    if (tourDetails) {
        // Display the tour details in a small modal
        alert(`Tour Details:\nTour ID: ${tourDetails.tourId}\nTour Name: ${tourDetails.tourName}\nPrice: ${tourDetails.price}\nDuration: ${tourDetails.duration}`);
    } else {
        alert('Error fetching tour details.');
    }
};

// Call the function to inject destinations into the destinations page table
injectDestinationsTable();





// script for tour table




// script.js

// Function to fetch tours
const fetchTours = async () => {
    try {
        const response = await fetch(`http://localhost:8080/tours`);
        if (!response.ok) {
            throw new Error('Error fetching tours');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tours:', error);
        return null;
    }
};


// Function to delete a tour
const deleteTour = async (tourId) => {
    try {
        const response = await fetch(`http://localhost:8080/tours/${tourId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error deleting tour');
        }

        // After successfully deleting, update the tours table
        injectToursTable();
    } catch (error) {
        console.error('Error deleting tour:', error);
    }
};

// Function to inject tours into the tour table with delete buttons
const injectToursTable = async () => {
    const tours = await fetchTours();
    const tbody = document.getElementById('tour-table-body');
    tbody.innerHTML = '';

    tours.forEach((tour) => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>${tour.tourId}</td>
            <td>${tour.price}</td>
            <td>${tour.tourName}</td>
            <td>${tour.reviews}</td>
            <td>${tour.description}</td>
            <td>${tour.duration}</td>
            <td><img src="${tour.imageUrl}" alt="${tour.tourName}" style="width: 120px;"></td>
            <td class="primary"><a href="#" onclick="openModal(${tour.tourId})">Details</a></td>
            <td class="primary"><button onclick="deleteTour(${tour.tourId})">Delete</button></td>
        `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    });
};




// Call the function to inject tours into the tour page table
injectToursTable();



//booking
// Assuming you have a similar fetch function for bookings
const fetchBookings = async () => {
    try {
        const response = await fetch(`http://localhost:8080/bookings`);
        if (!response.ok) {
            throw new Error('Error fetching bookings');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return null;
    }
};

const injectBookingsTable = async () => {
    const bookings = await fetchBookings();
    const tbody = document.querySelector('.booking-table-body');

    // Clear existing rows in the tbody
    tbody.innerHTML = '';

    bookings.forEach(booking => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>${booking.bookingID}</td>
            <td>${booking.noOfPeople}</td>
            <td>${booking.booked}</td>
            <td>${booking.tourId}</td>
            <td>${booking.userID}</td>
            <td class="primary"><a href="#" onclick="openModalbooking(${booking.userID})">Details</a></td>

        `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    });
};



const fetchUserDetails = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}`);
        if (!response.ok) {
            throw new Error('Error fetching tour details');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching tour details:', error);
        return null;
    }
};



const openModalbooking = async (userId) => {
    const userDtails = await fetchUserDetails(userId);

    if (userDtails) {
        // Display the tour details in a small modal
        alert(`Tour Details:\nUser ID: ${userDtails.userID}\n\nUser Name: ${userDtails.userName}\n\nuserEmail: ${userDtails.userEmail}\n\nuserPassword: ${userDtails.userPassword}\n\ncreated: ${userDtails.created}`);
    } else {
        alert('Error fetching tour details.');
    }
};

// Call the function to inject bookings into the booking page table
injectBookingsTable();



// user
// script.js

// Function to fetch users

const fetchUsers = async () => {
    try {
        const response = await fetch('http://localhost:8080/users'); // Update the URL with your actual API endpoint
        if (!response.ok) {
            throw new Error('Error fetching users');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return null;
    }
};

// ... (Your existing code)

// Function to delete a user
// Function to delete a user
const deleteUser = async (userId) => {
    try {
        const response = await fetch(`http://localhost:8080/users/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error deleting user');
        }

        // After successfully deleting, update the users table
        injectUsersTable();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Function to inject users into the user table with delete buttons
const injectUsersTable = async () => {
    const users = await fetchUsers();
    const tbody = document.querySelector('.user-table-body');

    // Clear existing rows in the tbody
    tbody.innerHTML = '';

    if (users) {
        users.forEach(user => {
            const tr = document.createElement('tr');
            const trContent = `
                <td>${user.userID}</td>
                <td>${user.userName}</td>
                <td>${user.userEmail}</td>
                <td>${user.userPassword}</td>
                <td>${user.created}</td>
                <td class="primary"><button onclick="deleteUser(${user.userID})">Delete</button></td>
            `;
            tr.innerHTML = trContent;
            tbody.appendChild(tr);
        });
    }
};

// Call the function to inject users into the user page table
injectUsersTable();



// dashboad
const totalBookingsP = document.querySelector('#total_booking');

const updateTotalBookings = async () => {
    try {
        const response = await fetch('http://localhost:8080/totalBookings');
        if (!response.ok) {
            throw new Error('Error fetching totalBookings');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const injectValue = async () => {
    const { totalBookings } = await updateTotalBookings();
    totalBookingsP.textContent = totalBookings;
}

injectValue();


// user

const totalUsersP = document.querySelector('#total_user');

const updateTotalUsers = async () => {
    try {
        const response = await fetch('http://localhost:8080/totalUsers');
        if (!response.ok) {
            throw new Error('Error fetching totalUsers');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const injectValueUser = async () => {
    const { totalUsers } = await updateTotalUsers();
    totalUsersP.textContent = totalUsers;
}

injectValueUser();

//price

const totalPricesP = document.querySelector('#total_income');

const updateTotalPrices = async () => {
    try {
        const response = await fetch('http://localhost:8080/totalPrices');
        if (!response.ok) {
            throw new Error('Error fetching totalPrices');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const injectValueprice = async () => {
    const { totalPrices } = await updateTotalPrices();
    totalPricesP.textContent = totalPrices;
}

injectValueprice();

