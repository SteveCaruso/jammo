/*

    Jammo!   
    (Pronounced "YAHM-muh" = "Andiamo!" = "Let's go!")

    Really quick and dirty flat-file templating system.

*/

const version = "v0.1";
console.log(`Jammo! Jammo! 'Ncoppo jammo jà... (${version})`);

//Step 1: Save all page defaults

const base = {
    "title"             : document.title,
    //"header"            : document.querySelector("header").innerHTML,
    //"navigation"        : document.querySelector("nav").innerHTML,
    "main"              : document.querySelector("main").innerHTML,
    //"footer"            : document.querySelector("footer").innerHTML
};

//Step 2: Define Supporting Libraries

//Shortcuts
const q  = (query) => { return document.querySelector(query); }
const qa = (query) => { return document.querySelectorAll(query); }

//Read data from url
function loadUrl(src,obj) {

    if (obj == undefined) obj = {};

    return new Promise((resolve, reject) => {

        var xhr = new XMLHttpRequest();

        xhr.open(obj.method || "GET", src);

        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };

        xhr.onerror = () => reject(xhr.statusText);
        
        xhr.send(obj.body);

    });
}

//Load a page's data in
async function loadPage(page) { 
    //"Where do we go? ->
    console.log(`Jamm' addò? -> ${page}`);

    //Put together a lookup table for permalinks to be stored on the main page

    //Grab the page
    let data = await loadUrl('/html/'+page+'.html');

    //Parse the page
    var parser = new DOMParser();
    var doc = parser.parseFromString(data, "text/html");

    //Tag new scripts
    //Add in listeners before staging
    doc.querySelectorAll('script').forEach((anchor) => { 
        anchor.setAttribute('new-script','true');
    });

    //Add in listeners before staging
    doc.querySelectorAll('a').forEach((anchor) => { 
        anchor.setAttribute('new-link','true');
    });

    //Helper function
    let grabField = (name) => {
        return doc.querySelector(name) ? doc.querySelector(name).innerHTML : base[name];
    }

    //Change URL
    history.pushState({"page":page}, grabField("title"), '/'+(page=="home"?"":page));

    //Stage the new data and put it into the DOM
    let sections = {};
    
    Object.keys(base).forEach((key) => {

        sections[key] = grabField(key);
        //console.log(key,sections[key],base[key]);
        
        if (sections[key] != base[key]) {  
            
            let element = document.querySelector(key);
            
            element.innerHTML = sections[key];

            //Execute internal scripts
            Array.from(element.querySelectorAll("script")).forEach( oldScript => {
                const newScript = document.createElement("script");
                Array.from(oldScript.attributes)
                     .forEach( attr => newScript.setAttribute(attr.name, attr.value) );
                newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });

        }
    
    });

    //Link up internal links
    qa('a[new-link]').forEach((anchor) => { 
        anchor.addEventListener('click',(event) => {
            event.preventDefault();
            if (anchor.attributes.href.value[0] == "@") 
                loadPage(anchor.attributes.href.value.substring(1));
            return false;
        });
    });

    //"And we're done."
    console.log("E simmo finuto.");

}

//Step 3: Link up base internal links
//Link up internal links
qa('a').forEach((anchor) => { 
    anchor.addEventListener('click',(event) => {
        event.preventDefault();
        if (anchor.attributes.href.value[0] == "@") 
            loadPage(anchor.attributes.href.value.substring(1));
        return false;
    });
});

//Step 4: Load in home page content
loadPage('home');