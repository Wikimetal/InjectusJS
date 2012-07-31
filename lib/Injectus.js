/*{
    Class:"Injectus",
    Description:"Acts as an IoC component",
}*/
function Injectus()
{
  this.components=new Array();
  this.singletonComponents=new Array();
  this.singletonInstances=new Array();
  this.metrics=new InjectusMetrics();
};
Injectus.MaxAllowedDependecies=5;
Injectus.instance=null;

/*{
  Method:"GetInstance",
  Type: "static",
  Description:"Creates a singleton instance. All Injectus instances must be created by calling this method"
}*/
Injectus.GetInstance=function()
{
  if(!Injectus.instance)
    Injectus.instance=new Injectus();
   return Injectus.instance;
};

/*{
  Method:"GetMetrics",
  Type: "public",
  Description:"Returns the metrics recorded by the component",
  Params:{
    {Type:"object", Description:"The metrics"}
  }
}*/
Injectus.prototype.GetMetrics = function () {
    return this.metrics;
};

/*{
  Method:"Register",
  Type: "public",
  Description:"Adds a component to the components array",
  Params:{
    {Type:"Component", Description:"The component instance to be added to the array"}
  }
}*/
Injectus.prototype.Register=function(value)
{
  if(this.components[value.Interface.Name])
    throw "Component "+value.Interface.Name+" already registered";
  this.components[value.Interface.Name]=value;
  this.metrics.Register(value);
  if(value.Implementation.Dependencies&& value.Implementation.Dependencies.length>=Injectus.MaxAllowedDependecies && window.console && console.warn)
  {
    throw "Injectus: Object "+ value.Implementation.Name +" has too much dependencies";
  }
};

/*{
  Method:"Resolve",
  Type: "public",
  Description:"Resolves the component for the specified interface",
  Params:{
    {Type:"function", Description:"The function that plays the Interface role"}
  }
}*/
Injectus.prototype.Resolve=function(value)
{
  var self=this;
  if(!self.components[value.Name])
    throw "No component registered for interface "+ value.Name;
  if(self.singletonInstances[value.Name])
    return self.singletonInstances[value.Name];
  this.metrics.Resolve(self.components[value.Name]);
  var resolveString="new "+self.components[value.Name].Implementation.Name+"(";
  var resolved=eval(self.components[value.Name].Implementation.Name);
  var thereAreDependencies=false;
  if(resolved.Dependencies)
    resolved.Dependencies.ForEach(function(x){
      thereAreDependencies=true;
      if(!self.components[x])
        throw "Trying to resolve a non Registered dependency: "+x;
       resolveString+="Injectus.GetInstance().Resolve({Name:'"+x+"'}),";
    });
  if(thereAreDependencies)
    resolveString=resolveString.slice(0,-1);
  resolveString+=")";
  if(self.components[value.Name].LifeStyleType==LifeStyleType.Singleton)
  {
    self.singletonInstances[value.Name]=eval(resolveString);
    return self.singletonInstances[value.Name];
  }
  return eval(resolveString);
};