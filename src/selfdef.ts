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

function generateSelfDef(){
    var sortorder = 0
    var selfdefEntitys = []

    function dothething(entity){
        entity._id = genID()
        selfdefEntitys.push(entity)
        return entity
    }

    var appdef = dothething(new AppDef({
        name:'selfdef',
        parent:null,
    }))
    
    var idtype = dothething(new DataType({
        parent:appdef._id,
        name:'id',
    }))
    
    var pointertype = dothething(new DataType({
        parent:appdef._id,
        name:'pointer',
    }))
    
    
    var booltype = dothething(new DataType({
        parent:appdef._id,
        name:'bool',
    }))
    
    
    var stringtype = dothething(new DataType({
        parent:appdef._id,
        name:'string',
    }))
    
    
    var numbertype = dothething(new DataType({
        parent:appdef._id,
        name:'number',
    }))
    
    var datetimetype = dothething(new DataType({
        parent:appdef._id,
        name:'datetime',
    }))
    

    var appdefobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'AppDef',
        extends: 'Entity',
    }))

    var entityobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'Entity',
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'_id',
        datatype:'id',
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'parent',
        datatype:'pointer',
        pointertype:'Entity',
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'type',
        datatype:'pointer',
        pointertype:'ObjectDef',
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'name',
        datatype:'string',
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'next',
        datatype:'pointer',
        pointertype:'Entity'
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'createdAt',
        datatype:'datetime',
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'updatedAt',
        datatype:'datetime',
    }))
    dothething(new Attribute({
        parent:entityobj._id,
        name:'status',
        datatype:'string',
    }))

    var objectdefobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'ObjectDef',
        extends: 'Entity',
    }))
    dothething(new Attribute({
        parent:objectdefobj._id,
        name:'extends',
        datatype:'pointer',
        pointertype:'ObjectDef'
    }))
    // genDefaultAttributes(objectdefobj._id,selfdefEntitys)
    
    var attributeobj = dothething(new ObjectDef({
        parent:appdef._id,
        name:'Attribute',
        extends: 'Entity',
    }))
    // genDefaultAttributes(attributeobj._id,selfdefEntitys)
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
        extends: 'Entity',
    }))
    // genDefaultAttributes(datatypeobj._id,selfdefEntitys)



    //---------tournament app


    var tournamentappdef = dothething(new AppDef({
        name:'tournamentdef',
        parent:null,
    }))

    var home = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Home',
        extends: 'Entity',
    }))
    // genDefaultAttributes(home._id,selfdefEntitys)

    var tournament = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Tournament',
        extends: 'Entity',
    }))
    // genDefaultAttributes(tournament._id,selfdefEntitys)
    dothething(new Attribute({
        parent:tournament._id,
        name:'startsat',
        datatype:'datetime'
    }))

    var match = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Match',
        extends: 'Entity',
    }))
    // genDefaultAttributes(match._id,selfdefEntitys)
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
        name:'tournament',
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
        extends: 'Entity',
    }))
    // genDefaultAttributes(player._id,selfdefEntitys)

    var signup = dothething(new ObjectDef({
        parent:tournamentappdef._id,
        name:'Signup',
        extends: 'Entity',
    }))
    // genDefaultAttributes(signup._id,selfdefEntitys)
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
        if(entity.extends){
            entity.extends = objdefs.find(e => e.name == entity.extends)._id
        }
    }
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











