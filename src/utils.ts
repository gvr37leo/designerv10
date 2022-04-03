

function stringToHTML (str) {
	var temp = document.createElement('template');
    
    temp.innerHTML = str;
    return temp.content.firstChild as HTMLElement;
}

function upsertChild(parent,child){
    if(parent.firstChild){
        parent.replaceChild(child,parent.firstChild)
    }else{
        parent.appendChild(child)
    }
}

function qs(element,query){
    return element.querySelector(query)
}

function qsa(element,query){
    return Array.from(element.querySelectorAll(query))
}