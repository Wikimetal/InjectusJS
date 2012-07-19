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