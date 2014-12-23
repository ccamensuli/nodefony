/*
 *	The MIT License (MIT)
 *	
 *	Copyright (c) 2013/2014 cci | christophe.camensuli@nodefony.com
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the 'Software'), to deal
 *	in the Software without restriction, including without limitation the rights
 *	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *	copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *	THE SOFTWARE.
 */

nodefony.registerBundle ("monitoring", function(){

	/**
	 *	The class is a **`monitoring` BUNDLE** .
	 *	@module NODEFONY
	 *	@main NODEFONY
	 *	@class monitoring
	 *	@constructor
	 *	@param {class} kernel
	 *	@param {class} container
	 *	
	 */
	var monitoring = function(kernel, container){

		// load bundle library 
		//this.autoLoader.loadDirectory(this.path+"/core");

		this.mother = this.$super;
		this.mother.constructor(kernel, container);

		/*
		 *	If you want kernel wait monitoringBundle event <<onReady>> 
		 *
		 *      this.waitBundleReady = true ; 
		 */	
		
		this.kernel.listen(this, "onBoot", function(){
			if ( this.container.getParameters("bundles."+this.name).debugBar) {
				this.logger("ADD DEBUG BAR MONITORING", "WARNING")
				this.kernel.listen(this, "onRequest",function(context){
					if ( context.resolver.resolve ){
						var obj = {
							bundle:context.resolver.bundle.name,
							route:{
								name:context.resolver.route.name,
								uri:context.resolver.route.path
							}
						};
						if ( context.resolver.route.defaults ) {
							var tab = context.resolver.route.defaults.controller.split(":") ;
							obj["controllerName"] = ( tab[1] ? tab[1] : "default" ) ;
							obj["action"] = tab[2] ;

						}
						//console.log(obj);

						context.listen(this, "onView", function(result, context){
							if( !  context.request.isAjax() ){
								var View = this.container.get("httpKernel").getView("monitoringBundle::footerMonitoring.html.twig");
								this.get("templating").renderFile(View, {
									route:context.resolver.route,
									variablesRoute:context.resolver.variables,
									kernelSettings:this.kernel.settings,
									environment:this.kernel.environment,
									appSettings:this.getParameters("bundles.App").App
								},function(error , result){
									if (error){
										throw error ;
									}
									context.response.body = context.response.body.replace("</body>",result+"\n </body>") ;
								})
							}else{
								context.setXjson(obj);	
							}
						});
					}
				})
			}
		}.bind(this));
	};

	return monitoring;
});
