/*{
    Class:"InjectusMetrics",
    Description:"Recolects the metrics of the Injectus component",
}*/
function InjectusMetrics()
{
  this.Registered=new Array();
  this.TotalRegistered=0;
  this.Resolved=new Array();
  this.TotalResolved=0;
}

/*{
  Method:"Register",
  Type: "public",
  Description:"Adds a new registered component",
  Params:{
    {Type:"Component", Description:"The registered component"}
  }
}*/
InjectusMetrics.prototype.Register = function (component) {
    if (this.Registered[component.Interface.Name])
        return;
    this.TotalRegistered++;
    this.Registered[this.Registered.length] = component;
};

/*{
  Method:"Resolve",
  Type: "public",
  Description:"Adds a new resolved component",
  Params:{
    {Type:"Component", Description:"The resolved component"}
  }
}*/
InjectusMetrics.prototype.Resolve = function (component) {
    this.TotalResolved++;
    if (!this.Resolved[component.Interface.Name])
        this.Resolved[component.Interface.Name] = { Interface: component.Interface.Name,Total:0 };
    this.Resolved[component.Interface.Name].Total++;
};

InjectusMetrics.prototype.PrintLog = function () {
    if (window.console && console.log) {
        console.log("------------------------------------------------------------------------------------------------");
        console.log("|                                      INJECTUS REPORT                                         |");
        console.log("------------------------------------------------------------------------------------------------");
        console.log(" -> Registered components: " + this.TotalRegistered);
        this.Registered.ForEach(function (x) { console.log("      -Interface: " + x.Interface.Name + " implemented by " + x.Implementation.Name) })
        console.log(" -> Resolved components:" + this.TotalResolved);
        this.Resolved.ForEach(function (x) { console.log("      -Interface: " + x.Interface + " resolved " + x.Total) })
        console.log("------------------------------------------------------------------------------------------------");
        console.log(" ");
    }
};