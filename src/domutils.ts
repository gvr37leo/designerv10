


var domstack:HTMLElement[] = []

function scr(tag,attributes = {}){
    flush()
    return cr(tag,attributes)
}

function cr(tag,attributes = {}):HTMLElement{
    var parent = peek()
    var element = document.createElement(tag)
    if(parent){
        parent.appendChild(element)
    }
    for(var key in attributes){
        element.setAttribute(key,attributes[key])
    }
    domstack.push(element)
    return element
}

function crend(tag,attributes = {}){
    cr(tag,attributes)
    return end()
}

function text(data:string){
    var textnode = document.createTextNode(data)
    peek().appendChild(textnode)
    return textnode
}

function end(){
    return domstack.pop()
}

function peek(){
    return domstack[domstack.length - 1]
}

function flush(){
    var root = domstack[0]
    domstack = []
    return root
}

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