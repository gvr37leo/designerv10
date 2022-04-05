
class Designer{
    router: Router;
    dtview: DetailView;
    html:HTMLElement
    allentitys: any[];
    treeviewcontainer: HTMLElement;
    dtviewcontainer: HTMLElement;
    treeview: TreeView;
    entitymap;
    entitymapbyname;
    groupbyparent;
    groupbytype;
    maincontainer: any;
    
    constructor(){
        this.router = new Router()
        this.dtview = new DetailView()
        this.treeview = new TreeView()
    }

    async init(){
        

        this.router.listen(/entity\/(?<id>.*)/, async (match:any) => {
            // var ent = globalstore.get(match.groups.id)
            var ent = await queryOne({_id:parseInt(match.groups.id)})
            await this.dtview.load(ent)
            upsertChild(this.dtviewcontainer,this.dtview.render())
            this.treeview.treeitemsmap.get(ent._id).setOpen(true)
            upsertChild(this.treeviewcontainer,this.treeview.render())
            var selecteditem = qs(this.treeview.treeitemsmap.get(ent._id).html,'#namecontainer')
            selecteditem.style.backgroundColor = 'yellow'
        })


        this.router.listen(/./, () => {
            var html = stringToHTML(`<div>
                <button id="btndelete">delete all</button>
                <button id="btnbootstrap">bootstrap mongo</button>
                frontpage
            </div>`)
            html.querySelector('#btndelete').addEventListener('click',async () => {
                await remove({})
                await designer.refresh()
            })
            html.querySelector('#btnbootstrap').addEventListener('click',async () => {
                this.bootstrapMongoDB()
            })
            upsertChild(this.dtviewcontainer,html)
            
        })

        this.router.locationListen()
        await this.refresh()
        
    }

    async refresh(){
        this.allentitys = await query({},{})
        this.entitymap = mapify(this.allentitys,e => e._id)
        this.entitymapbyname = mapify(this.allentitys,e => e.name)
        this.groupbyparent = groupby(this.allentitys,e => e.parent)
        this.groupbytype = groupby(this.allentitys,e => e.type)
        this.treeview.load()
        upsertChild(this.treeviewcontainer,this.treeview.render())
        this.router.trigger(window.location.pathname)
    }

    render(){
        this.html = stringToHTML(`<div>
            <div id="headercontainer"></div>
            <div id="maincontainer">
                <div style='display:flex'>
                    <div id="treeviewcontainer"></div>
                    <div id="dtviewcontainer" style="margin-left:10px;"></div>
                </div>
            </div>
            <div id="footer"></div>
        </div>`)
        this.maincontainer = this.html.querySelector('#maincontainer')
        this.treeviewcontainer = this.html.querySelector('#treeviewcontainer')
        this.dtviewcontainer = this.html.querySelector('#dtviewcontainer')
        // this.dtviewcontainer.appendChild(this.dtview.render())
        return this.html
    }

    async bootstrapMongoDB(){

        var entitys = generateSelfDef()
        var res = await createMany(entitys)
        await designer.refresh()
        
        //make a server call that checks if it's been initialized and if not does that
        //returns whether the upsert had to be done
    }
}

