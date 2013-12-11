function InjectusForEach(currentObj,fpointer) {
    var arr = new Array();
    var stop = false;
    for (element in currentObj) {
        if (!arr[element])
            stop = fpointer(currentObj[element]);
        if (stop)
            break;
    }
}

function InjectusName(currentObj)
{
  var name=currentObj.name;
  if(name)
    return name;
  var matches=currentObj.toString().match(/^function ([^(]+)/);
  return (matches && matches.length>=2)?matches[1]:null;
}

/* for IE7 and IE8 */

if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o
            return new F()
        }
    })()
}