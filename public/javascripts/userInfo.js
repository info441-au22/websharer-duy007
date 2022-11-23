async function init(){
    await loadIdentity();
    loadUserInfo();
}

async function saveUserInfo(){
    //TODO: do an ajax call to save whatever info you want about the user from the user table
    //see postComment() in the index.js file as an example of how to do this
    document.getElementById("userInfoStatus").innerText = "sending data...";
    newInfo = document.getElementById('userInfoInput').value;
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    try {
        await fetchJSON(`api/${apiVersion}/userInfos`, {
            method: "POST",
            body: {
                username: username,
                userInfo: newInfo
            }
        })
    } catch (error) {
        document.getElementById("userInfoStatus").innerText = "Error"
        throw(error)
    }
    document.getElementById('userInfoInput').value = ""
    document.getElementById('userInfoStatus').innerText = ""
    document.getElementById("user_favorite_website").innerHTML = ""

    loadUserInfo()
}

async function loadUserInfo(){
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('user');
    if(username==myIdentity){
        document.getElementById("username-span").innerText= `You (${username})`;
        document.getElementById("user_info_new_div").classList.remove("d-none");
        
    }else{
        document.getElementById("username-span").innerText=username;
        document.getElementById("user_info_new_div").classList.add("d-none");
    }
    
    //TODO: do an ajax call to load whatever info you want about the user from the user table
    let infoJSON = await fetchJSON(`api/${apiVersion}/userInfos?username=${username}`)
    infoDiv = document.getElementById("user_info_div")
    const divNode = document.createElement("div")
    divNode.id = "user_favorite_website"
    divNode.innerHTML = `
    <p>${escapeHTML(infoJSON.favorite_website)}</p>
    <p>Last Updated: ${escapeHTML(infoJSON.created_date)}</p>`
    infoDiv.appendChild(divNode)

    loadUserInfoPosts(username)
}


async function loadUserInfoPosts(username){
    document.getElementById("posts_box").innerText = "Loading...";
    let postsJson = await fetchJSON(`api/${apiVersion}/posts?username=${encodeURIComponent(username)}`);
    let postsHtml = postsJson.map(postInfo => {
        return `
        <div class="post">
            ${escapeHTML(postInfo.description)}
            ${postInfo.htmlPreview}
            <div><a href="/userInfo.html?user=${encodeURIComponent(postInfo.username)}">${escapeHTML(postInfo.username)}</a>, ${escapeHTML(postInfo.created_date)}</div>
            <div class="post-interactions">
                <div>
                    <span title="${postInfo.likes? escapeHTML(postInfo.likes.join(", ")) : ""}"> ${postInfo.likes ? `${postInfo.likes.length}` : 0} likes </span> &nbsp; &nbsp; 
                </div>
                <br>
                <div><button onclick='deletePost("${postInfo.id}")' class="${postInfo.username==myIdentity ? "": "d-none"}">Delete</button></div>
            </div>
        </div>`
    }).join("\n");
    document.getElementById("posts_box").innerHTML = postsHtml;
}


async function deletePost(postID){
    let responseJson = await fetchJSON(`api/${apiVersion}/posts`, {
        method: "DELETE",
        body: {postID: postID}
    })
    loadUserInfo();
}