
class AppDef extends Entity{
    constructor(data:Partial<AppDef>){
        super(data)
        this.type = 'AppDef'
    }
}

class ObjectDef extends Entity{
    extends:string
    constructor(data:Partial<ObjectDef>){
        super(data)
        this.type = 'ObjectDef'
    }
}

class Attribute extends Entity{
    datatype:string
    pointertype:string

    constructor(data:Partial<Attribute>){
        super(data)
        this.type = 'Attribute'
    }
    
}

class DataType extends Entity{
    constructor(data:Partial<DataType>){
        super(data)
        this.type = 'DataType'
    }

}