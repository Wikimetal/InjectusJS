InjectusJS
==========

Dependency Injection Library for JS

How it works?

- Fist you should define your clases and interfaces. Remember that in javascript interfaces are simulated.

  *Define the interface*
  **function IInterface(){}**
  **IInterface.Name="IInterface";**
  
  *Define the class and "extend" the interface*
  **function MyClass(){}**
  **MyClass.Name="MyClass";**
  **MyClass.prototype=new IInterface();** *<-- Here we "extend"*
  
  
- Let's say  that our "MyClass" has two dependecies: ISingletonDependency and ITransientDependency
  
  *Define the ISingletonDependency*
  **function ISingletonDependency(){}**
  **ISingletonDependency.Name="ISingletonDependency";**
  
  *Define the ITransientDependency*
  **function ITransientDependency(){}**
  **ITransientDependency.Name="ITransientDependency";**
  
  *Implementation for ISingletonDependency*
  **function SingletonDependency(){}**
  **SingletonDependency.Name="SingletonDependency";**
  **SingletonDependency.prototype=new ISingletonDependency();**
  
  *Implementation for ITransientDependency*
  **function TransientDependency(){}**
  **TransientDependency.Name="TransientDependency";**
  **TransientDependency.prototype=new ITransientDependency();**
  
  *now let's  tell our MyClass that will have two new dependencies:*
  **MyClass.Dependencies=new Array("ISingletonDependency", "ITransientDependency");**
  
  
- Now we've got our Objects defined. All objects have their own interface. Let's register them:

  *Let's keep Injectus as a singleton*
  **var injectus=Injectus.GetInstance();**
  
  *We create a component for an interface and assign an implementation and a life time*
  **injectus.Register(Component.From(ISingletonDependency).ImplementedBy(SingletonDependency).WithLifestyle(LifeStyleType.Singleton));**
  **injectus.Register(Component.From(ITransientDependency).ImplementedBy(TransientDependency).WithLifestyle(LifeStyleType.Transient));**
  **injectus.Register(Component.From(IInterface).ImplementedBy(MyClass).WithLifestyle(LifeStyleType.Transient));**
  

- Once registered we are ready to use our objects!!
  
  *In order to resolve we'll just need to call Resolve method with the desired "interface"*
  **var myClass=Injectus.GetInstance().Resolve(IInterface);**
  
  
- For more details. Please have a look to the InjectusJSTest inside /test/lib. There you'll have a nice Jasmine test which will help you to understand how it works