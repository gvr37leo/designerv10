

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
        

        var objectdef = findbyname(designer.allentitys,'ObjectDef') 
        this.allObjectDefs = designer.allentitys.filter(e => e.type == objectdef._id)
        var attributeObjectDef = findbyname(this.allObjectDefs,'Attribute')
        this.allAttributes = designer.allentitys.filter(e => e.type == attributeObjectDef._id)

        this.metaEntity = this.allObjectDefs.find(e => e._id == this.entity.type)
        this.metaAttributes = this.allAttributes.filter(a => a.parent == this.metaEntity._id)

        var datatypeObjDef = findbyname(this.allObjectDefs,'DataType')
        this.datatypes = designer.allentitys.filter(e => e.type == datatypeObjDef._id)



        // var res = await query(new Query({
        //     filters:[
        //         new Filter({attribute:'name',operator:'=',value:entity.type}),
        //         new Filter({attribute:'type',operator:'=',value:'objdef'}),
        //     ],
        //     derefences:[
        //         new Dereference({//this derefrence should get the children of an objdef which are attributes
        //             attribute:'parent',
        //             direction:'down',
        //             query:new Query({
        //                 derefences:[
        //                     new Dereference({//this dereference should get the datatype
        //                         attribute:'datatype',
        //                     })
        //                 ]
        //             })
        //         })
        //     ]
        // },))

        // res.attributes
        // res.objdef
        // res.datatypes
        // res.appdef
    }



    //list of backrefs

    render(){
        var that = this
        //look at entitytype
        //find the object that has that type/name
        //find the child attributes
        //check the datatype of the attributes
        //so query could be 

        var widgets = {
            id:IDWidget,
            pointer:pointerWidget,
            string:textWidget,
            number:numberWidget,
            datetime:datetimeWidget,
            bool:boolWidget,
        }
        
        // return <div>
        //     {JSON.stringify(this.metaEntity)}
        //     {JSON.stringify(this.entity)}
        //     {JSON.stringify(this.attributes)}
        //     {JSON.stringify(this.datatypes)}
        // </div>

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
            <div style="margin:10px;">
                <div style="margin-bottom:10px;" id="backrefcontainer"></div>
                <div id="listviewcontainer"></div>
            </div>
        </div>`)
        upsertChild(this.html.querySelector('#listviewcontainer') ,this.listview.render())

        
        if(this.entity.type == findbyname(this.allObjectDefs,'AppDef')._id){//todo
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

        if(this.entity.type == findbyname(this.allObjectDefs,'ObjectDef')._id){//todo
            var button = stringToHTML(`<button>create Attribute</button>`)
            button.addEventListener('click',async () => {
                var objdef = addRandomID(new Attribute({
                    name:'new attribute',
                    parent:this.entity._id,
                    datatype:findbyname(this.datatypes,'string')._id //todo
                }))
                await createOne(objdef)
                designer.refresh()
            })
            qs(this.html,'#btncontainer').appendChild(button)
        }

        qs(this.html,'#btncreate').addEventListener('click',async () => {
            var res = await createOne({
                name:'new entity',
                type:findbyname(this.allObjectDefs,'Entity')._id,//todo
                parent:this.entity._id,
            })
            designer.router.navigateID(res.insertedIds[0])
            designer.refresh()
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


        //type,datatype,pointertype

        this.backrefcontainer = qs(this.html,'#backrefcontainer')
        //find all the attributes that point to this entity's type
        var pointerattributes = designer.allentitys.filter(e => e.datatype == findbyname(this.datatypes,'pointer')._id &&  (e.pointertype == findbyname(this.allObjectDefs,'Entity')._id || e.pointertype == this.entity.type))//todo*2
        var somemap = mapify(pointerattributes,a => a.name)
        for(let attribute of Object.values<any>(somemap)){
            let button = stringToHTML(`<button>${attribute.name}</button>`)
            button.addEventListener('click',() => {
                this.listview.query({[attribute.name]:this.entity._id})
            })
            this.backrefcontainer.appendChild(button)
        }


        this.attributecontainer = this.html.querySelector('#attributecontainer')
        for(let attribute of this.metaAttributes.sort((a,b) => a.sortorder - b.sortorder)){

            var reffedDatatype = this.datatypes.find(e => e._id == attribute.datatype)
            let widget = new widgets[reffedDatatype.name]//todo
            this.widgetrefs[attribute.name] = widget
            let attributeitem = stringToHTML(`<div>
                <div style="font-weight:bold;">${attribute.name}</div>
                <div id="widgetcontainer"></div>
            </div>`)
            attributeitem.querySelector('#widgetcontainer').appendChild(
                this.attributecontainer.appendChild(widget.render(this.entity,attribute))
            )
            this.attributecontainer.appendChild(attributeitem)
        }
        return this.html    
    }
}

function findbyname(array,name){
    return array.find(e => e.name == name)
}

function deref(id){
    return designer.allentitys.find(e => e._id == id)
}