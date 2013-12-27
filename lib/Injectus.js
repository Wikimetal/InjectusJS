/*{
    Class:"Injectus",
    Description:"Acts as an IoC component",
}*/
function Injectus()
{
  this.components=new Array();
  this.singletonInstances=new Array();
  this.metrics=new InjectusMetrics();
};
Injectus.prototype = Object.create(IInjectus.prototype);

Injectus.MaxAllowedDependecies=5;
Injectus.instance = null;

Injectus.prototype.GetMetrics = function () {
    return this.metrics;
};

Injectus.prototype.Register = function (value) {
    if (!value || !value.Interface || !InjectusName(value.Interface) || !InjectusName(value.Implementation))
        throw "Invalid component to register. Reason: null component or Interface property not initialized";
    var interfaceName = InjectusName(value.Interface);
    if (this.components[interfaceName])
        throw "Component " + interfaceName + " already registered";
    this.components[interfaceName] = value;
    this.metrics.Register(value);
    if (value.Implementation.Dependencies && value.Implementation.Dependencies.length > Injectus.MaxAllowedDependecies) {
        throw "Injectus: Object " + InjectusName(value.Implementation) + " has too much dependencies";
    }
};

Injectus.prototype.Resolve = function (value) {
    var self = this;
    if (!value || !InjectusName(value))
        throw "Invalid component to resolve";
    var valueName = InjectusName(value);
    if (!this.components[valueName])
        throw "No component registered for interface " + valueName;
    if (this.singletonInstances[valueName])
        return this.singletonInstances[valueName];
    this.metrics.Resolve(this.components[valueName]);
    var implementationName = InjectusName(this.components[valueName].Implementation);
    var resolveString = "new " + implementationName + "(";
    var resolved = eval(implementationName);
    var areTthereDependencies = false;
    if (resolved.Dependencies)
        InjectusForEach(resolved.Dependencies, function(x) {
            areTthereDependencies = true;
            if (!self.components[x])
                throw "Trying to resolve a non Registered dependency: " + x;
            resolveString += "Injectus.Resolve(" + x + "),";
        });
    if (areTthereDependencies)
        resolveString = resolveString.slice(0, -1);
    resolveString += ")";
    if (this.components[valueName].LifeStyleType == LifeStyleType.Singleton) {
        this.singletonInstances[valueName] = eval(resolveString);
        return this.singletonInstances[valueName];
    }
    return eval(resolveString);
};

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
    return Injectus.getInstance().GetMetrics();
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
    Injectus.getInstance().Register(value);
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
    return Injectus.getInstance().Resolve(value);
};