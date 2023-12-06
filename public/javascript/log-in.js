const login = (e) => {
    e.preventDefault();
    loginSend(e);
};
  
const loginSend = async (e) => {
    const formData = new FormData(e.target);
    const message = document.getElementById("message-login");
    message.innerHTML = "";
  
    let response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).catch((error) => {
        message.innerHTML = "Error: " + error;
        return;
    });
  
    if (response.status != 200) {
        message.innerHTML = await response.text();
        return;
    }
    
    window.location.href = "/";
};

window.onload = () => {  
    document.getElementById("login-form").onsubmit = login;
};