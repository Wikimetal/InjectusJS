/*{
    Class:"Injectus",
    Description:"Acts as an IoC component",
}*/
function Injectus()
{
  this.Components=new Array();
  this.SingletonComponents=new Array();
  this.SingletonInstances=new Array();
  this.Metrics=new InjectusMetrics();
};
Injectus.MaxAllowedDependecies=5;
Injectus.instance=null;

/*{
  Method:"getInstance",
  Type: "static",
  Description:"Creates a singleton instance. All Injectus instances must be created by calling this method"
}*/
Injectus.getInstance=function()
{
  if(!Injectus.instance)
    Injectus.instance=new Injectus();
   return Injectus.instance;
};

/*{
  Method:"SetMaxDependenciesNumber",
  Type: "static",
  Description:"Sets the maximum number of dependencies allowed, only increase the number is allowed (to keep compatibility)",
  Params:{
    {Type:"integer", Description:"The maximum number of dependencies allowed"}
  }
}*/
Injectus.SetMaxDependenciesNumber = function(maxDependencies)
{
  if (maxDependencies > Injectus.MaxAllowedDependecies)
    Injectus.MaxAllowedDependecies=maxDependencies;
};

/*{
  Method:"GetMetrics",
  Type: "static",
  Description:"Returns the metrics recorded by the component"
}*/
Injectus.GetMetrics = function () {
    return Injectus.getInstance().Metrics;
};

/*{
  Method:"Register",
  Type: "static",
  Description:"Adds a component to the components array",
  Params:{
    {Type:"Component", Description:"The component instance to be added to the array"}
  }
}*/
Injectus.Register=function(value)
{
  if(!value || !value.Interface || !InjectusName(value.Interface) || !InjectusName(value.Implementation))
    throw "Invalid component to register. Reason: null component or Interface property not initialized";
  var interfaceName=InjectusName(value.Interface);
  var injectus=Injectus.getInstance();
  if(injectus.Components[interfaceName])
    throw "Component "+interfaceName+" already registered";
  injectus.Components[interfaceName]=value;
  injectus.Metrics.Register(value);
  if(value.Implementation.Dependencies && value.Implementation.Dependencies.length > Injectus.MaxAllowedDependecies)
  {
    throw "Injectus: Object "+ InjectusName(value.Implementation) +" has too much dependencies";
  }
};

/*{
  Method:"Resolve",
  Type: "static",
  Description:"Resolves the component for the specified interface",
  Params:{
    {Type:"function", Description:"The function that plays the Interface role"}
  }
}*/
Injectus.Resolve=function(value)
{
  if(!value || !InjectusName(value))
    throw "Invalid component to resolve";
  var valueName=InjectusName(value);
  var injectus=Injectus.getInstance();
  if(!injectus.Components[valueName])
    throw "No component registered for interface "+ valueName;
  if(injectus.SingletonInstances[valueName])
    return injectus.SingletonInstances[valueName];
  injectus.Metrics.Resolve(injectus.Components[valueName]);
  var implementationName=InjectusName(injectus.Components[valueName].Implementation);
  var resolveString="new "+implementationName+"(";
  var resolved=eval(implementationName);
  var thereAreDependencies=false;
  if(resolved.Dependencies)
    InjectusForEach(resolved.Dependencies,function(x){
      thereAreDependencies=true;
      if(!injectus.Components[x])
        throw "Trying to resolve a non Registered dependency: "+x;
       resolveString+="Injectus.Resolve("+x+"),";
    });
  if(thereAreDependencies)
    resolveString=resolveString.slice(0,-1);
  resolveString+=")";
  if(injectus.Components[valueName].LifeStyleType==LifeStyleType.Singleton)
  {
    injectus.SingletonInstances[valueName]=eval(resolveString);
    return injectus.SingletonInstances[valueName];
  }
  return eval(resolveString);
};