
function optimizeImageQuality(imageDataURI, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            // const quality = 0.7; 
            const optimizedImageDataURI = canvas.toDataURL('image/jpeg', quality);
            resolve(optimizedImageDataURI);
        };
        img.onerror = (err) => {
            reject(err);
        };
        img.src = imageDataURI;
    });
}


function file64(path) {
    return new Promise((yes, no) => {
        try {
            const reader = new FileReader()
            reader.readAsDataURL(path)
            reader.onload = () => {
                yes(reader.result)
            }
        } catch (err) {
            no(err)
        }
    })
}

function timo(date) {
    dayjs.extend(window.dayjs_plugin_relativeTime);
    dayjs();
    const futureDate = dayjs(date);
    // console.log(futureDate.fromNow());
    return futureDate.fromNow()
}

function focus(id) {
    document.getElementById(id).focus()
}


function getCurrentDate() {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString();
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

function compile(id) {
    var editor = document.getElementById(id)
    var content = editor.innerText



    // content = content.replace(/ /g, "&nbsp");
    content = content.replace(/(\r\n|\n|\r)/g, "<br>");

    content = content.replace(/(?<name>[^\s]+)::(?<url>[^\s]+)/gm, '<a href="$2" title="$2">$1</a>')
    // content = content.replace(/(https?:\/\/\S+)/gi, `<a href="$1" class="dotlink">$1</a>`);
    content = content.replace(/_([^*]+)_/g, `<u>$1</u>`);
    content = content.replace(/~([^*]+)~/g, `<s>$1</s>`);
    content = content.replace(/\.\.\.\.(.+?)\.\.\.\./g, "<i>$1</i>");
    content = content.replace(/\.\.\.(.+?)\.\.\./g, "<code class='user-select-all'>$1</code>");
    content = content.replace(/\.\.(.+?)\.\./g, "<b>$1</b>");
    content = content.replace(/!!([\w-]+)/g, `<i class="bi bi-$1"></i>`);

    navigator.clipboard.writeText(content)
    return content
}

function isArabic(text) {
    var arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text)
}

function text64(htmlString) {
    const encoder = new TextEncoder();
    const binaryData = encoder.encode(htmlString);
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(binaryData.buffer)));
    return base64Data;
}
function parseHTML(id, value) { document.getElementById(id).innerHTML = value }

async function hostImages(api, images) {

    var res = await fetch(api, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain",
        },
        body: JSON.stringify(images)
    })
    res = await res.json()
    return res
}

function getYouTubeId(url) {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/\?v=)|youtu\.be\/)([^\s&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

async function getYouTubeVideoDetails(videoUrl) {
    return new Promise(async (resolve, reject) => {
        const videoId = this.getYouTubeId(videoUrl);
        console.log(videoId);
        const apiKey = "AIzaSyAM6IGBPEtFrI8w62LSSlpV18LvdJtWRaE";
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet%2C+contentDetails`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            console.log(data);
            // const captions = data.items[0].captions;
            const title = data.items[0].snippet.title;
            const description = data.items[0].snippet.description;
            const thumbnail = data.items[0].snippet.thumbnails.default.url;

            const youtube = { title, description, thumbnail };
            // console.log(youtube)
            // return youtube;
            resolve(youtube)
        } catch (error) {
            console.error(error);
            reject(err)
        }
    })
}

function openFiles() {
    return new Promise((res, rej) => {
        try {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/png, image/jpeg, image/jpg');
            input.setAttribute('multiple', true);
            // document.appendChild(input)
            console.log(input);
            input.click();
            input.addEventListener('change', e => {
                console.log(e.target.files);
                res(e.target.files)
            })
        } catch (err) {
            console.log(err);
            rej(500)
        }
    })
}

function noQuotes(str) {
    if (str.startsWith('"') && str.endsWith('"')) {
        return str.substring(1, str.length - 1);
    }
    return str;
}

function titlePath(title) {
    return removeSpecialCharsExceptKeys(title.trim(), [' ', '-']).replaceAll(' ', '-').replace(/-+/g, '-').replaceAll('٪', '').replaceAll('؛', '').replaceAll('،', '').replaceAll('؟', '').toLowerCase()
}

function removeSpecialCharsExceptKeys(str, keys) {
    // Escape special characters in keys array to use in a regular expression
    const escapedKeys = keys.map(key => key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));

    // Regular expression to match all non-alphanumeric characters except keys, Arabic characters, and Arabic punctuation marks
    const regex = new RegExp(`[^a-zA-Z0-9${escapedKeys.join('')}\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF\\u060C\\u061B\\u061F\\u0640]`, 'g');

    return str.replace(regex, '');
}



function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 != "object" || obj1 == null ||
        typeof obj2 != "object" || obj2 == null) {
        return false;
    }
    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);
    if (keys1.length != keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}

function convertGoogleDriveLink(link) {

    try {
        const fileId = link.split("/")[5].split("?")[0];
        return `https://drive.google.com/uc?id=${fileId}`;
    } catch (err) {
        console.log(err);
        return link
    }
}
function extractGoogleDriveId(url) {
    const startIndex = url.indexOf("?id=") + 4; // Add 4 to skip "?id="
    const endIndex = url.indexOf("&export=view");
    if (startIndex >= 4 && endIndex !== -1) {
      return url.substring(startIndex, endIndex);
    } else {
      console.log("Invalid Google Drive link");
      return null;
    }
  }
  
  

function checkNetwork() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (!navigator.onLine) {
        alert("Offline");
    } else if (connection && connection.effectiveType === "2g") {
        alert("Weak network");
    }
}
function getYouTubeThumbnailUrl(videoId) {
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
}

function fixClosingTags(htmlString) {
    const regex = /<\/\s*(\w+)\s*>/g;
    return htmlString.replace(regex, "</$1>");
}
function extractTextContent(htmlString) {
    // Create a new DOM object from the HTML string
    const dom = new DOMParser().parseFromString(htmlString, 'text/html');

    // Get the text content of the document body
    const textContent = dom.body.textContent;

    // Return the text content
    return textContent;
}

function removeExtraLines(str) {
    // Replace all occurrences of more than 2 new lines with 2 new lines
    const cleanedStr = str.replace(/(\n{1,})/g, '\n\n');

    // Return the cleaned string
    return cleanedStr;
}

function removeDoubleSpaces(str) {
    // Replace all occurrences of double spaces with single spaces
    const cleanedStr = str.replace(/\s{2,}/g, ' ');

    // Return the cleaned string
    return cleanedStr;
}

function githubPush(cred) {
    // const authToken = 'your_access_token';
    // const owner = 'your_username_or_organization';
    // const repo = 'your_repository_name';
    // const path = 'path/to/your/file.txt';
    // const message = 'Update file.txt';
    // const newContent = 'This is the new content of the file.';
    // const sha = 'current_sha_of_the_file';
    return new Promise((resolve, reject) => {
        var { authToken, owner, repo, path, message, newContent, sha } = cred

        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                // content: btoa(newContent),
                content: newContent,
                sha: sha
            })
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                // handle response
                resolve(response)

            })
            .catch(error => {
                console.error(error);
                // handle error
                reject(err)
            });
    })


}


function getFileSha(data) {
    // const authToken = 'your_access_token';
    // const owner = 'your_username_or_organization';
    // const repo = 'your_repository_name';
    // const path = 'path/to/your/file.txt';
    var { authToken, owner, repo, path } = data

    return new Promise((resolve, reject) => {
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(`Failed to get file contents (${response.status} ${response.statusText})`);
                }
            })
            .then(data => {
                console.log(data.sha);
                // handle SHA
                resolve(data.sha)
            })
            .catch(error => {
                console.error(error);
                // handle error
                reject(data.sha)
            });
    })

}

function getFolderId(domain, baas) {
    if (domain == 'jurdiconsult.media') {
        var thumbnailsId = '1Z73hzjMWM8U3tsuiULJP6UA1eQY_cHJV'
        var blogsId = '1e2g3ajgOnFv4-sljLYqRTq9s-7GLPcgH'
        var servicesId = '1nm0-UKTTyKwUK_AO75BjbSKPcItW4PYy'
        if (baas == 'thumbnail') return thumbnailsId
        if (baas) return servicesId
        return blogsId


    } else {
        // jurdilaw

        var thumbnailsId = '1KRfNdun7uvFdpowTknj__DC8BVnKwD-X'
        var blogsId = '1SOSRARfsdRbFx-we-gdt49FgKK2o7jEt'
        var servicesId = '1JHM95YOVpHQYnqBgESWa570_2Y7-j5vp'
        if (baas == 'thumbnail') return thumbnailsId
        if (baas) return servicesId
        return blogsId
    }
}

function url64(url) {
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');

    return new Promise(function (resolve, reject) {
        img.onload = function () {
            var canvas = document.createElement('canvas');
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL('image/png');
            console.log(dataURL);

            // Remove the "data:image/png;base64," prefix from the data URL
            // var base64 = dataURL.replace(/^data:image\/(png|jpeg);base64,/, '');

            resolve(dataURL);
        };

        img.onerror = function () {
            reject(new Error('Failed to load image: ' + url));
        };

        img.src = url;
    });
}

function fetchTemplate(url) {
    return new Promise(async (resolve, reject) => {
        var res = await fetch(url)
        if (res.ok) {
            resolve(res.text())
        }
        reject('Template not found')
    })

}
export default {
    url64,
    fetchTemplate,
    extractGoogleDriveId,
    optimizeImageQuality,
    getFolderId,
    getFileSha,
    githubPush,
    removeDoubleSpaces,
    extractTextContent,
    removeExtraLines,
    fixClosingTags,
    getYouTubeThumbnailUrl,
    checkNetwork,
    convertGoogleDriveLink,
    file64,
    timo,
    focus,
    getCurrentDate,
    compile, parseHTML,
    hostImages,
    text64,
    getYouTubeId,
    openFiles,
    noQuotes,
    isArabic,
    deepEqual,
    getYouTubeVideoDetails,
    titlePath
}