/*{
    Class:"LifeStyleType",
    Description:"The list of the life style types",
}*/
function LifeStyleType(){};

/*{
  Property:"Singleton",
  Type: "public",
  Description:"Defines a life time cycle unique for the hole applications life"
}*/
LifeStyleType.Singleton="singleton";

/*{
  Property:"Transient",
  Type: "public",
  Description:"Defines a life time cycle that will end once the object is disposed (=null)"
}*/
LifeStyleType.Transient="transient";