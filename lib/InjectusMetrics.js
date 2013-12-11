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
    if (this.Registered[InjectusName(component.Interface)])
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
    var interfaceName=InjectusName(component.Interface);
    if (!this.Resolved[interfaceName])
        this.Resolved[interfaceName] = { Interface: interfaceName,Total:0 };
    this.Resolved[interfaceName].Total++;
};

InjectusMetrics.prototype.PrintLog = function () {
    if (window.console && console.log) {
        console.log("------------------------------------------------------------------------------------------------");
        console.log("|                                      INJECTUS REPORT                                         |");
        console.log("------------------------------------------------------------------------------------------------");
        console.log(" -> Registered components: " + this.TotalRegistered);
        InjectusForEach(this.Registered,function (x) { console.log("      -Interface: " + InjectusName(x.Interface) + " implemented by " + InjectusName(x.Implementation)) });
        console.log(" -> Resolved components:" + this.TotalResolved);
        InjectusForEach(this.Resolved,function (x) { console.log("      -Interface: " + x.Interface + " resolved " + x.Total) });
        console.log("------------------------------------------------------------------------------------------------");
        console.log(" ");
    }
};