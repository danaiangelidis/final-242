const getCurrentUser = async() => {
    try {
        return (await fetch("/api/users/")).json();
    } catch (error) {
        console.log(error);
    }
};

const areYouSure = async() => {
    const ays = document.getElementById("are-you-sure")
    ays.classList.remove("hidden");
    let currentUser = await getCurrentUser();

    const msg = document.getElementById("msg");
    msg.innerHTML = "Are you sure you want to delete your account?"

    document.getElementById("ays-yes").onclick = () => {
        document.getElementById("are-you-sure").classList.add("hidden");
        msg.innerHTML = "";
        deleteAccount(currentUser);
    };
    
    document.getElementById("ays-no").onclick = () => {
        msg.innerHTML = "";
        document.getElementById("are-you-sure").classList.add("hidden");
    };
}

const deleteAccount = async(user) => {
    let response = await fetch(`/api/users/${user._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error " +response.status+ " deleting");
        return;
    }

    window.location.href = "/";
};

window.onload = () => {
    document.getElementById("deac-acc-button").onclick = (e) => {
        e.preventDefault();
        areYouSure();
    };

    document.getElementById("close-ays").onclick = () => {
        document.getElementById("are-you-sure").classList.add("hidden");
    };
};