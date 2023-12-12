document.getElementById('login_btn').addEventListener('click',async () =>{
    const userName = document.getElementById('userName').value;
    const userPassword = document.getElementById('userPassword').value;
    const response = await fetch('http://localhost:8080/user/login', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            userName,
            userPassword
        })
    });
    if(!response.ok){
        alert('Error validating');
    }
    console.log(response.status);
});