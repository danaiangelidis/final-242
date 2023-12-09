const editUser = async(e) => {
    e.preventDefault();
    const form = document.getElementById("edit-user");
    const formData = new FormData(form);
    let response;
/* 
        response = await fetch(`/api/users/${form._id.value}`, {
            method: "PUT",
            body: formData
        });
    }

    if (response.status != 200) {
        console.log("Error " +response.status+ " posting data");
        alert("The form information does not meet the requirements. Please try again.");
        } else {
            alert("New friend added!");
    }
*/
};