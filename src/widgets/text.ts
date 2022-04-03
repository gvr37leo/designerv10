
class textWidget{

    html

    render(object:Entity,attribute:Attribute){
        this.html = stringToHTML(`<input type="text"></input>`) as HTMLInputElement
        this.html.value = object[attribute.name]
        return this.html
    }

    getValue(){
        return this.html.value
    }
}