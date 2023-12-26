const slides = document.querySelectorAll('.slides');
let counter = 0;
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
        return;
    }
    counter++;
    slideImage();
},5000);

document.getElementById('carousel_left').addEventListener('click', ()=>{
    if(counter <= 0){
        counter = 5;
        return;
    }
    counter--;
    slideImage();
});

document.getElementById('carousel_right').addEventListener('click', ()=>{
    if(counter >= 5){
        counter = 0;
        return;
    }
    counter++;
    slideImage();
});

