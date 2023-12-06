const signup = (e) => {
    e.preventDefault();
    signupSend(e);
};
  
const signupSend = async (e) => {
    const formData = new FormData(e.target);
    const message = document.getElementById("message");
    message.innerHTML = "";
  
    let response = await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).catch((error) => {
        message.innerHTML = "Error: " + error + "posting data.";
        return;
    });
  
    if (response.status != 200) {
        message.innerHTML = await response.text();
        return;
    }
  
    window.location.href = "/";
};
  
window.onload = () => {
    document.getElementById("signup").onsubmit = signup;
};