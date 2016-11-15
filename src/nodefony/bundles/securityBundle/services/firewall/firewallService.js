/*
 *
 *
 *
 *
 *
 */

nodefony.registerService("firewall", function(){

	var pluginReader = function(){

		var replaceKey = function(key){
			var tab = ['firewall', 'user', 'encoder'];
			return (tab.indexOf(key) >= 0 ? key + 's' : key);
		};
		
		var arrayToObject = function(tab){
			var obj = {};
			for(var i = 0; i < tab.length; i++){
				for(var key in tab[i]){
					if(tab[i]['name'] && key != 'name'){
						if(!obj[tab[i]['name']]){
							obj[tab[i]['name']] = {};
							delete obj['name'];
						}
						obj[tab[i]['name']][key] = (tab[i][key] instanceof Array ? arrayToObject(tab[i][key]) : tab[i][key]);
					} else if(key == 'rule'){
						obj = tab[i][key];
					} else {
						var value = (tab[i][key] instanceof Array ? arrayToObject(tab[i][key]) : tab[i][key]);
						if(value && value.class && value.algorithm){
							value[value.class] = value.algorithm;
							delete value.class;
							delete value.algorithm;
						}
						obj[replaceKey(key)] = value;
					}
				}
				
			}
			return (obj instanceof Object && Object.keys(obj).length == 0 ? null : obj);
		};
		

		var importXmlConfig = function(xml, prefix, callback, parser){
			
			if (parser){
				xml = this.render(xml, parser.data, parser.options);
			}
			var config = {};
			this.xmlParser.parseString(xml, function(err, node){
				for(var key in node){
					switch(key){
						case 'config':
							config = arrayToObject(node[key]);
							break;
					}
				}
			});
			
			if(callback) {
				callback.call(this, this.xmlToJson.call(this, {security: config}));
			} else {
				return config;
			}
		};

		var getObjectSecurityXML = function(file, callback, parser){
			importXmlConfig.call(this, file, '', callback, parser);
		};	
		
		var getObjectSecurityJSON = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) callback(JSON.parse(file)); 
		};	
		
		var getObjectSecurityYml = function(file, callback, parser){
			if (parser){
				file = this.render(file, parser.data, parser.options);
			}
			if(callback) callback(yaml.load(file));
		};	

		return {
			xml:getObjectSecurityXML,
			json:getObjectSecurityJSON,
			yml:getObjectSecurityYml,
			annotation:null
		};
	}();

	// context security
	var securedArea = function(name, container, firewall){
		this.name = name ;
		this.container = container;
		this.firewall = firewall ;
		this.kernel = firewall.kernel ;
		this.sessionContext = "default" ;
		this.crossDomain = null;
		this.pattern = ".*";
		this.factory = null; 
		this.provider = null;
		this.formLogin = null;
		this.checkLogin = null;
		this.redirect_Https = false ;

		this.firewall.kernel.listen(this, "onReady",function(){
			try {
				if ( this.providerName in this.firewall.providers){
					this.provider = this.firewall.providers[ this.providerName ].Class ;	
				}else{
					throw new Error ("PROVIDER : "+this.providerName +" NOT registered " );
				}
				if ( ! this.provider ){
					throw new Error ( "PROVIDER CLASS: "+this.providerName +" CLASS NOT registered  check config file  "  )
				}
				if (! this.factory ){
					throw new Error( "FACTORY : " + this.factoryName + " CLASS NOT registered check config file " )	
				}
				this.logger(" FACTORY : "+ this.factory.name + " PROVIDER : " + this.provider.name + " PATTERN : " + this.pattern, "DEBUG");
			}catch(e){
				this.logger(this.name +"  "+e, "ERROR");	
				throw e;
			}
		})
	};

	securedArea.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "\x1b[36mCONTEXT SECURITY \033[31m"+this.name+" \x1b[0m";
		return this.firewall.logger(pci, severity, msgid,  msg);
	};

	securedArea.prototype.handleCrossDomain = function(context, request, response){
		if ( context.crossDomain ){
			if ( this.crossDomain ){
				return  this.crossDomain.match( context.request, context.response )	
			}else{
				return  401;
			}
		}
	};

	securedArea.prototype.handleError = function(context, e){
		if (context.session){
			//context.session.clear();	
		}
		switch ( context.type ){
			case "HTTP" :
			case "HTTPS" :
				if (this.formLogin) {
					if (e.message){
						this.logger(e.message, "DEBUG");
					}else{
						this.logger(e, "DEBUG");
					}
					if ( e && e.status ){
						context.response.setStatusCode( e.status, e.message ) ;
					}else{
						context.response.setStatusCode( 401 ) ;
					}
					context.resolver = this.overrideURL(context, this.formLogin);
					if ( !  context.resolver.resolve ){
						return context.notificationsCenter.fire("onError",context.container, {
							status:401,
							message:"Form Login route : " + this.formLogin + " this route not exist. Check Security config file"
						});
					}
					if (! context.isAjax ){
						if ( e.message !== "Unauthorized" ){
							context.session.setFlashBag("session", {
								error:e.message
							});
						}
					}else{
						context.setXjson(e);
					}
					context.notificationsCenter.fire("onRequest",context.container, context.request, context.response );
				}else{
					if (e.status){
						context.notificationsCenter.fire("onError",context.container, {
							status:e.status,
							message:e.message
						});
					}else{
						context.notificationsCenter.fire("onError",context.container, {
							status:500,
							message:e
						});
					}
				}
			break;
			case "WEBSOCKET":
			case "WEBSOCKET SECURE":
				//console.trace(e);
				if (e.status){
					context.notificationsCenter.fire("onError",context.container, {
						status:e.status,
						message:e.message
					});
				}else{
					context.notificationsCenter.fire("onError",context.container, {
						status:500,
						message:e
					});
				}	
			break;	
		}
	
	};

	securedArea.prototype.handle = function(context){
		try {
			if ( this.factory ){
				this.factory.handle(context, function(error, token){
					if (error){
						return this.handleError(context, error) ;
					}
					this.token = token ;
					if ( ! context.session.strategyNone ){	
						context.session.migrate(true);
					}
					//console.log( context.user )
					var userFull = context.user.dataValues ;
					delete userFull.password ;
					/*{
						createdAt:context.user.createdAt,
						updatedAt:context.user.updatedAt,
						roles:context.user.roles,
						lang:context.user.lang,
						surname:context.user.surname,
						name:context.user.name,
						email:context.user.email,
						accountNonLocked:context.user.accountNonLocked,
						credentialsNonExpired:context.user.credentialsNonExpired,
						enabled:context.user.enabled,
						username:context.user.username,
						id:context.user.id
					}*/
					
					var ret = context.session.setMetaBag("security",{
						firewall:this.name,
						user:context.user.username,	
						userFull:userFull,
						factory:this.factory.name,
						tokenName:this.token.name
					});
					//context.session.getMetaBag("security") ;
					//console.log( context.request.url.pathname )
					//console.log( this.checkLogin )
					if ( this.defaultTarget ){
						
						context.resolver = this.overrideURL(context, this.defaultTarget);
						if ( context.isAjax ){
							var obj = context.setXjson( {
								message:"OK",
								status:200,
							});
							context.notificationsCenter.fire("onRequest",context.container, context.request, context.response, obj );
							return ;
						}else{
							this.redirect(context, this.defaultTarget);
							return ;
						}
					}else{
						if ( context.isAjax ){
							var obj = context.setXjson( {
								message:"OK",
								status:200,
							});
							context.notificationsCenter.fire("onRequest",context.container, context.request, context.response, obj );
							return ;
						}
						if ( context.request.url.pathname === this.checkLogin ){
							return this.redirect(context, "/");
						}
					}
					context.notificationsCenter.fire("onRequest", context.container, context.request, context.response);
				}.bind(this));	
			}
		}catch(e){
			this.handleError(context, e);
		}

	};

	// Factory
	securedArea.prototype.setFactory = function(auth, options){
		this.factoryName = auth ;
		if ( auth ){
			if (auth in nodefony.security.factory ){
				this.factory = new nodefony.security.factory[auth](this, options)
				this.logger("FACTORY "+auth +" registered ","DEBUG");
			}else{
				this.logger("FACTORY :"+auth +"NOT registered ","ERROR");
				throw new Error("FACTORY :"+auth +"NOT registered "); 
			}
		}
	};

	securedArea.prototype.getFactory = function(auth){
		return this.factory ;
	};

	
	securedArea.prototype.setProvider = function(provider, type){
		this.providerName = provider;
		this.providerType = type ;
	};

	securedArea.prototype.overrideURL = function(context, url ){
		context.request.url = Url.parse( Url.resolve(context.request.url, url) ) ;
		var router = this.kernel.get("router") ; 
		return router.resolve(context.container, context);
	};
	
	securedArea.prototype.redirectHttps = function(context){
		return context.redirectHttps(301) ;
	};

	securedArea.prototype.redirect = function(context, url){
		if ( url ){
			return context.redirect(url, 301);
		}
		return context.redirect(context.request.url, 301);
	};
		
	securedArea.prototype.match = function(request, response){
                var url = request.url ? request.url.pathname : ( request.resourceURL ? request.resourceURL.pathname : null ) ;
                return this.pattern.exec(url);
	};

	securedArea.prototype.setPattern = function(pattern){
		this.regPartten =  pattern ;
		this.pattern = new RegExp(pattern);
	};

	securedArea.prototype.setCrossDomain = function(crossSettings){
		this.crossDomain = new nodefony.io.cors(crossSettings); 
	};

	securedArea.prototype.setFormLogin = function(route){
		this.formLogin = route;
	};

	securedArea.prototype.setCheckLogin = function(route){
		this.checkLogin = route;	
	};


	securedArea.prototype.setDefaultTarget = function(route){
		this.defaultTarget = route;
	};

	securedArea.prototype.setContextSession = function(context){
		this.sessionContext = context ;
	};

	securedArea.prototype.setRedirectHttps = function(value){
		this.redirect_Https = value || false ;
	};


	/*
 	 *
 	 *	CLASS FIREWALL
 	 *
 	 *
 	 */

	var optionStrategy ={
		migrate:true,
		invalidate:true,
		none:true
	};

	var Firewall = function(container, kernel ){
		this.container = container;
		this.kernel = kernel;
		this.reader = function(context){
			var func = context.container.get("reader").loadPlugin("security", pluginReader);
			return function(result){
				try {
					return func(result, context.nodeReader.bind(context));
				}catch(e){
					context.logger(e.message, "ERROR");
					console.trace(e)
				}
			};
		}(this);
		
		this.securedAreas = {}; 
		this.providers = {};
		this.sessionStrategy = "invalidate" ;

		this.syslog = this.container.get("syslog");

		// listen KERNEL EVENTS
		this.kernel.listen(this, "onBoot",function(){
			this.sessionService = this.get("sessions");
			this.orm = this.get(this.kernel.settings.orm);
		});

		this.kernel.listen(this, "onSecurity",function(context){
			switch (context.type){
				case "HTTP" :
				case "HTTPS" :
					var request = context.request.request ;
					var response = context.response.response ;
					request.on('end', function(){
						for ( var area in this.securedAreas ){
							if ( this.securedAreas[area].match(context.request, context.response) ){
								//FIXME PRIORITY
								context.security = this.securedAreas[area];
								//break;
							}
						}
						if (  context.security ){	
							context.sessionAutoStart = "firewall" ;	
							this.sessionService.start(context, context.security.sessionContext, function(error, session){
								if (error){
									return context.security.handleError(context, error);
								}
								if (  context.type === "HTTP" &&  context.container.get("httpsServer").ready &&  context.security.redirect_Https ){
									return context.security.redirectHttps(context);
								}
								try {
									return this.handlerHttp(context, request, response, session);
								}catch(error){
									return context.notificationsCenter.fire("onError", context.container, error );
								}
							}.bind(this));	
						}else{
							try {
								if ( context.sessionAutoStart === "autostart" ){
					 				this.sessionService.start(context, "default", function(error, session){
						 				if (error){
											throw error ;
						 				}
										this.logger("AUTOSTART SESSION NO SECURE AREA","DEBUG");
										try {
											return this.handlerHttp(context, request, response, session);
										}catch(error){
											return context.notificationsCenter.fire("onError", context.container, error );
										}
									}.bind(this))
								}else{
									var next = context.kernelHttp.checkValidDomain( context ) ;
									if ( next !== 200){
										return ;
									}
									return context.notificationsCenter.fire("onRequest", context.container, request, response);	
								}
							}catch(e){
								return context.notificationsCenter.fire("onError", context.container, e );	
							}
						}
					}.bind(this));
				break;
				case "WEBSOCKET" :
				case "WEBSOCKET SECURE" :
					var request = context.request ;
					var response = context.response ;
					for ( var area in this.securedAreas ){
						if ( this.securedAreas[area].match(context.request, context.response) ){
							//FIXME PRIORITY
							context.security = this.securedAreas[area];
							//break;
						}
					}
					if (  context.security ){
						context.sessionAutoStart = "firewall" ;
						this.sessionService.start(context, context.security.sessionContext, function(error, session){
							if (error){
								return context.security.handleError(context, error);
							}
							try {
								this.handlerHttp(context, request, response, session);
							}catch(error){
								context.notificationsCenter.fire("onError", context.container, error );
							}
						}.bind(this));	
					}else{
						try {
							if ( context.sessionAutoStart === "autostart" ){
					 			this.sessionService.start(context, "default", function(err, session){
						 			if (err){
										throw err ;
						 			}
									this.logger("AUTOSTART SESSION NO SECURE AREA","DEBUG");
									try {
										return this.handlerHttp(context, request, response, session);
									}catch(error){
										return context.notificationsCenter.fire("onError", context.container, error );
									}
					 			}.bind(this));
							}else{
								var next = context.kernelHttp.checkValidDomain( context ) ;
								if ( next !== 200){
									return ;
								}
								return context.notificationsCenter.fire("onRequest", context.container, request, response);	
							}	
						}catch(e){
							return context.notificationsCenter.fire("onError", context.container, e );	
						}
					}
				break;
			}
		});
	};
	
	Firewall.prototype.handlerHttp = function( context, request, response, session){
		var next = context.kernelHttp.checkValidDomain( context ) ;
		if ( next !== 200){
			return ;
		}
		try {
			context.crossDomain = context.isCrossDomain() ;
			//CROSS DOMAIN //FIXME width callback handle for async response  
			if (  context.security && context.crossDomain ){
				var next = context.security.handleCrossDomain(context, request, response) ;
				switch (next){
					case 204 :
						return 204;
					case 401 :
						this.logger("\033[31m CROSS DOMAIN Unauthorized \033[0mREQUEST REFERER : " + context.originUrl.href ,"ERROR");
						context.notificationsCenter.fire("onError",context.container, {
							status:next,
							message:"crossDomain Unauthorized "
						});
						return 401;
					case 200 :
						this.logger("\033[34m CROSS DOMAIN  \033[0mREQUEST REFERER : " + context.originUrl.href ,"DEBUG");
					break;
				}
			}
			var meta = session.getMetaBag("security");
			//console.log(meta)
			if ( meta ){
				context.user = meta.userFull ; 		
			}
			if ( context.security ){
				if ( ! meta ){
					return context.security.handle( context, request, response);	
				}
				/*context.security.provider.loadUserByUsername( meta.user ,function(error, user){
					if (error){
						return context.notificationsCenter.fire("onError", context.container, error );
					}
					context.user = user ;
					try {
						return context.notificationsCenter.fire("onRequest", context.container, request, response );
					}catch(e){
						return context.notificationsCenter.fire("onError", context.container, e );	
					}
				}.bind(this)) ;*/
			}

			return context.notificationsCenter.fire("onRequest", context.container, request, response);

		}catch(e){
			if ( context.security ){
				return context.security.handleError(context, e);
			}
			throw e ;
		}
	};


	Firewall.prototype.setSessionStrategy = function(strategy){
		if (strategy in optionStrategy ){
			this.logger("Set Session Strategy  : " + strategy,"DEBUG")
			return this.sessionStrategy = strategy ;
		}
		throw new Error("sessionStrategy strategy not found");
	};

	Firewall.prototype.nodeReader = function(obj){
		//console.log(obj.security.firewalls)
		obj = obj.security;
		for (var ele in obj){
			switch (ele){
				case "firewalls" :
					for ( var firewall in obj[ele] ){
						var param = obj[ele][firewall];
						var area = this.addSecuredArea(firewall);
						for (var config in param){
							switch (config){
								case "pattern":
									area.setPattern(param[config]);
								break;
								case "anonymous":
								break;
								
								case "crossDomain":
									area.setCrossDomain(param[config]);
								break;
								case "form_login":
									if (param[config].login_path){
										area.setFormLogin(param[config].login_path);
									}
									if (param[config].check_path){
										area.setCheckLogin(param[config].check_path);
									}
									if (param[config].default_target_path){
										area.setDefaultTarget(param[config].default_target_path);
									}
								break;
								case "remember_me":
									//TODO
								break;
								case "logout":
									//TODO
								break;
								case "stateless":
									//TODO
								break;
								case "redirectHttps":
									area.setRedirectHttps(param[config]);
								break;
								case "provider" :
									//this.kernel.listen(this, "onReady",function(provider, context){
										var provider = param[config] ;
										//if ( provider in this.providers ){
											area.setProvider(provider);
										//}else{
											//this.logger("Provider  : "+provider +" Not found")

										//}	
									//}.bind(this,param[config], area));
								break;
								case "context" :
									if ( param[config] ){
										this.kernel.listen(this, "onBoot",function(context, contextSecurity){
											//console.log( this.sessionService );
											contextSecurity.setContextSession(context);
											this.sessionService.addContextSession(context);
										}.bind(this, param[config], area));
									}
								break;
								default:
									
									if ( config in nodefony.security.factory ){
										area.setFactory(config, param[config]);
									}else{
										area.factoryName = config ;
										this.logger("FACTORY : "+config +" not found in nodefony namespace","ERROR");
									}
							}
						}
					}
				break;
				case "session_fixation_strategy":
					this.kernel.listen(this, "onBoot",function(strategy){
						this.setSessionStrategy(strategy);
						this.sessionService.setSessionStrategy(this.sessionStrategy);
					}.bind(this ,obj[ele]));
				break;
				case "access_control" : 
				break;
				case "providers" : 
					for ( var provider in obj[ele] ){
						this.providers[provider] = {
							name:null,
							Class:null,
							type:null
						};
						for (var pro in obj[ele][provider] ){
							var element = obj[ele][provider] ;
							switch (pro){
								case "memory" :
									for (var api in element[pro]){
										switch (api){
											case "users":
												this.providers[provider] = {
													name:provider,
													Class:new nodefony.usersProvider(provider, element[pro][api]),
													type:pro
												};
												this.logger(" Register Provider  : "+provider + " API " +this.providers[provider].name, "DEBUG")
											break;
											default:
												this.logger("Provider API : "+api +" Not exist")
										}
									}
								break;
								case "class" :
									//FIXME
									for(var api in element[pro]){
										switch(api){
											case "name":
												var Class = nodefony[ element[pro][api] ];
											break;
											case "property":
												var property =  element[pro][api];
											break;
											case "manager_name":
												var manager_name = element[pro][api] ;
											break;
										}
										
									}
									if (Class){
										if (manager_name && manager_name !== "~"){
											this.providers[manager_name] ={
												name:manager_name,
												Class:new Class(property),
												type:pro
											}
										}else{
											this.providers[provider] = {
												name:manager_name,
												Class:new Class(property),
												type:pro
											}
										}
									}
								break;
								case "entity" :
									this.kernel.listen(this, "onBoot",function(){
										this.orm.listen(this, "onOrmReady", function(){
											var ent = this.orm.getEntity(element[pro].name)
											if (! ent){
												this.logger("ENTITY PROVIDER : "+ provider+ "not found","ERROR");
												return ;
											}
											this.providers[provider] = {
												name:provider,
												Class:ent,
												type:pro
											}
											this.logger(" Register Provider  : "+provider + " ENTITY " +element[pro].name, "DEBUG");
										})
									}.bind(this));
								break;
								default:
									this.logger("Provider type :"+pro+" not define ");
							}
						}	
					}
				break;
			}
		}
		//console.log(area)
	}

	
	Firewall.prototype.addSecuredArea = function(name){
		if ( ! this.securedAreas[name] ){
			this.securedAreas[name] = new securedArea(name, this.container, this) ;
			this.logger("ADD security context : " + name, "DEBUG" )
			return this.securedAreas[name];
		}else{
			this.logger("securedAreas :" + name +"already exist ")
		}
	};

	Firewall.prototype.getSecuredArea = function(name){
		if (name in this.securedAreas){
			return this.securedAreas[name] ;
		}
		return null ;
	};


	Firewall.prototype.logger = function(pci, severity, msgid,  msg){
		if (! msgid) msgid = "\x1b[36mSERVICE FIREWALL\x1b[0m";
		return this.syslog.logger(pci, severity, msgid,  msg);
	};


	Firewall.prototype.get = function(name){
		if (this.container)
			return this.container.get(name);
		return null;
	};

	Firewall.prototype.set = function(name, obj){
		if (this.container)
			return this.container.set(name, obj);
		return null;
	};

	return Firewall;
});
