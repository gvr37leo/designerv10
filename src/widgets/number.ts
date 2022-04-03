class numberWidget{
    html: HTMLInputElement;

    constructor(){

    }

    render(object:Entity,attribute:Attribute){
        this.html = stringToHTML(`<input type="number"></input>`) as HTMLInputElement
        this.html.value = object[attribute.name]
        return this.html
    }

    getValue(){
        return this.html.valueAsNumber
    }
}