
let mongodb = require('mongodb')
let bodyParser = require("body-parser")
let path = require("path")
var express = require('express')
var app = express()

app.use(bodyParser.json());//for json encoded http body's
app.use(bodyParser.urlencoded({ extended: false }));//for route parameters
app.use(express.static('./'))

let url = 'mongodb+srv://paul:$RF5tg^YH@designerv10.bai64.mongodb.net/testdb?retryWrites=true&w=majority';
let databasename = 'testdb'
let port = 8000
app.listen(port, () => {
    console.log(`listening on ${8000}`)
})

start()

async function start(){
    const client = new mongodb.MongoClient(url);//{useNewUrlParser: true, useUnifiedTopology: true}

    try {
        await client.connect()
        console.log('connected to mongo');
        let db = client.db(databasename)
        let collection = db.collection('firstcollection')
        app.post('/api/create',async function(req, res){
            for(var entity of req.body){
                if(entity._id == null){
                    entity._id = Math.floor(Math.random() * 1000000000)
                }
                entity.createdAt = Date.now()
                entity.updatedAt = Date.now()
                entity.status = 'published'
                // entity.backrefs = {}
                // entity.sortorder = 1
            }

            var result = await collection.insertMany(req.body)
            

            res.send(result)
        })
    
        app.post('/api/query',async function(req, res){
            // if(req.body._id){
            //     req.body._id = new mongodb.ObjectId(req.body._id)
            // }
            var cursor = collection.find(req.body.filter).sort(req.body.sort)
            var result = await cursor.toArray()
            
            res.send(result)
        })
    
        app.put('/api/update',async function(req, res){
            req.body.updatedAt = Date.now()
            //update backrefs
            var result = await collection.findOneAndUpdate({_id:req.body._id}, {$set:req.body})
            res.send(result)
        })
    
        app.delete('/api/delete',async function(req, res){
            //query everything and just do a recursive lookup in memory and delete everything at once
            var everything = await collection.find({}).toArray()
            var descendantids = descendants(everything,req.body._id)
            descendantids.push(req.body._id)
            var result = await collection.deleteMany({_id:{$in:descendantids}})
            res.send(result)
        })


        function descendants(everything,selfid){
            var children = everything.filter(e => e.parent == selfid)
            var childdescendants = children.flatMap(child => descendants(everything,child._id))
            return children.map(e => e._id).concat(childdescendants)

        }

        // async function recursiveDelete(entity){
        //     var children = await collection.find({parent:entity._id}).toArray()
        //     for(var child of children){
        //         await recursiveDelete(child)
        //     }
        //     return remove(entity)
        // }

        async function remove(entity){
            //update backrefs
            //find the metadata entity and it's attributes
            //find the attributes that are pointers
            //for each pointer field, find the entity it points too and remove the entity's id from the backrefs
            //also go trough the backrefs and for every entity that points towards this entity set that pointer to null
            // var metadata = await getObjDefWithPointerAttributes(entity._id)
            // for(var key in entity.backrefs){
            //     for(var pointer of entity.backrefs[key]){
            //         collection.updateOne({_id:pointer},{$set:{[key]:null}})
            //     }
            // }
            // for(var attribute of metadata.attributes){
            //     var pointer = entity[attribute.name]
            //     await collection.updateOne({_id: pointer},{$pull:{[`backrefs.${attribute.name}`]:entity._id}})
            // }
            

            return collection.deleteOne({_id:entity._id})
        }

        async function create(entity){
            //update backrefs
            //find the metadata entity and it's attributes
            // var metadata = await getObjDefWithPointerAttributes(entity._id)
            // for(var attribute of metadata.attributes){
            //     var dest = entity[attribute.name]
            //     await collection.updateOne({_id,dest},{$push:{[`backrefs.${attribute.name}`]:entity._id}})
            // }
            //for each pointer field, find the entity it points too and add the entity's id too the backrefs

        }

        async function getObjDefWithPointerAttributes(id){
            var objdef = await collection.findOne({_id:id})
            var attributes = await collection.find({parent:objdef._id,datatype:'pointer'}).toArray()
            var datatypes = await collection.find({type:'datatype'}).toArray()

            return {
                objdef,
                attributes,
                datatypes,
            }
        }

        app.get('/*', function(req, res, next) {
            res.sendFile(path.resolve('index.html'));
        });

    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!\n retryng in 5 sec', error);
        setTimeout(() => {
            start()
        }, 5000);
    }
}