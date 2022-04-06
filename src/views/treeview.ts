
class TreeView{

    html: HTMLElement
    childcontainer: HTMLElement
    treeitemsmap:Map<number,TreeItem> = new Map()
    selected:number

    constructor(){
    }
    
    render(){
        this.html = cr('div')
            this.childcontainer = crend('div',{style:'display:flex,flex-direction:column;'})
        end();

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
    openindicator: HTMLElement
    namecontainer: HTMLElement

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
        this.html = cr('div')
            cr('a',{href:`/entity/${this.entity._id}`})
                this.namecontainer = cr('div',{style:'display:flex; padding:5px;'})
                    this.openindicator = cr('span',{style:'margin-right:3px; cursor:pointer;'});text('v');end();
                    cr('span');text(this.entity.name);end()
                end();
            end();
            this.treeitemchildren = crend('div',{style:'margin-left:20px;'})
        end();
        
        for(var child of this.children){
            this.treeitemchildren.appendChild(this.treeview.treeitemsmap.get(child._id).render())
        }
        
        this.updateOpenIndicator()
        this.openindicator.addEventListener('click',(e:any) => {
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
        var openindicator = this.openindicator
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