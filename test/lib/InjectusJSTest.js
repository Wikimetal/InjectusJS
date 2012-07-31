function IInterfaceName() { }
IInterfaceName.Name = "IInterfaceName";

function ClassName(singletonDependecy, transientDependecy) {
    this.singletonDependecy = singletonDependecy;
    this.transientDependecy = transientDependecy;
}
ClassName.Name = "ClassName";
ClassName.prototype = new IInterfaceName();
ClassName.Dependencies = new Array("ISingletonDependency", "ITransientDependency");

function ISingletonDependency() { }
ISingletonDependency.Name = "ISingletonDependency";

function SingletonDependency() { }
SingletonDependency.Name = "SingletonDependency";
SingletonDependency.prototype = new ISingletonDependency();

function ITransientDependency() { }
ITransientDependency.Name = "ITransientDependency";

function TransientDependency() { }
TransientDependency.Name = "TransientDependency";
TransientDependency.prototype = new ITransientDependency();


describe("InjectusJS", function () {
    function SetUpComponents() {
        var injectus = Injectus.GetInstance();
        injectus.Register(Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient));
        injectus.Register(Component.From(ISingletonDependency).ImplementedBy(SingletonDependency).WithLifestyle(LifeStyleType.Singleton));
        injectus.Register(Component.From(ITransientDependency).ImplementedBy(TransientDependency).WithLifestyle(LifeStyleType.Transient));
    }

    beforeEach(function () {
        Injectus.instance = null;
    });

    describe("static GetInstance: ", function () {
        it("should return a valid instance when no instance is created", function () {
            expect(Injectus.instance).toBeFalsy();
            var instance = Injectus.GetInstance();
            expect(Injectus.instance).toBeTruthy();
        });
        it("should return the same instance when an instance is created", function () {
            var instance = Injectus.GetInstance();
            expect(Injectus.instance).toEqual(Injectus.GetInstance());
        });
    });

    describe("public Register: ", function () {
        it("should throw an exception when the component is already registered", function () {
            var injectus = Injectus.GetInstance();
            var component = Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient);
            injectus.Register(component);
            expect(function () { injectus.Register(component); })
            .toThrow("Component " + IInterfaceName.Name + " already registered");
        });
        it("should add the component to register to the private components array", function () {
            var injectus = Injectus.GetInstance();
            var component = Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient);
            injectus.Register(component);
            expect(Injectus.GetInstance().components[IInterfaceName.Name]).toEqual(component);
        });
        it("should throw an error when component has more than " + Injectus.MaxAllowedDependecies + " dependencies", function () {
            function IMaxDependencies() { };
            IMaxDependencies.Name = "IMaxDependencies";
            function MaxDependencies() { };
            MaxDependencies.Name = "MaxDependencies";
            MaxDependencies.prototype = new IMaxDependencies();
            MaxDependencies.Dependencies = new Array("ISingletonDependency", "ITransientDependency", "ISingletonDependency", "ITransientDependency", "ISingletonDependency", "ITransientDependency");
            var injectus = Injectus.GetInstance();
            var component = Component.From(IMaxDependencies).ImplementedBy(MaxDependencies).WithLifestyle(LifeStyleType.Transient);
            expect(function () { injectus.Register(component); })
            .toThrow("Injectus: Object " + component.Implementation.Name + " has too much dependencies");
        });
    });
    describe("public Resolve:", function () {
        it("should throw an error when trying to resolve a non registered component", function () {
            expect(function () { Injectus.GetInstance().Resolve(IInterfaceName) })
            .toThrow("No component registered for interface IInterfaceName");
        });
        it("should throw an error when trying to resolve a non registered dependecy", function () {
            var injectus = Injectus.GetInstance();
            injectus.Register(Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient));
            expect(function () { Injectus.GetInstance().Resolve(IInterfaceName) })
            .toThrow("Trying to resolve a non Registered dependency: ISingletonDependency");
        });
        it("should resolve a registered component and it's dependencies", function () {
            SetUpComponents();
            expect(Injectus.GetInstance().Resolve(IInterfaceName)).not.toBe(null);
        });
        it("should resolve transient dependencies as different instances", function () {
            SetUpComponents();
            var injectus = Injectus.GetInstance();
            var instance1 = injectus.Resolve(IInterfaceName);
            var instance2 = injectus.Resolve(IInterfaceName);
            expect(instance1 === instance2).not.toBeTruthy();
        });
        it("should resolve singleton dependencies as same instance", function () {
            SetUpComponents();
            var injectus = Injectus.GetInstance();
            var instance1 = injectus.Resolve(IInterfaceName).singletonDependecy;
            var instance2 = injectus.Resolve(IInterfaceName).singletonDependecy;
            expect(instance1 === instance2).toBeTruthy();
        });
    });
    describe("public GetMetrics:", function () {
        it("should return statistics of registered components", function () {
            SetUpComponents();
            expect(Injectus.GetInstance().GetMetrics().TotalRegistered).toEqual(3);
        });
        it("should return statistics of first time resolved components", function () {
            SetUpComponents();
            Injectus.GetInstance().Resolve(IInterfaceName); //Resolves IInterfaceName, ITransientDependency, ISingletonDependency
            expect(Injectus.GetInstance().GetMetrics().TotalResolved).toEqual(3);
        });
        it("should return statistics of transient resolved components", function () {
            SetUpComponents();
            var injectus = Injectus.GetInstance();
            injectus.Resolve(ITransientDependency); //Resolves ITransientDependency
            injectus.Resolve(ITransientDependency); //Resolves ITransientDependency
            expect(Injectus.GetInstance().GetMetrics().TotalResolved).toEqual(2);
            expect(Injectus.GetInstance().GetMetrics().Resolved[ITransientDependency.Name].Total).toEqual(2);
        });
        it("should return statistics of singleton resolved components toEqual 1", function () {
            SetUpComponents();
            var injectus = Injectus.GetInstance();
            injectus.Resolve(ISingletonDependency); //Resolves ISingletonDependency
            injectus.Resolve(ISingletonDependency); //Already reolved dependency will not appear in metrics
            expect(Injectus.GetInstance().GetMetrics().TotalResolved).toEqual(1);
            expect(Injectus.GetInstance().GetMetrics().Resolved[ISingletonDependency.Name].Total).toEqual(1);
        });
        it("should return statistics of component with resolved dependencies", function () {
            SetUpComponents();
            var injectus = Injectus.GetInstance();
            injectus.Resolve(IInterfaceName); //Resolves IInterfaceName, ISingletonDependency, ITransientDependency
            injectus.Resolve(IInterfaceName); //Resolves IInterfaceName, ITransientDependency
            injectus.Resolve(IInterfaceName); //Resolves IInterfaceName, ITransientDependency
            expect(Injectus.GetInstance().GetMetrics().TotalResolved).toEqual(7);
            expect(Injectus.GetInstance().GetMetrics().Resolved[IInterfaceName.Name].Total).toEqual(3);
            expect(Injectus.GetInstance().GetMetrics().Resolved[ISingletonDependency.Name].Total).toEqual(1);
            expect(Injectus.GetInstance().GetMetrics().Resolved[ITransientDependency.Name].Total).toEqual(3);
        });
    });
});