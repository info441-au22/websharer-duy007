
async function previewUrl(){
    let url = document.getElementById("urlInput").value;
    try {
        let preview = await fetch("api/urls/preview?url=" + url);
        let decode = await preview.text()
        displayPreviews(decode)
    } catch (err) {
        const errHTML = `<div style='max-width: 300px; border: solid 1px; padding: 3px; text-align: center;'>
        <p>${err}</p>
        </div>`
        displayPreviews(errHTML)
    }


}

function displayPreviews(previewHTML){
    document.getElementById("url_previews").innerHTML = previewHTML;
}
