function IInterfaceName(){}
IInterfaceName.Name="IInterfaceName";

function ClassName(singletonDependecy, transientDependecy){
  this.singletonDependecy=singletonDependecy;
  this.transientDependecy=transientDependecy;
}
ClassName.Name="ClassName";
ClassName.prototype=new IInterfaceName();
ClassName.Dependencies=new Array("ISingletonDependency", "ITransientDependency");

function ISingletonDependency(){}
ISingletonDependency.Name="ISingletonDependency";

function SingletonDependency(){}
SingletonDependency.Name="SingletonDependency";
SingletonDependency.prototype=new ISingletonDependency();

function ITransientDependency(){}
ITransientDependency.Name="ITransientDependency";

function TransientDependency(){}
TransientDependency.Name="TransientDependency";
TransientDependency.prototype=new ITransientDependency();


describe("InjectusJS", function () {
    function SetUpComponents(){
      var injectus=Injectus.GetInstance();
      injectus.Register(Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient));
      injectus.Register(Component.From(ISingletonDependency).ImplementedBy(SingletonDependency).WithLifestyle(LifeStyleType.Singleton));
      injectus.Register(Component.From(ITransientDependency).ImplementedBy(TransientDependency).WithLifestyle(LifeStyleType.Transient));
    }
    
    beforeEach(function () {
        Injectus.instance=null;
    });
    
    describe("static GetInstance: ",function(){
      it("should return a valid instance when no instance is created", function () {
        expect(Injectus.instance).toBeFalsy();
        var instance=Injectus.GetInstance();
        expect(Injectus.instance).toBeTruthy();
      });
      it("should return the same instance when an instance is created", function () {
        var instance=Injectus.GetInstance();
        expect(Injectus.instance).toEqual(Injectus.GetInstance());
      });
    });
    
    describe("public Register: ",function(){
      it("should add the component to register to the private components array",function(){
          var injectus=Injectus.GetInstance();
          var component=Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient);
          injectus.Register(component);
          expect(Injectus.GetInstance().components[IInterfaceName.Name]).toEqual(component);     
      });
    });
    describe("public Resolve:",function(){
      it("should throw an error when trying to resolve a non registered component",function(){
          expect(function(){Injectus.GetInstance().Resolve(IInterfaceName)}).toThrow("No component registered for interface IInterfaceName");
      });
      it("should throw an error when trying to resolve a non registered dependecy",function(){
          var injectus=Injectus.GetInstance();
          injectus.Register(Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient));
          expect(function(){Injectus.GetInstance().Resolve(IInterfaceName)}).toThrow("Trying to resolve a non Registered dependency: ISingletonDependency");
      });
      it("should resolve a registered component and it's dependencies",function(){
          SetUpComponents();
          expect(Injectus.GetInstance().Resolve(IInterfaceName)).not.toBe(null); 
      });
      it("should resolve transient dependencies as different instances",function(){
          SetUpComponents();
          var injectus=Injectus.GetInstance();
          var instance1=injectus.Resolve(IInterfaceName);
          var instance2=injectus.Resolve(IInterfaceName);
          expect(instance1===instance2).not.toBeTruthy();
      });
      it("should resolve singleton dependencies as same instance",function(){
          SetUpComponents();
          var injectus=Injectus.GetInstance();
          var instance1=injectus.Resolve(IInterfaceName).singletonDependecy;
          var instance2=injectus.Resolve(IInterfaceName).singletonDependecy;
          expect(instance1===instance2).toBeTruthy();
      });
    });
});