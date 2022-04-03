

class boolWidget{

    html

    render(object:Entity,attribute:Attribute){
        this.html = stringToHTML(`<input type="checkbox"></input>`) as HTMLInputElement
        this.html.checked = object[attribute.name]
        return this.html
    }

    getValue(){
        return this.html.checked
    }

}