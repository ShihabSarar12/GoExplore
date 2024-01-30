if(!localStorage.getItem('admin')){
    location.replace('http://127.0.0.1:5500/frontend/admin/login.html');
}
const dateDiv = document.querySelector('#update-date');
const adminDiv = document.querySelector('#admin');
const themeToggler =document.querySelector(".theme-toggler");
themeToggler.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme-variables'); 

    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');

});
let adminUser = localStorage.getItem('admin');
adminUser = JSON.parse(adminUser);
adminDiv.textContent = adminUser.adminName;
const date = new Date();
dateDiv.textContent = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const fetchUsers = async () =>{
    try{
        const response = await fetch(`http://localhost:8080/users`);
        if(!response.ok){
            throw new Error('Error fetching users');
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error(error);
    }
}

const injectUsers = async () =>{
    const users = await fetchUsers();

    users.map(user =>{
        const tr = document.createElement('tr');
        const trContent = `  
        <td>${user.userName}</td>
        <td>${user.userEmail}</td>
        <td>${user.created}</td>
        `;
        tr.innerHTML = trContent;
        document.querySelector('table tbody').appendChild(tr);
    });
}
injectUsers();