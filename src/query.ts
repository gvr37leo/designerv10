class Filter{
    attribute:string
    value:any
    operator:string

    constructor(data:Partial<Filter>){
        Object.assign(this,data)
    }
}

class Sort{
    attribute
    asc = true

    constructor(data:Partial<Sort>){
        Object.assign(this,data)
    }
}

class Dereference{
    attribute:string
    direction:string = 'up'
    query:Query

    constructor(data:Partial<Dereference>){
        Object.assign(this,data)
    }
}

class Query{
    sort:Sort[] = []
    skip = 0
    limit = 10
    filters:Filter[] = []

    //for each item that gets returned
    derefences:Dereference[] = []

    constructor(data:Partial<Query>){
        Object.assign(this,data)
    }
}