

class DetailView{
    entity: Entity
    metaEntity: any
    datatypes: any
    metaAttributes: any
    allAttributes: any[]
    html:HTMLElement
    attributecontainer: HTMLElement
    widgetrefs:any = {}
    listview: ListView
    backrefcontainer: any
    allObjectDefs: any

    //attributes
    //delete
    //duplicatie

    constructor(){
        this.listview = new ListView()
        
    }

    async load(entity:Entity){
        this.entity = entity
        

        this.allObjectDefs = designer.groupbytype[findbyname('ObjectDef')._id]
        this.allAttributes = designer.groupbytype[findbyname('Attribute')._id]
        this.datatypes = designer.groupbytype[findbyname('DataType')._id]

        this.metaEntity = deref(this.entity.type)
        this.metaAttributes = children(this.metaEntity._id)
    }

    render(){
        var that = this

        var widgets = {
            id:IDWidget,
            pointer:pointerWidget,
            string:textWidget,
            number:numberWidget,
            datetime:datetimeWidget,
            bool:boolWidget,
        }

        this.html = stringToHTML(`<div>
            <h1>${this.entity.name}</h1>
            <div id="btncontainer" style="display:flex">
                <button id="btncreate">create child</button>
                <button id="btnduplicate">duplicate</button>
                <button id="btndelete">delete</button>
                <button id="btnsave">save</button>
            </div>
            <div id="attributecontainer">
                
            </div>
            <div style="margin:10px; border:1px solid black; padding:5px; border-radius:3px;">
                <div style="margin-bottom:10px;" id="backrefcontainer"></div>
                <div id="listviewcontainer"></div>
            </div>
        </div>`)
        
        this.backrefcontainer = qs(this.html,'#backrefcontainer')
        this.listview.metaAttributes = children(findbyname('Entity')._id)
        upsertChild(this.html.querySelector('#listviewcontainer') ,this.listview.render())

        
        if(this.entity.type == findbyname('AppDef')._id){
            var button = stringToHTML(`<button>create ObjDef</button>`)
            button.addEventListener('click',async () => {
                var objdef = addRandomID(new ObjectDef({
                    name:'new objdef',
                    parent:this.entity._id
                }))
                var newentitys = genDefaultAttributes(objdef._id)
                newentitys.push(objdef)
                await createMany(newentitys)
                designer.refresh()
            })
            qs(this.html,'#btncontainer').appendChild(button)
        }

        if(this.entity.type == findbyname('ObjectDef')._id){
            var button = stringToHTML(`<button>create Attribute</button>`)
            button.addEventListener('click',async () => {
                var objdef = addRandomID(new Attribute({
                    name:'new attribute',
                    parent:this.entity._id,
                    datatype:findbyname('string')._id
                }))
                await createOne(objdef)
                designer.refresh()
            })
            qs(this.html,'#btncontainer').appendChild(button)
        }

        qs(this.html,'#btncreate').addEventListener('click',async () => {
            var res = await createOne({
                name:'new entity',
                type:findbyname('Entity')._id,
                parent:this.entity._id,
            })
            await designer.refresh()
            // designer.router.navigateID(res.insertedIds[0])
        })

        this.html.querySelector('#btnduplicate').addEventListener('click',async () => {
            var copy = Object.assign({},this.entity)
            delete copy._id
            var res = await createOne(copy)
            designer.router.navigateID(res.insertedIds[0])
            designer.refresh()
        })
        this.html.querySelector('#btndelete').addEventListener('click', async () => {
            await removeID(this.entity._id)
            designer.router.navigateID(this.entity.parent)
            designer.refresh()
        })
        this.html.querySelector('#btnsave').addEventListener('click', async () => {
            var res = {}
            for(var key in that.widgetrefs){
                res[key] = that.widgetrefs[key].getValue()
            }
            await update(res)
            designer.refresh()
        })


        //render attributes--------------------------
        this.attributecontainer = this.html.querySelector('#attributecontainer')
        for(let attribute of this.metaAttributes.sort((a,b) => a.sortorder - b.sortorder)){

            let reffedDatatype = this.datatypes.find(e => e._id == attribute.datatype)
            let widget = new widgets[reffedDatatype.name]//todo
            this.widgetrefs[attribute.name] = widget
            let attributeitem = cr('div')
                cr('div',{style:'font-weight:bold; margin-top:10px;'});text(attribute.name);end();
                var widgetcontainer = crend('div');
            end();
            widgetcontainer.appendChild(
                this.attributecontainer.appendChild(widget.render(this.entity,attribute))
            )
            this.attributecontainer.appendChild(attributeitem)
        }
        //render attributes end------------------

        //backrefs buttons-----------------------
        let parentbutton = cr('button');text('children');flush();
        parentbutton.addEventListener('click',() => {
            this.listview.metaAttributes = children(findbyname('Entity')._id)
            this.listview.query({parent:this.entity._id},{})
        })
        this.backrefcontainer.appendChild(parentbutton)

        if(this.entity.type == findbyname('ObjectDef')._id){
            let typebutton = cr('button');text('type');flush();
            typebutton.addEventListener('click',() => {
                this.listview.metaAttributes = children(findbyname('Entity')._id)
                this.listview.query({type:this.entity._id},{})
            })
            this.backrefcontainer.appendChild(typebutton)
        }

        var pointerattributes = designer.groupbytype[findbyname('Attribute')._id].filter(e => e.datatype == findbyname('pointer')._id && (e.pointertype == this.entity.type) && e.name != 'type')
        for(let attribute of pointerattributes){
            let button = stringToHTML(`<button>${deref(attribute.parent).name}.${attribute.name}</button>`)
            button.addEventListener('click',() => {
                this.listview.metaAttributes = children(attribute.parent)
                var query = {
                    type:attribute.parent,
                }
                Object.assign(query,{[attribute.name]:this.entity._id})
                this.listview.query(query,{})
            })
            this.backrefcontainer.appendChild(button)
        }
        //backrefs buttons end-----------------------


        
        return this.html    
    }
}

function findbyname(name){
    return designer.entitymapbyname[name]
}

function deref(id){
    return designer.entitymap[id]
}

function siblings(id){
    return children(deref(id).parent)
}

function children(id){
    if(designer.groupbyparent[id]){
        return designer.groupbyparent[id]
    }else{
        return []
    }
}