function genID(){
    return Math.floor(Math.random() * 1000000000)
}



function keeptrack(array,cb:(entity) => any):(entity) => any{
    var newcb = (entity) => {
        var res = cb(entity)
        array.push(res)
        return res
    }
    return newcb
}

function addRandomID(entity:Entity){
    entity._id = genID()
    return entity
}

function generateSelfDef(){
    var sortorder = 0
    var selfdefEntitys = []

    var dothething = keeptrack(selfdefEntitys,addRandomID)
    

    var appdef = dothething(new AppDef({
        name:'selfdef',
        parent:null,
    }))
    
    
    var idtype = dothething(new DataType({
        parent:appdef._id,
        name:'id',
        sortorder:sortorder++,
    }))
    
    
    var pointertype = dothething(new DataType({
        parent:appdef._id,
        name:'pointer',
        sortorder:sortorder++,
    }))
    
    
    var booltype = dothething(new DataType({
        parent:appdef._id,
        name:'bool',
        sortorder:sortorder++,
    }))
    
    
    var stringtype = dothething(new DataType({
        parent:appdef._id,
        name:'string',
        sortorder:sortorder++,
    }))
    
    
    var numbertype = dothething(new DataType({
        parent:appdef._id,
        name:'number',
        sortorder:sortorder++,
    }))
    
    var datetimetype = dothething(new DataType({
        parent:appdef._id,
        name:'datetime',
        sortorder:sortorder++,
    }))
    

    var appdefobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'AppDef',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(appdefobj._id,selfdefEntitys)

    var entityobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'Entity',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(entityobj._id,selfdefEntitys)

    var objectdefobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'ObjectDef',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(objectdefobj._id,selfdefEntitys)
    
    var attributeobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'Attribute',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(attributeobj._id,selfdefEntitys)
    dothething(new Attribute({
        parent:attributeobj._id,
        name:'pointertype',
        datatype:'pointer',
        pointertype:'ObjectDef'
    }))
    dothething(new Attribute({
        parent:attributeobj._id,
        name:'datatype',
        datatype:'pointer',
        pointertype:'DataType'
    }))
    
    var datatypeobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'DataType',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(datatypeobj._id,selfdefEntitys)



    //---------tournament app


    var tournamentappdef = dothething(new AppDef({
        name:'tournamentdef',
        parent:null,
    }))

    var home = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Home',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(home._id,selfdefEntitys)

    var tournament = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Tournament',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(tournament._id,selfdefEntitys)
    dothething(new Attribute({
        parent:tournament._id,
        name:'startsat',
        datatype:'datetime'
    }))

    var match = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Match',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(match._id,selfdefEntitys)
    dothething(new Attribute({
        parent:match._id,
        name:'player1',
        datatype:'pointer',
        pointertype:'Player',
    }))
    dothething(new Attribute({
        parent:match._id,
        name:'player2',
        datatype:'pointer',
        pointertype:'Player',
    }))
    dothething(new Attribute({
        parent:match._id,
        name:'match_tournament',
        datatype:'pointer',
        pointertype:'Tournament'
    }))
    dothething(new Attribute({
        parent:match._id,
        name:'score1',
        datatype:'number',
    }))
    dothething(new Attribute({
        parent:match._id,
        name:'score2',
        datatype:'number',
    }))
    dothething(new Attribute({
        parent:match._id,
        name:'scoreReported',
        datatype:'bool',
    }))

    var player = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Player',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(player._id,selfdefEntitys)

    var signup = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Signup',
        sortorder:sortorder++,
    }))
    genDefaultAttributes(signup._id,selfdefEntitys)
    dothething(new Attribute({
        parent:signup._id,
        name:'signup_player',
        datatype:'pointer',
        pointertype:'Player'
    }))
    dothething(new Attribute({
        parent:signup._id,
        name:'signup_tournament',
        datatype:'pointer',
        pointertype:'Tournament'
    }))
    dothething(new Attribute({
        parent:signup._id,
        name:'checkedin',
        datatype:'bool',
    }))

    //----------tournament end

    // var entitymap = mapify(entitys,e => e._id)
    // for(var entity of entitys){
    //     var metaentity = entitys.find(e => e.name == entity.type)
    //     var attributes = entitys.filter(e => e.parent == metaentity._id && e.datatype == 'pointer')

    //     for(var attribute of attributes){
    //         var reffedEntity = entitymap[entity[attribute.name]]
    //         if(reffedEntity){
    //             arrayupsert(reffedEntity.backrefs,attribute.name,entity._id)
    //         }
    //     }
    // }

    //resolve pointers
    //type,datatype,pointertype
    IDifyPointers(selfdefEntitys)

    return selfdefEntitys

    //default attributes
    
}

function IDifyPointers(entitys){

    var objdefs = entitys.filter(e => e.type == 'ObjectDef')
    var datatypes = entitys.filter(e => e.type == 'DataType')

    for(var entity of entitys){
        var entitytype = objdefs.find(e => e.name == entity.type)
        entity.type = entitytype._id
        if(entity.datatype){
            entity.datatype = datatypes.find(e => e.name == entity.datatype)._id
        }
        if(entity.pointertype){
            entity.pointertype = objdefs.find(e => e.name == entity.pointertype)._id
        }
    }
}

function genDefaultAttributes(parentid,outputarray = []){
    var dothething = keeptrack(outputarray,addRandomID)

    dothething(new Attribute({
        parent:parentid,
        name:'_id',
        datatype:'id',
        sortorder:1,
    }))
    dothething(new Attribute({
        parent:parentid,
        name:'parent',
        datatype:'pointer',
        pointertype:'Entity',
        sortorder:2,
    }))
    dothething(new Attribute({
        parent:parentid,
        name:'type',
        datatype:'pointer',
        pointertype:'ObjectDef',
        sortorder:3,
    }))
    dothething(new Attribute({
        parent:parentid,
        name:'name',
        datatype:'string',
        sortorder:4,
    }))
    dothething(new Attribute({
        parent:parentid,
        name:'sortorder',
        datatype:'number',
        sortorder:5,
    }))
    dothething(new Attribute({
        parent:parentid,
        name:'createdAt',
        datatype:'datetime',
        sortorder:6,
    }))
    dothething(new Attribute({
        parent:parentid,
        name:'updatedAt',
        datatype:'datetime',
        sortorder:7,
    }))
    dothething(new Attribute({
        parent:parentid,
        name:'status',
        datatype:'string',
        sortorder:8,
    }))
    return outputarray
}

function arrayupsert(object,arrayname,value){
    if(object[arrayname]){
        object[arrayname].push(value)
    }else{
        object[arrayname] = [value]
    }
}

function mapify(arr,cb){
    var map = {}
    for(var item of arr){
        map[cb(item)] = item
    }
    return map
}

function groupby(arr,cb){
    var map = {}
    for(var item of arr){
        var key = cb(item)
        if(map[key]){
            map[key].push(item)
        }else{
            map[key] = [item]
        }
    }
    return map
}











