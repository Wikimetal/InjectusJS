function IInterfaceName() { }

function ClassName(singletonDependecy, transientDependecy) {
    this.singletonDependecy = singletonDependecy;
    this.transientDependecy = transientDependecy;
}
ClassName.prototype = new IInterfaceName();
ClassName.Dependencies = new Array("ISingletonDependency", "ITransientDependency");

function ISingletonDependency() { }

function SingletonDependency() { }
SingletonDependency.prototype = new ISingletonDependency();

function ITransientDependency() { }

function TransientDependency() { }
TransientDependency.prototype = new ITransientDependency();

function IInvalidInterface() { }

describe("InjectusJS", function () {
    function SetUpComponents() {
        Injectus.Register(Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient));
        Injectus.Register(Component.From(ISingletonDependency).ImplementedBy(SingletonDependency).WithLifestyle(LifeStyleType.Singleton));
        Injectus.Register(Component.From(ITransientDependency).ImplementedBy(TransientDependency).WithLifestyle(LifeStyleType.Transient));
    }

    beforeEach(function () {
        Injectus.instance = null;
    });

    describe("static getInstance: ", function () {
        it("should return a valid instance when no instance is created", function () {
            expect(Injectus.instance).toBeFalsy();
            var instance = Injectus.getInstance();
            expect(Injectus.instance).toBeTruthy();
        });
        it("should return the same instance when an instance is created", function () {
            var instance = Injectus.getInstance();
            expect(Injectus.instance).toEqual(Injectus.getInstance());
        });
    });
    
    describe("static SetMaxDependenciesNumber: ", function () {
        it("should update dependency max number when is higher than actual", function () {
            var currentMaxNumberOfDependencies=5;
            var newMaxNumberOfDependencies=6;
            Injectus.MaxAllowedDependecies = currentMaxNumberOfDependencies;
            Injectus.SetMaxDependenciesNumber(newMaxNumberOfDependencies);
            expect(Injectus.MaxAllowedDependecies).toEqual(newMaxNumberOfDependencies);
            Injectus.MaxAllowedDependecies = currentMaxNumberOfDependencies;
        });
        it("shouldn't update dependency max number when is lower than actual", function () {
            var currentMaxNumberOfDependencies=5;
            var newMaxNumberOfDependencies=3;
            Injectus.MaxAllowedDependecies = currentMaxNumberOfDependencies;
            Injectus.SetMaxDependenciesNumber(newMaxNumberOfDependencies);
            expect(Injectus.MaxAllowedDependecies).toEqual(currentMaxNumberOfDependencies);
            Injectus.MaxAllowedDependecies = currentMaxNumberOfDependencies;
        });
    });

    describe("static Register: ", function () {
        it("should throw an exception when the component is already registered", function () {
            var component = Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient);
            Injectus.Register(component);
            expect(function () { Injectus.Register(component); })
            .toThrow("Component " + InjectusName(IInterfaceName) + " already registered");
        });
        it("should add the component to register to the private components array", function () {
            var component = Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient);
            Injectus.Register(component);
            expect(Injectus.getInstance().Components[InjectusName(IInterfaceName)]).toEqual(component);
        });
        it("should throw an error when component has more than " + Injectus.MaxAllowedDependecies + " dependencies", function () {
            function IMaxDependencies() { };
            function MaxDependencies() { };
            MaxDependencies.prototype = new IMaxDependencies();
            MaxDependencies.Dependencies = new Array("ISingletonDependency", "ITransientDependency", "ISingletonDependency", "ITransientDependency", "ISingletonDependency", "ITransientDependency");
            var component = Component.From(IMaxDependencies).ImplementedBy(MaxDependencies).WithLifestyle(LifeStyleType.Transient);
            expect(function () { Injectus.Register(component); })
            .toThrow("Injectus: Object " + InjectusName(component.Implementation) + " has too much dependencies");
        });
    });
    describe("static Resolve:", function () {
        it("should throw an error when trying to resolve a null component", function () {
            expect(function () { Injectus.Resolve(null) })
            .toThrow("Invalid component to resolve");
        });
        it("should throw an error when trying to resolve a component with invalid Name", function () {
            expect(function () { Injectus.Resolve(function(){}) })
            .toThrow("Invalid component to resolve");
        });
        it("should throw an error when trying to resolve a non registered component", function () {
            expect(function () { Injectus.Resolve(IInterfaceName) })
            .toThrow("No component registered for interface IInterfaceName");
        });
        it("should throw an error when trying to resolve a non registered dependecy", function () {
            Injectus.Register(Component.From(IInterfaceName).ImplementedBy(ClassName).WithLifestyle(LifeStyleType.Transient));
            expect(function () { Injectus.Resolve(IInterfaceName) })
            .toThrow("Trying to resolve a non Registered dependency: ISingletonDependency");
        });
        it("should resolve a registered component and it's dependencies", function () {
            SetUpComponents();
            expect(Injectus.Resolve(IInterfaceName)).not.toBe(null);
        });
        it("should resolve transient dependencies as different instances", function () {
            SetUpComponents();
            var instance1 = Injectus.Resolve(IInterfaceName);
            var instance2 = Injectus.Resolve(IInterfaceName);
            expect(instance1 === instance2).not.toBeTruthy();
        });
        it("should resolve singleton dependencies as same instance", function () {
            SetUpComponents();
            var instance1 = Injectus.Resolve(IInterfaceName).singletonDependecy;
            var instance2 = Injectus.Resolve(IInterfaceName).singletonDependecy;
            expect(instance1 === instance2).toBeTruthy();
        });
    });
    describe("static GetMetrics:", function () {
        it("should return statistics of registered components", function () {
            SetUpComponents();
            expect(Injectus.GetMetrics().TotalRegistered).toEqual(3);
        });
        it("should return statistics of first time resolved components", function () {
            SetUpComponents();
            Injectus.Resolve(IInterfaceName); //Resolves IInterfaceName, ITransientDependency, ISingletonDependency
            expect(Injectus.GetMetrics().TotalResolved).toEqual(3);
        });
        it("should return statistics of transient resolved components", function () {
            SetUpComponents();
            Injectus.Resolve(ITransientDependency); //Resolves ITransientDependency
            Injectus.Resolve(ITransientDependency); //Resolves ITransientDependency
            expect(Injectus.GetMetrics().TotalResolved).toEqual(2);
            expect(Injectus.GetMetrics().Resolved[InjectusName(ITransientDependency)].Total).toEqual(2);
        });
        it("should return statistics of singleton resolved components toEqual 1", function () {
            SetUpComponents();
            Injectus.Resolve(ISingletonDependency); //Resolves ISingletonDependency
            Injectus.Resolve(ISingletonDependency); //Already reolved dependency will not appear in metrics
            expect(Injectus.GetMetrics().TotalResolved).toEqual(1);
            expect(Injectus.GetMetrics().Resolved[InjectusName(ISingletonDependency)].Total).toEqual(1);
        });
        it("should return statistics of component with resolved dependencies", function () {
            SetUpComponents();
            Injectus.Resolve(IInterfaceName); //Resolves IInterfaceName, ISingletonDependency, ITransientDependency
            Injectus.Resolve(IInterfaceName); //Resolves IInterfaceName, ITransientDependency
            Injectus.Resolve(IInterfaceName); //Resolves IInterfaceName, ITransientDependency
            expect(Injectus.GetMetrics().TotalResolved).toEqual(7);
            expect(Injectus.GetMetrics().Resolved[InjectusName(IInterfaceName)].Total).toEqual(3);
            expect(Injectus.GetMetrics().Resolved[InjectusName(ISingletonDependency)].Total).toEqual(1);
            expect(Injectus.GetMetrics().Resolved[InjectusName(ITransientDependency)].Total).toEqual(3);
        });
    });
});