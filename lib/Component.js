/*{
    Class:"Component",
    Description:"Defines the component object",
}*/
function Component()
{
  this.Interface=null;
  this.Implementation=null;
  this.LifeStyleType=null;
};

/*{
  Method:"From",
  Type: "static",
  Description:"Creates an instance of the component for the specified interface",
  Params:{
    {Type:"function", Description:"The function that plays the Interface role"}
  }
}*/
Component.From=function(value){
  var component=new Component();
  component.Interface=value;
  return component;
};

/*{
  Method:"ImplementedBy",
  Type: "public",
  Description:"Sets the function that will implement the interface",
  Params:{
    {Type:"function", Description:"The function that plays the class to be resolved role"}}
  }
}*/
Component.prototype.ImplementedBy=function(value){
  this.Implementation=value;
  return this;
};

/*{
  Method:"WithLifestyle",
  Type: "public",
  Description:"Sets the life time cycle that this component will have",
  Params:{
    {Type:"LifeStyleType", Description:"The life style to be set to the component"}}
  }
}*/
Component.prototype.WithLifestyle=function(value){
  this.LifeStyleType=value;
  return this;
};