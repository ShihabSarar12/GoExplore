document.getElementById('login_btn').addEventListener('click',async () =>{
    const userName = document.getElementById('userName').value;
    const userPassword = document.getElementById('userPassword').value;
    const response = await fetch('http://localhost:8080/users/login', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            userName,
            userPassword
        })
    });
    console.log(response);
    if(!response.ok){
        alert('Error validating');
        return;
    }
    const data = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    location.replace('http://127.0.0.1:5500/frontend/pages/home.html');
});