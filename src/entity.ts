class Entity{
    _id
    parent
    type = "Entity"
    name
    sortorder
    createdAt
    updatedAt
    status

    //           field   list of entitys whose field references this entity
    // backrefs:{[key:string]:number[]} = {}
    /* 
    {
        parent:[132465,734545,723545,46233523],
        type:[67353,72354,623462,26234]
        datatype:[62324,234265,23424,2352134]
    }

    
    */
    constructor(data:Partial<Entity>){
        Object.assign(this,data)
    }

    getChildIDs(){
        // return Array.from(this.backrefs['parent'])
    }

    addGenId(entity:Entity){
        this.createdAt = Date.now()
    }

    addExistingId(entity){
        this.createdAt = Date.now()
    }

    updateData(data){

    }

    addRef(field,value){
        this[field] = value
        // this.backrefs.get(field).add(value)
        var foreign = globalstore.get(value)
        // foreign.backrefs[field].push(value)
        this.updatedAt = Date.now()
    }

    deleteRef(field,value){
        delete this[field]
        var foreign = globalstore.get(value)
        // foreign.backrefs[field].push(value)
        this.updatedAt = Date.now()
    }

    updateRef(field,value){
        this.deleteRef(field,this[field])
        this.addRef(field,value)
        this.updatedAt = Date.now()
    }

    delete(){
        // for(var field in this.backrefs){
        //     var refs = this.backrefs[field]
        //     for(var ref of refs){
        //         delete globalstore.get(ref)[field]
        //     }
        // }
        this.updatedAt = Date.now()
    }

    query(query){

    }

    descendants(filter){
        
    }

    getChildren(filter){
        // return Array.from(this.backrefs['parent']).map(id => globalstore.get(id)).filter(filter)
    }

    ancestor(filter){

    }

    getParent(){
        return globalstore.get(this.parent)
    }

    siblings(filter){
        this.getParent().getChildren((c) => c.id != this._id && filter(c))
    }
}
