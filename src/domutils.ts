


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
