/*
 *
 *
 *
 *
 *
 */


nodefony.registerService("cssrewrite", function(){


	var cssrewrite = function(kernel, container){

		this.kernel = kernel ;
		this.container = container ;
		this.name = "cssrewrite";
	
	}

	cssrewrite.prototype.filter = function(path , file){
		switch (nodefony.typeOf( path ) ){
			case "array" :
				try {

					return result ;
				}catch(error){
					throw error ;
				}
			break;
			case "string" :
				try {
					if (path.match(/.*\.min/) ){
						return 	file.read();
					}
					var reg = /url\(.*?\)/ig ;
					var result  = "" ;
					var result = file.readByLine(function(line , number){
						var ret = reg.exec(line) ;
						if ( ret ){
							console.log(ret)
							console.log(line)
						}else{
							result+=line ;
						}
					})
							
					return result ;
				}catch(error){
					throw error ;
				}
			break;
			default :
				throw  new Error("Service  cssrewrite FILTER bad path type  ");
			
		}
	}


	return cssrewrite ;


});