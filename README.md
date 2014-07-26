InjectusJS
==========

Dependency Injection Library for JS

How does it works?

- Fist you should define your classes and interfaces. Remember that in javascript interfaces are simulated.

  *Define the interface*  
  **function IInterface(){}**  
  
  *Define the class and "implement" the interface*  
  **function MyClass(){}**  
  **MyClass.prototype=Object.create(IInterface.prototype);** *<-- Here we "implement"*
  
  
- Let's say  that our "MyClass" has two dependecies: ISingletonDependency and ITransientDependency
  
  *Define the ISingletonDependency*  
  **function ISingletonDependency(){}**  
    
  *Define the ITransientDependency*  
  **function ITransientDependency(){}**  
    
  *Implementation for ISingletonDependency*  
  **function SingletonDependency(){}**  
  **SingletonDependency.prototype=new ISingletonDependency();**  
    
  *Implementation for ITransientDependency*  
  **function TransientDependency(){}**  
  **TransientDependency.prototype=new ITransientDependency();**  
    
  *now let's  tell our MyClass that will have two new dependencies:*  
  **MyClass.Dependencies=new Array("ISingletonDependency", "ITransientDependency");**
  
    
- Now we've got our Objects defined. All objects have their own interface. Let's register them:

  *We create a component for an interface and assign an implementation and a life time*  
  **Injectus.Register(Component.From(ISingletonDependency).ImplementedBy(SingletonDependency).WithLifestyle(LifeStyleType.Singleton));**  
  **Injectus.Register(Component.From(ITransientDependency).ImplementedBy(TransientDependency).WithLifestyle(LifeStyleType.Transient));**  
  **Injectus.Register(Component.From(IInterface).ImplementedBy(MyClass).WithLifestyle(LifeStyleType.Transient));**
  

- Once registered we are ready to use our objects!!
  
  *In order to resolve we'll just need to call Resolve method with the desired "interface"*  
  **var myClass=Injectus.Resolve(IInterface);**  

- There's a working example in /test/src and /test/spec
  
- We can also define our max dependencies limit. By default is set to 5 dependencies but you can increase it by calling:  

  **Injectus.SetMaxDependenciesNumber(newMaxLimit)**  
  *It will only update the limit if is higher than current in order to preserver compatibility with previously registered components*
  
- By performing a call to *Injectus.GetMetrics().PrintLog()* it will print into the debugging console of the browser (if exists) a list of registered components and how many times they've been resolved.
  
- For more details. Please have a look to the InjectusJSTest inside /test/lib. There you'll have a nice Jasmine test which will help you to understand how it works

