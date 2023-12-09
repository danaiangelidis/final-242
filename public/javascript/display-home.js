const getPosts = async () => {
    try {
        return (await fetch("/api/posts/")).json();
    } catch (error) {
        console.log(error);
    }
};
  
const showPosts = async () => {
    let posts = await getPosts();
    let postsSection = document.getElementById("all-posts");
    postsSection.innerHTML = "";
  
    posts.forEach((post) => {
        postsSection.append(getPostInfo(post));
    });
};
  
const getPostInfo = (post) => {
    let sect = document.createElement("section");
    sect.classList.add("posts");

    let a = document.createElement("a");
    a.href = "#";
    sect.append(a)

    let h3 = document.createElement("h3");
    h3.innerHTML = post.username;
    a.append(h3);

    const image = document.createElement("img");
    image.src = "../" + post.img;
    a.append(image);
  
    let p = document.createElement("p");
    p.innerHTML = post.description;
    a.append(p);

    post.tags.forEach((tag) => {
        p.innerHTML += " " + `#${tag}`;
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
};

const showSearchResult = async (search) => {
    let posts = await getPosts();
    let postsSection = document.getElementById("all-posts");
    postsSection.innerHTML = "";
  
    posts.forEach((post) => {
        post.tags.forEach((tag) => {
            if(tag == search) {
                postsSection.append(getPostInfo(post));
            }
        });
    });
};

window.onload = () => {
    showPosts();

    document.getElementById("close-view").onclick = () => {
        document.getElementById("view-post-box").classList.add("hidden");
    };

    document.getElementById("search-value-form").onsubmit = (e) => {
        e.preventDefault();
    
        const search = document.getElementById("search-value").value;
        showSearchResult(search);
    };
};