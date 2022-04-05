
class TreeView{

    html: HTMLElement
    childcontainer: HTMLElement
    treeitemsmap:Map<number,TreeItem> = new Map()
    selected:number

    constructor(){
    }
    
    render(){
        this.html = stringToHTML(`<div>
            <div id="childcontainer" style={{display:'flex',flexDirection:'column'}}>
                
            </div>
        </div>`)

        this.childcontainer = this.html.querySelector('#childcontainer')

        var roots = children(null)
        for(var root of roots){
            this.childcontainer.appendChild(this.treeitemsmap.get(root._id).render())
        }

        return this.html
    }

    load(){
        var roots = children(null)
        for(var root of roots){
            var treeitem = new TreeItem(root,this)
            treeitem.load()
        }
    }
}

class TreeItem{
    parent:TreeItem
    html: HTMLElement
    treeitemchildren: HTMLElement
    open = false
    children: Entity[] = []

    constructor(public entity:Entity, public treeview:TreeView){
        treeview.treeitemsmap.set(entity._id,this)
    }

    load(){
        var fchildren = children(this.entity._id)
        this.children = fchildren.sort((a,b) => a.sortorder - b.sortorder)

        for(var child of this.children){
            var treeitem = new TreeItem(child,this.treeview) 
            treeitem.parent = this
            treeitem.load()
        }
    }

    render(){
        // var children = designer.allentitys.filter(e => e.parent == this.entity._id)
        this.html = stringToHTML(`<div>
            <a href="/entity/${this.entity._id}">
                <div id="namecontainer" style="display:flex; padding:5px;">
                    <span id="openindicator" style="margin-right:3px; cursor:pointer;">v</span>
                    <span>${this.entity.name}</span>
                </div>
            </a>
            <div id="treeitemchildren" style="margin-left:20px;">
                
            </div>
        </div>`)
        this.treeitemchildren = this.html.querySelector('#treeitemchildren')
        
        for(var child of this.children){
            this.treeitemchildren.appendChild(this.treeview.treeitemsmap.get(child._id).render())
        }
        
        

        
        this.updateOpenIndicator()
        this.html.querySelector('#openindicator').addEventListener('click',(e:any) => {
            e.preventDefault();
            e.stopPropagation();
            this.setOpen(!this.open)
        })

        this.html.querySelector('a').addEventListener('click',(e) => {
            e.preventDefault()
            designer.router.navigateID(this.entity._id)
        })
        return this.html
    }

    setOpen(val){
        this.open = val
        this.updateOpenIndicator()
        if(val){
            this?.parent?.setOpen(val)
        }
    }

    updateOpenIndicator(){
        var openindicator = this.html.querySelector('#openindicator') as HTMLElement
        if(this.children.length == 0){
            openindicator.innerText = ''
        }else if(this.open){
            openindicator.innerText = 'v'
            this.treeitemchildren.style.display = 'block'
        }else{
            openindicator.innerText = '>'
            this.treeitemchildren.style.display = 'none'
        }
    }
}