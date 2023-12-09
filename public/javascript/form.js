const createPost = async(e) => {
    e.preventDefault();
    const form = document.getElementById("make-post");
    const formData = new FormData(form);
    let response;
    formData.append("tags", getTags());

    console.log(...formData);

    if (form._id.value == -1) {
        formData.delete("_id");
    
        response = await fetch("/api/posts", {
            method: "POST",
            body: formData
        });
    }

    if (response.status != 200) {
        console.log("Error " +response.status+ " posting data");
        if (response.status == 400) {
            confirm("The form information does not meet the requirements. Please try again.");
        } else if (response.status == 500) {
            console.log("500 Error");
        }
    } else {
        confirm("Post created successfully");
    }

    post = await response.json();
    resetForm();
};

const addTags = (e) => {
    e.preventDefault();
    const section = document.getElementById("tag-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
};

const getTags = () => {
    const inputs = document.querySelectorAll("#tag-boxes input");
    let tags = [];

    inputs.forEach((input) => {
        tags.push(input.value);
    });

    return tags;
};

const resetForm = () => {
    const form = document.getElementById("make-post");
    form.reset();
    form._id = "-1";
    document.getElementById("tag-boxes").innerHTML = "";
    window.location.href = "blog.html";
};

window.onload = () => {
    document.getElementById("make-post").onsubmit = createPost;
    document.getElementById("add-tag").onclick = addTags;
};