describe("Example Samurai injection", function(){
	it("should register the dependencies", function(){
		Injectus.Register(Component.From(IWakizashi).ImplementedBy(Wakizashi).WithLifestyle(LifeStyleType.Transient));
		Injectus.Register(Component.From(IKatana).ImplementedBy(Katana).WithLifestyle(LifeStyleType.Transient));
		Injectus.Register(Component.From(ISamurai).ImplementedBy(Samurai).WithLifestyle(LifeStyleType.Transient));		
		
		Samurai.Dependencies = ["IKatana","IWakizashi"];
	});

	describe("Katana", function(){
		// expect(Sword.prototype).toMatch(ISword.prototype);

		it("should be the implementation", function(){
			var sut = Injectus.Resolve(IKatana);
			expect(sut.Swing()).toBe("katana swing");
		});

	});

	describe("Samurai", function () {

		it("his long sword (katana) should be resolved to the implementation sword", function  () {
			var sut = Injectus.Resolve(ISamurai);
			expect(sut.katana).toEqual(Injectus.Resolve(IKatana));
		});

		it("his short sword (wakizashi) should be the second implementation sword", function  () {
			var sut = Injectus.Resolve(ISamurai);
			expect(sut.wakizashi).toEqual(Injectus.Resolve(IWakizashi));
		});
		
	});
});