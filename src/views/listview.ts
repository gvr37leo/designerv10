

class ListView{
    html: HTMLElement;
    inputsearch: any;
    theadrow: any;
    tbody: any;
    metaAttributes: any;
    inputsort: any;

    //filter
    //searchbar
    //table
    
    //create
    //goto
    //delete

    render(){

        this.html = stringToHTML(`<div>
            <div style="margin-bottom:5px;">
                <input placeholder="filter" id="inputsearch"></input>
                <input placeholder="sort" id="inputsort"></input>
                <button id="btnsearch">search</button>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>`)

        this.inputsearch = qs(this.html,'#inputsearch')
        this.inputsort = qs(this.html,'#inputsort')
        this.theadrow = qs(this.html,'thead tr')
        this.tbody = qs(this.html,'tbody')

        this.inputsearch.addEventListener('keydown',(e) => {
            if(e.key == 'Enter'){
                this.query(parseJSON(this.inputsearch.value),parseJSON(this.inputsort))
            }
        })

        qs(this.html,'#btnsearch').addEventListener('click',async () => {
            this.query(parseJSON(this.inputsearch.value),parseJSON(this.inputsort.value))
        })

        return this.html
    }

    async query(filter,sort){
        this.inputsearch.value = JSON.stringify(filter)
        this.inputsort.value = JSON.stringify(sort)
        this.theadrow.innerHTML = ''
        this.tbody.innerHTML = ''
        
        var result = await query(filter,sort)
        for(var attribute of this.metaAttributes){
            this.theadrow.appendChild(stringToHTML(`<td>${attribute.name}</td>`))
        }
        if(result.length == 0){
            return
        }

        for(let entity of result){
            var row = this.tbody.appendChild(stringToHTML(`<tr></tr>`))
            for(let attribute of this.metaAttributes){
                let datatype = deref(attribute.datatype)
                if(datatype.name == 'id'){
                    let html = stringToHTML(`<td><a href="/entity/${entity[attribute.name]}">${entity[attribute.name]}</a></td>`)
                    qs(html,'a').addEventListener('click', e => {
                        e.preventDefault()
                        designer.router.navigateID(entity[attribute.name])
                    })
                    row.appendChild(html)
                }else if(datatype.name == 'pointer'){
                    let html = stringToHTML(`<td><a href="/entity/${entity[attribute.name]}">${deref(entity[attribute.name])?.name}</a></td>`)
                    qs(html,'a').addEventListener('click', e => {
                        e.preventDefault()
                        designer.router.navigateID(entity[attribute.name])
                    })
                    row.appendChild(html)
                }else if(datatype.name == 'datetime'){
                    row.appendChild(stringToHTML(`<td>${new Date(entity[attribute.name]).toLocaleString()}</td>`))
                }else{
                    row.appendChild(stringToHTML(`<td>${entity[attribute.name]}</td>`))
                }
            }
        }
    }
}

function parseJSON(text){
    var res = {}
    try {
        res = JSON.parse(text)
    } catch (error) {}
    return res
}