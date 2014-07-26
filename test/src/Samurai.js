function ISword(){};
ISword.prototype.Swing = function() {};

function IKatana(){};
IKatana.prototype = Object.create(ISword.prototype);

function Katana(){};
Katana.prototype = Object.create(IKatana.prototype);

Katana.prototype.Swing = function() {
	return "katana swing";
};

function IWakizashi(){};
IWakizashi.prototype = Object.create(ISword.prototype);

function Wakizashi(){};
Wakizashi.prototype = Object.create(IWakizashi.prototype);

Wakizashi.prototype.Swing = function() {
	return "wakizashi swing";
};

function ISamurai(){};
ISamurai.prototype.SwingSword = function() {};


function Samurai(katana, wakizashi){
	this.katana = katana;
	this.wakizashi = wakizashi;
};
Samurai.prototype = Object.create(ISamurai.prototype);
Samurai.prototype.SwingKatana = function() {
	this.katana.Swing();
};
Samurai.prototype.SwingWakizashi = function() {
	this.wakizashi.Swing();
};

// Injectus.Register(Component.From(ISword).ImplementedBy(Sword).WithLifestyle(LifeStyleType.Transient));
// Injectus.Register(Component.From(ISamurai).ImplementedBy(Samurai).WithLifestyle(LifeStyleType.Transient));


// Samurai.Dependencies = ["ISword"];

// var samurai = Injectus.Resolve(ISamurai);
// var sword = Injectus.Resolve(ISword);