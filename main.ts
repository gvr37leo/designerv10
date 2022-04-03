/// <reference path="src/entity.ts" />
/// <reference path="src/store.ts" />
/// <reference path="src/designer.ts" />
/// <reference path="src/model.ts" />
/// <reference path="src/router.ts" />
/// <reference path="src/views/detailview.ts" />
/// <reference path="src/views/listview.ts" />
/// <reference path="src/views/treeview.ts" />
/// <reference path="src/query.ts" />
/// <reference path="src/selfdef.ts" />
/// <reference path="src/widgets/boolean.ts" />
/// <reference path="src/widgets/datetime.ts" />
/// <reference path="src/widgets/id.ts" />
/// <reference path="src/widgets/number.ts" />
/// <reference path="src/widgets/pointer.ts" />
/// <reference path="src/widgets/text.ts" />
/// <reference path="src/ajax.ts" />
/// <reference path="src/utils.ts" />


declare var ejs:{compile:(template:string) => (data:any) => string}
// document.body.innerHTML =
var globalstore = new Store()
var designer = new Designer()
designer.init()
designer.render()
var root = document.querySelector('#root')
root.appendChild(designer.html)

//maybe 1 big frontend that just shows all the types
//tree view can visually divide it into 2 appdefs
// so treeview will have 3 roots
//1 selfdef 1 appdef and probaly a root data entity

// updateHTML()

//exporting from this





