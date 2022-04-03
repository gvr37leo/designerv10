

class ListView{
    html: HTMLElement;
    input: any;
    theadrow: any;
    tbody: any;

    //filter
    //searchbar
    //table
    
    //create
    //goto
    //delete

    render(){

        this.html = stringToHTML(`<div>
            <div>
                <input id="inputsearch"></input>
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

        this.input = qs(this.html,'#inputsearch')
        this.theadrow = qs(this.html,'thead tr')
        this.tbody = qs(this.html,'tbody')

        this.input.addEventListener('keydown',(e) => {
            if(e.key == 'Enter'){
                this.query(JSON.parse(this.input.value))
            }
        })

        qs(this.html,'#btnsearch').addEventListener('click',async () => {
            this.query(JSON.parse(this.input.value))
        })

        return this.html
    }

    async query(queryobject){
        this.input.value = JSON.stringify(queryobject)
        var result = await query(queryobject)
        if(result.length == 0){
            return
        }
        var keys = Object.keys(result[0])
        this.theadrow.innerHTML = ''
        for(var key of keys){
            this.theadrow.appendChild(stringToHTML(`<td>${key}</td>`))
        }

        this.tbody.innerHTML = ''
        for(var entity of result){
            var row = this.tbody.appendChild(stringToHTML(`<tr></tr>`))
            for(var key of keys){
                row.appendChild(stringToHTML(`<td>${entity[key]}</td>`))
            }
        }
    }


}