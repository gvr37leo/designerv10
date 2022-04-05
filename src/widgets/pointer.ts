class pointerWidget{
    html

    // <button type="button">remove</button>

    render(object:Entity,attribute:Attribute){

        //should show a dropdown
        //should also allow to just put a number in
        //either a custom query
        //example parent can be any entity
        //for datatype:everything that has type of *type.name == Datatype,pointertype anything that has *type.name == ObjectDef,type anything that has *type.name == ObjectDef
        this.html = stringToHTML(`<div key={object._id}>
            <input type="text" value="${object[attribute.name] ?? ''}"></input>
            <a href='/entity/${object[attribute.name]}'>${designer.allentitys.find(e => e._id == object[attribute.name])?.name ?? ''}</a>
            <select id="select">
            </select>
        </div>`) as HTMLInputElement
        var selectelement = qs(this.html,'#select')


        //look at pointertype and get a list of everything of that type
        if(deref(attribute.pointertype).name != 'Entity'){
            var entitysoftype = designer.allentitys.filter(e => e.type == attribute.pointertype)
            for(var entity of entitysoftype){
                selectelement.appendChild(stringToHTML(`<option value="${entity._id}">${entity.name}</option>`))
            }
            selectelement.value = object[attribute.name]
        }else{
            this.html.removeChild(selectelement)
        }
        
        selectelement.addEventListener('change', e => {
            qs(this.html,'input').value = e.target.value
        })
        
        this.html.querySelector('a').addEventListener('click',(e) => {
            e.preventDefault()
            designer.router.navigateID(object[attribute.name])
        })
        // this.html.querySelector('button').addEventListener('click',(e) => {
        //     object[attribute.name] = null
        // })
        return this.html
    }

    getValue(){
        var input = this.html.querySelector('input')
        if(input.value){
            return parseInt(input.value)
        }else{
            return null
        }
    }
    //retrieve name of object and display that

}