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

    const img = document.createElement("img");
    img.src = post.img;
    a.append(img);
  
    let p = document.createElement("p");
    p.innerHTML = post.description;
    a.append(p);
    /*
    post.tags.forEach((tag) => {
        p.innerHTML += " " + tag;
    });
  */
    return sect;
};
  
  
window.onload = () => showPosts();