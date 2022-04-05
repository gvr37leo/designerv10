class IDWidget{
    html: HTMLInputElement;

    constructor(){

    }

    render(object:Entity,attribute:Attribute){
        this.html = stringToHTML(`<input type="text" readonly></input>`) as HTMLInputElement
        this.html.value = object[attribute.name]
        return this.html
    }

    getValue(){
        return parseInt(this.html.value)
    }
}