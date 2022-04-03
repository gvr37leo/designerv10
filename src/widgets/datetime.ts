
class datetimeWidget{

    html

    render(object:Entity,attribute:Attribute){
        this.html = stringToHTML(`<input type="datetime-local"></input>`) as HTMLInputElement
        try {
            this.html.value = new Date(object[attribute.name]).toISOString().slice(0,16)
        } catch (error) {
            
        }
        return this.html
    }

    getValue(){
        return this.html.valueAsNumber
    }
}