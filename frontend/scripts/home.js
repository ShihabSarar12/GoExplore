if(!localStorage.getItem('user')){
    location.replace('http://127.0.0.1:5500/frontend/pages/index.html');
}

const slides = document.querySelectorAll('.slides');
const toursElement = document.querySelector('#tours');
const logoutBtn = document.querySelector('#logout');

logoutBtn.addEventListener('click', () =>{
    localStorage.removeItem('user');
    location.reload();
})
let counter = 0;

const injectTourCards = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/tours`);
        if(!response.ok){
            throw new Error('Error occured while fetching data');
        }
        const tours = await response.json();
        for(let i=0;i<4;i++){
            const { tourName, description, price, reviews, duration, imageUrl } = tours[i];
            toursElement.innerHTML += `
            <div class="bg-blue-300 w-64 h-72 rounded-2xl flex justify-between flex-col p-6">
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
        }
    } catch(error){
        console.log('Fetch Error', error);
    }
}

injectTourCards();

slides.forEach((slide, index) =>{
    slide.style.left = `${100 * index}%`;
});

const slideImage = () =>{
    slides.forEach((slide) =>{
        slide.style.transform = `translateX(-${counter * 100}%)`;
    });
}

setInterval(() =>{
    if(counter >= 5){
        counter = 0;
        slideImage();
        return;
    }
    counter++;
    slideImage();
},5000);

document.getElementById('carousel_left').addEventListener('click', ()=>{
    if(counter <= 0){
        counter = 5;
        slideImage();
        return;
    }
    counter--;
    slideImage();
});

document.getElementById('carousel_right').addEventListener('click', ()=>{
    if(counter >= 5){
        counter = 0;
        slideImage();
        return;
    }
    counter++;
    slideImage();
});

