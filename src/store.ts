
//id
//pointer
//number
//boolean
//string
//datetime

//the data itself
//the metadata for normal ui

//the selfdef for core ui with the data being the metadata



class Store{
    entitys = new Map<string,Entity>()
    // foreignkeys//for now this is saved on entitys themselves

    get(id){
        return this.entitys.get(id)
    }

    query(query:Query){

        //first query/filter goes over every entity
        //subsequent down dereferences the filter goes only over those children

        var res = []
        var tasks = [query]

        while(tasks.length > 0){
            var currentquery = tasks.shift()

        }

        return res

    }

}

