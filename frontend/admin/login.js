document.getElementById('login_btn').addEventListener('click',async () =>{
    const adminName = document.getElementById('userName').value;
    const adminPassword = document.getElementById('userPassword').value;
    const response = await fetch('http://localhost:8080/admins/login', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            adminName,
            adminPassword
        })
    });
    if(!response.ok){
        alert('Error validating');
        return;
    }
    const data = await response.json();
    localStorage.setItem('admin', JSON.stringify(data.user));
    location.replace('http://127.0.0.1:5500/frontend/admin/dashboard.html');
});