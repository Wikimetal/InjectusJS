/*{
  Method:"ForEach",
  Type: "public",
  Description:"Adds this method to the native Array object",
  Params:{
    {Type:"delegate",Description:"The function to be called for each element found in the array"}
  }
}*/
Array.prototype.ForEach = function (fpointer) {
    var arr = new Array();
    var stop = false;
    for (element in this) {
        if (!arr[element])
            stop = fpointer(this[element]);
        if (stop)
            break;
    }
};

/*{
  Method:"Name",
  Type: "public",
  Description:"Adds this method to the native Function"
}*/
Function.prototype.Name=function()
{
  var name=this.name;
  if(name)
    return name;
  var matches=this.toString().match(/^function ([^(]+)/);
  return (matches && matches.length>=2)?matches[1]:null;
};