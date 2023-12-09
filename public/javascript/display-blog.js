const getPosts = async () => {
    try {
        return (await fetch("/api/posts/")).json();
    } catch (error) {
        console.log(error);
    }
};

const getCurrentUser = async() => {
    try {
        return (await fetch("/api/users/")).json();
    } catch (error) {
        console.log(error);
    }
};
  
const showPosts = async () => {
    let posts = await getPosts();
    let currentUser = await getCurrentUser();
    let postsSection = document.getElementById("all-posts");
    postsSection.innerHTML = "";

    posts.forEach((post) => {
        if(post.username == currentUser.username) {
            postsSection.append(getPostInfo(post));
        }
    });
};

const getPostInfo = (post) => {
    document.getElementById("name").innerHTML = post.username;

    let sect = document.createElement("section");
    sect.classList.add("posts");

    let a = document.createElement("a");
    a.href = "#";
    sect.append(a)

    let image = document.createElement("img");
    image.src = "../" + post.img;
    a.append(image);
  
    let p = document.createElement("p");
    p.innerHTML = post.description;
    a.append(p);
    
    post.tags.forEach((tag) => {
        p.innerHTML += " #" + tag;
    });

    a.onclick = (e) => {
        e.preventDefault();
        displayPost(post);
        document.getElementById("view-post-box").classList.remove("hidden");
    };
  
    return sect;
};
  
const displayPost = (post) => {
    const container = document.getElementById("view-post");
    container.innerHTML = "";

    const img = document.createElement("img");
    img.src = `../${post.img}`;
    container.append(img);

    const content = document.createElement("section");
    content.classList.add("content");
    container.append(content);

    const h1 = document.createElement("h1");
    h1.innerHTML = post.username;
    content.append(h1);

    const p = document.createElement("p");
    p.innerHTML = post.description;
    content.append(p);

    const section = document.createElement("section");
    section.classList.add("tags");
    content.append(section);

    post.tags.forEach((tag) => {
        const p = document.createElement("p");
        section.append(p);
        p.innerHTML = tag;
    });

    const h2 = document.createElement("h2");
    h2.innerHTML = "Comments"
    content.append(h2);

    post.comments.forEach((comment) => {
        const plala = document.createElement("p");
        plala.innerHTML = comment;
        content.append(plala);
    });

    const form = document.createElement("form");
    content.append(form);

    const input = document.createElement("input");
    input.type = "text";
    input.setAttribute('id','txt-new-comment');
    input.setAttribute('name','txt-new-comment');
    input.placeholder = "Comment";
    form.append(input);

    const commentButton = document.createElement("button");
    commentButton.setAttribute('id', 'post-comment');
    commentButton.innerHTML = "Submit";
    form.append(commentButton);

    commentButton.onclick = (e) => {
        e.preventDefault();
        post.comments.push(form.elements["txt-new-comment"].value);
        displayPost(post);
    };

    const eLink = document.createElement("a");
    eLink.innerHTML = "Edit";
    content.append(eLink);
    eLink.id = "edit-link";

    let between = " | ";
    between.id = "between"
    content.append(between);

    const dLink = document.createElement("a");
    dLink.innerHTML = "Delete";
    content.append(dLink);
    dLink.id = "delete-link";

    eLink.onclick = (e) => {
        e.preventDefault();
        document.getElementById("form-box").classList.remove("hidden");
        document.getElementById("title").innerHTML = "Edit Post";
    };

    dLink.onclick = (e) => {
        e.preventDefault();
        areYouSure(post);
    };

    resetForm();
    populateEditForm(post);
};

const areYouSure = (post) => {
    const ays = document.getElementById("are-you-sure")
    ays.classList.remove("hidden");

    const msg = document.getElementById("msg");
    msg.innerHTML = "Are you sure you want to delete this post?"

    document.getElementById("ays-yes").onclick = () => {
        document.getElementById("are-you-sure").classList.add("hidden");
        document.getElementById("view-post-box").classList.add("hidden");
        msg.innerHTML = "";
        deletePost(post);
    };
    
    document.getElementById("ays-no").onclick = () => {
        msg.innerHTML = "";
        document.getElementById("are-you-sure").classList.add("hidden");
    };
};

const deletePost = async(post) => {
    let response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    if (response.status != 200) {
        console.log("error " +response.status+ " deleting");
        return;
    }

    showPosts();
    document.getElementById("view-post").innerHTML = "";
    resetForm();
}

const populateEditForm = (post) => {
    const form = document.getElementById("post-edit-form");
    form._id.value = post._id;
    form.username.value = post.username;
    form.description.value = post.description;
    populateTags(post);
};

const populateTags = (post) => {
    const section = document.getElementById("tag-boxes");

    post.tags.forEach((tag) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = tag;
        section.append(input);
    });
}

const editPost = async(e) => {
    e.preventDefault();
    const form = document.getElementById("post-edit-form");
    const formData = new FormData(form);
    let response;
    formData.append("tags", getTags());

    response = await fetch(`/api/posts/${form._id.value}`, {
        method: "PUT",
        body: formData
    });

    if (response.status != 200) {
        console.log("Error " +response.status+ " posting data");
        alert("The form information does not meet the requirements. Please try again.");
    } else {
        alert("Post updated.");
    }

    post = await response.json();

    resetForm();
    document.getElementById("form-box").classList.add("hidden");
    document.getElementById("view-post-box").classList.add("hidden");
    showPosts();
};

const resetForm = () => {
    const form = document.getElementById("post-edit-form");
    form.reset();
    form._id = "-1";
    document.getElementById("tag-boxes").innerHTML = "";
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

window.onload = () => {
    showPosts();

    document.getElementById("close-view").onclick = () => {
        document.getElementById("view-post-box").classList.add("hidden");
    };

    document.getElementById("close-ays").onclick = () => {
        document.getElementById("are-you-sure").classList.add("hidden");
    };

    document.getElementById("close-form").onclick = () => {
        document.getElementById("form-box").classList.add("hidden");
    };

    document.getElementById("post-edit-form").onsubmit = editPost;
    document.getElementById("add-tag").onclick = addTags;
};