function Editor(){
    this.polygons = [];
	this.objects = [];
	this.toplevelState = "create";
	this.createType = -1;//-1 == Polygon, custom objects are 0, 1, 2, 3, ...
	this.editType = "Polygon";
	this.detailEditType = "none";
	
	//Selection
	this.nearestObj = null;//Object/polygon closest to the mouse, but not too far away
	this.selected = [];//List of selected polygons/objects
	
	this.nearestDetail = null;
	this.selectedDetails = [];
	
	this.nearestPoint = null;
	this.nearestLine = null;//If there is a nearest line(that is not too far away), it holds the first endpoint of the nearest line
	this.selectedPoint = null;//(an eventual selected line is the line with it's first endpoint being selectedPoint)

	this.selRectCornerA = null;//Rectangle selection, first of two opposite corners
	this.selRectCornerB = null;//The other corner
	
	//The "brush" used for placing details
	this.currentDetail = 0;//index in the list of details
	this.currentDetailAngle = 0;
	this.currentDetailXscale = 1;
	this.currentDetailYscale = 1;
	this.currentDetailOpacity = 1;
	
	//View
	this.viewX = 0;
	this.viewY = 0;
	this.zoom = 1;
	
	
	//Function used in 'onchange' event by input elements in the 'edit' tab when an object(not polygon) is selected, to update a property of the object
	this.objectPropertyChange = function(id, val){
		//Extract a number from the end of the element's id that matches the index of one of the object's properties
		var n = id.substring(id.lastIndexOf('_') + 1, id.length); 
		//Set the property of this 
		objEditor.selected[0].properties[n] = val; 
	};
	
	//Add an object to the level
	this.createObject = function(type){
		if( type == -1 ){//Create polygon
			var poly = new Polygon(0, 0);
			poly.addPoint(-32, -16, true);
			poly.addPoint(32, -16, true);
			poly.addPoint(0, 32, true);
			poly.type = -1;
			this.polygons.push(poly)
			this.selected.length = 1;
			this.selected[0] = poly;
			return poly;
		} else {//Create object
			if( objectTypes[type].onlyOne ){//Do not create a new one if only one can exist
				var ind = this.objectsIndexOfType(type);
				if( ind != -1 )
					return this.objects[ind];
			}
			
			var obj = {
				type: type,
				position: new Point(0, 0),
				properties: []
			};
			var objType = objectTypes[type]
			var l = objType.properties.length;
			for(var n = 0; n < l; n++){
				obj.properties.push(objType.properties[n].def);
			}
			this.objects.push(obj);
			this.selected.length = 1;
			this.selected[0] = obj;
			return obj;
		}
	}
	
	//Find the index of the first object of a type, in the list of all objects, where different kinds of objects are sorted in order of depth
	this.objectsIndexOfType = function(type){
		var l = this.objects.length;
		for(var n = 0; n < l; n++){
			if( this.objects[n].type == type )
				return n;
		}
		return -1;
	}
	

	//Add objects that must exist, to the level:
	for( var n = 0; n < objectTypes.length; n++ ){
		if( objectTypes[n].mustExist )
		var obj = this.createObject(n);
		obj.position.x = Math.round(screenWidth * 0.25 + Math.random() * screenWidth * 0.5);
		obj.position.y = Math.round(screenHeight * 0.25 + Math.random() * screenHeight * 0.5);
	}
	
	
	
	
	{//List of relevant HTML elements referenced in variables
		this.div = document.getElementById("LE_div");
		this.div.style.display = "inline-block";
		this.saveLoadDiv = document.getElementById("LE_SaveLoadDiv");
		this.saveLoadDiv.style.display = "inline-block";
		this.menuDiv = document.getElementById("LE_Menu");
		
		this.createButton = document.getElementById("LE_butCreate");
		this.moveSelectButton = document.getElementById("LE_butMoveSelect");
		this.editButton = document.getElementById("LE_butEdit");
		
		this.selObject = document.getElementById("LE_SelObject");
		for(var n = 0; n < objectTypes.length; n++){//Add objects to the selection list
			this.selObject.innerHTML += '<option value="' + n + '">' + objectTypes[n].name + '</option>';
		}
		this.createDiv = document.getElementById("LE_Create");
		this.moveSelectDiv = document.getElementById("LE_MoveSelect");
		this.editDiv = document.getElementById("LE_EditPolygon");
		this.editObjectDiv = document.getElementById("LE_EditObject");
		this.selectedDeleteButton = document.getElementById("LE_butSelectedDelete");
		this.checkJumpThrough = document.getElementById("LE_checkJumpThrough");
		this.checkVisible = document.getElementById("LE_checkVisible");
		this.polyBgColor = document.getElementById("LE_polyBgColor");
		this.polyTex = document.getElementById("LE_SelTexture");
		
		this.polyTexOpacity = document.getElementById("LE_polyTexOpacity");
		this.selDetail = document.getElementById("LE_SelDetail");
		
		this.radEditPoly = document.getElementById("LE_RadEditPoly");
		this.radEditSolid = document.getElementById("LE_RadEditSolid");
		this.radEditDetails1 = document.getElementById("LE_RadEditDetails1");
		this.radEditDetails2 = document.getElementById("LE_RadEditDetails2");
		this.radEditDetails3 = document.getElementById("LE_RadEditDetails3");
		
		this.saveArea = document.getElementById("LE_SaveArea");
		this.loadArea = document.getElementById("LE_LoadArea");
		this.saveButton = document.getElementById("LE_SaveButton");
		this.loadButton = document.getElementById("LE_LoadButton");
		
		//Fill the list selection input elements, one with texture names and the other with detail names
		var l = resources.textures.length;
		for( var n = 0; n < l; n++ ){
			var tn = resources.textures[n];
			if(	tn != texSelected && tn != texJumpThrough && tn != texJumpThroughInv ){
				var str = '<option value="';
				str += n;
				str += '">';
				var src = tn.img.src;
				src = src.slice(src.lastIndexOf("/") + 1, src.length - 4);
				str += src;
				str += '</option>'
				this.polyTex.innerHTML += str;
			}
		}
		var l = resources.details.length;
		for( var n = 0; n < l; n++ ){
			var tn = resources.details[n];
			var str = '<option value="';
			str += n;
			str += '">';
			var src = tn.img.src;
			src = src.slice(src.lastIndexOf("/") + 1, src.length - 4);
			str += src;
			str += '</option>'
			this.selDetail.innerHTML += str;
		}
	}
	
	
	
	//Generate a string containing the level data and put it in the "
	this.saveString = function(){
		var str = "";
		
		//Polygons
		var l = objEditor.polygons.length;
		for(var n = 0; n < l; n++){
			str += "@Polygon{";
			var poly = objEditor.polygons[n];
			str += "x:" + Math.round(poly.position.x) + "£";
			str += "y:" + Math.round(poly.position.y) + "£";
			str += "jumpThrough:" + poly.jumpThrough + "£";
			str += "visible:" + poly.visible + "£";
			str += "bgColor:" + poly.bgColor + "£";
			var src = poly.texture.img.src;
			src = src.slice(src.lastIndexOf("/") + 1, src.length - 4);
			str += "texture:" + src + "£";
			str += "textureOpacity:" + poly.textureOpacity.toFixed(3) + "£";
			str += "^points{";
			var l2 = poly.points.length;
			for(var m = 0; m < l2; m++){
				var point = poly.points[m];
				str += "^point{";
				str += "x:" + point.x.toFixed(3) + "£";
				str += "y:" + point.y.toFixed(3) + "£";
				str += "solid:" + point.solid + "£";
				str += "} ";
			}
			str += "} ";
			
			for(var i = 0; i <3; i++){
				str += "^details" + (i + 1) + "{";
				l2 = poly.details[i].length;
				for(var m = 0; m < l2; m++){
					var detail = poly.details[i][m];
					str += "^detail{";
					str += "x:" + Math.round(detail.x) + "£";
					str += "y:" + Math.round(detail.y) + "£";
					var src = resources.details[detail.dtl].img.src;
					src = src.slice(src.lastIndexOf("/") + 1, src.length - 4);
					str += "dtl:" + src + "£";
					str += "xscale:" + detail.xscale.toFixed(3) + "£";
					str += "yscale:" + detail.yscale.toFixed(3) + "£";
					str += "angle:" + detail.angle.toFixed(3) + "£";
					str += "opacity:" + detail.opacity.toFixed(3) + "£";
					str += "} ";
				}
				str += "} ";
			}
			str += "} ";
		}
		
		//Objects
		l = objEditor.objects.length;
		for(var n = 0; n < l; n++){
			var obj = objEditor.objects[n];
			var objType = objectTypes[obj.type];
			str += "@" + objType.name + "[";
			str += "x:" + Math.round(obj.position.x) + "£";
			str += "y:" + Math.round(obj.position.y) + "£";
			var l2 = objType.properties.length;
			for(var m = 0; m < l2; m++){
				var prop = objType.properties[m];
				if( m == 0 )
					str += ""
				str += prop.name + ":" + obj.properties[m] + "£";
			}
			str += "] ";
			
		}
		objEditor.saveArea.value = str;
	}
	
	//Load the data from the level string 'str'
	this.loadString = function(str){
		this.objects = [];
		this.objects.length = 0;
		this.selected = [];
		this.selected.length = 0;
		this.polygons = [];
		this.polygons.length = 0;
		this.nearestObj = null;
		this.toplevelState = "create";
		this.updateGUI();
		
		//Load polygons
		
		var ind = str.indexOf("@Polygon{");
		while( ind != -1 ){
			str = str.substring(ind, str.length);
			var poly = this.createObject(-1);
			
			//Basic properties
			
			poly.position.x = parseFloat(str.substring(str.indexOf("x:") + 2 , str.indexOf("£"))); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.position.y = parseFloat(str.substring(str.indexOf("y:") + 2 , str.indexOf("£"))); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.jumpThrough = ( str.substring(str.indexOf("jumpThrough:") + 12 , str.indexOf("£")) == "true" );  
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.visible = ( str.substring(str.indexOf("visible:") + 8 , str.indexOf("£")) == "true" ); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.bgColor = str.substring(str.indexOf("bgColor:") + 8 , str.indexOf("£")); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.texture = resources.getFromString( str.substring(str.indexOf("texture:") + 8 , str.indexOf("£")) );
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.textureOpacity = parseFloat(str.substring(str.indexOf("textureOpacity:") + 15 , str.indexOf("£"))); 
			str = str.substring(str.indexOf("£") + 1, str.length); 
			
			poly.points.length = 0;
			
			//Points
			
			var  ind2 = str.indexOf("^point{");
			while( ind2 != -1 ){
				str = str.substring(ind2, str.length);
				var point = poly.addPoint(0, 0, true);
				
				point.x = parseFloat(str.substring(str.indexOf("x:") + 2 , str.indexOf("£"))); 
				str = str.substring(str.indexOf("£") + 1, str.length); 
				
				point.y = parseFloat(str.substring(str.indexOf("y:") + 2 , str.indexOf("£"))); 
				str = str.substring(str.indexOf("£") + 1, str.length); 
				
				point.solid = ( str.substring(str.indexOf("solid:") + 6 , str.indexOf("£")) == "true" );  
				str = str.substring(str.indexOf("£") + 1, str.length); 
				
				ind2 = str.indexOf("^point{");
				if( ind2 > str.indexOf("^details1{") )
					ind2 = -1;
			}
			
			//Details
			
			for(var n = 0; n < 3; n++){
				poly.details[n].length = 0;
				ind2 = str.indexOf("^details" + (n + 1) + "{");
				while( ind2 != -1 ){
					if( str.indexOf("^details" + (n + 1) + "{}") == ind2 )
						break;

					str = str.substring(ind2, str.length);
					var detail = poly.addDetail(n, null, 0, 0, 1, 1, 0, 1);
					
					detail.x = parseFloat(str.substring(str.indexOf("x:") + 2 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length); 
					
					detail.y = parseFloat(str.substring(str.indexOf("y:") + 2 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length); 
					
					detail.dtl = resources.getFromString( str.substring(str.indexOf("dtl:") + 4 , str.indexOf("£")) );
					for( var m = 0; m < resources.details.length; m++){//Find the index of the detail
						if( resources.details[m] == detail.dtl ){
							detail.dtl = m;
							break;
						}
					}
					str = str.substring(str.indexOf("£") + 1, str.length); 
					
					detail.xscale = parseFloat(str.substring(str.indexOf("xscale:") + 7 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					detail.yscale = parseFloat(str.substring(str.indexOf("yscale:") + 7 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					detail.angle = parseFloat(str.substring(str.indexOf("angle:") + 6 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					detail.opacity = parseFloat(str.substring(str.indexOf("opacity:") + 8 , str.indexOf("£"))); 
					str = str.substring(str.indexOf("£") + 1, str.length);
					
					ind2 = str.indexOf("^detail{");
					if( ind2 > str.indexOf("^details") )
						ind2 = -1;
				}
			}
			ind = str.indexOf("@Polygon{");
		}
		
		//Load objects
		
		ind = str.indexOf("@");
		while( ind != -1 ){
			var typeName = str.substring(ind + 1, str.indexOf("[",ind));
			var type;
			var typeInd;
			var l = objectTypes.length;
			for(var n = 0; n < l; n++){
				if( objectTypes[n].name == typeName ){
					type = objectTypes[n];
					typeInd = n;
					break;
				}
			}
			
			//Basic properties( position)
			
			var ind2 = str.indexOf("]",ind);
			var obj = this.createObject(typeInd);
			
			obj.position.x = parseFloat(str.substring(str.indexOf("x:", ind) + 2 , str.indexOf("£", ind))); 
			ind = str.indexOf("£", ind) + 1; 
			
			obj.position.y = parseFloat(str.substring(str.indexOf("y:", ind) + 2 , str.indexOf("£", ind))); 
			ind = str.indexOf("£", ind) + 1; 
			
			//Custom properties
			for(var m = 0; m < type.properties.length; m++){
				var prop = type.properties[m];
				var propInd = str.indexOf(type.properties[m].name + ":", ind);
				
				if( propInd != -1 && propInd < ind2 ){
					var a = str.substring(str.indexOf(type.properties[m].name + ":", ind) + type.properties[m].name.length + 1 , str.indexOf("£", ind)); 
					if( isNaN(parseFloat(a)) )
						obj.properties[m] = a;
					else
						obj.properties[m] = parseFloat(a);
						
					ind = str.indexOf("£", ind) + 1;
				}				
			}
			ind = str.indexOf("@", ind);
		}
	}
	
	
	
	//Functions set to the clicking and changing events of various HTML elements in the editor GUI
	
	this.saveButton.onclick =  this.saveString;
	this.loadButton.setAttribute("onclick","objEditor.loadString(objEditor.loadArea.value);");
	
	this.updateGUI = function(){//Updates the overall GUI for when one of the tabs are clicked
		if(this.toplevelState == "create"){
			this.createDiv.style.display = "block";
			this.createButton.style.backgroundColor = "white";
			this.createButton.style.borderBottom = "none";
		} else {
			this.createDiv.style.display = "none";
			this.createButton.style.backgroundColor = "cornFlowerBlue";
			this.createButton.style.borderBottom = "1px solid";
		}
		if(this.toplevelState == "moveselect"){
			this.moveSelectDiv.style.display = "block";
			this.moveSelectButton.style.backgroundColor = "white";
			this.moveSelectButton.style.borderBottom = "none";
		} else {
			this.moveSelectDiv.style.display = "none";
			this.moveSelectButton.style.backgroundColor = "cornFlowerBlue";
			this.moveSelectButton.style.borderBottom = "1px solid";
		}
		if(this.toplevelState == "edit"){
			this.editButton.style.backgroundColor = "white";
			this.editButton.style.borderBottom = "none";
			if( objEditor.selected[0].type == -1 ){//Selected is a polygon
				this.editDiv.style.display = "block";
				this.checkJumpThrough.checked = objEditor.selected[0].jumpThrough;
				this.checkVisible.checked = objEditor.selected[0].visible;
				this.polyBgColor.value = objEditor.selected[0].bgColor;
				this.polyTexOpacity.value = objEditor.selected[0].textureOpacity * 100;
				this.polyTex.value = resources.textures.indexOf(objEditor.selected[0].texture);
				this.currentDetail = 0;
				this.currentDetailAngle = 0;
				this.currentDetailXscale = 1;
				this.currentDetailYscale = 1;
				this.currentDetailOpacity = 1;
				this.selDetail.value = 0;
			} else {
				this.editObjectDiv.style.display = "block";
				var objType = objectTypes[this.selected[0].type]
				this.editObjectDiv.innerHTML = "Edit " + objType.name + ":<br><br>";
				var l = objType.properties.length;
				for(var n = 0; n < l; n++){
					var prop = objType.properties[n];
					var x = document.createElement("INPUT");
					
					x.setAttribute("type", "text"); 
					x.setAttribute("value", this.selected[0].properties[n]); 
					x.setAttribute("id", "EL_ObjProp_" + n); 
					x.setAttribute("onchange", "objEditor.objectPropertyChange(this.id, this.value)");
					this.editObjectDiv.innerHTML += prop.name + ": ";
					this.editObjectDiv.appendChild(x);
					this.editObjectDiv.innerHTML += "<br>( " + prop.description + ")<br><br>";
				}
				
				
			}
		} else {
			this.editDiv.style.display = "none";
			this.editObjectDiv.style.display = "none";
			this.editButton.style.backgroundColor = "cornFlowerBlue";
			this.editButton.style.borderBottom = "1px solid";
		}
	}
	this.selObject.onchange = function(){//Object selection list in the 'create' tab
		objEditor.createType = this.value;
	}
	this.createButton.onclick = function(){//'Create' tab button
		objEditor.toplevelState = "create";
		objEditor.updateGUI();
	}
	this.moveSelectButton.onclick = function(){//'Move/Select' tab button
		objEditor.toplevelState = "moveselect";
		objEditor.updateGUI();
	}
	this.editButton.onclick = function(){//'Edit' tab button
		if( objEditor.selected.length > 0 ){
			objEditor.toplevelState = "edit";
			objEditor.updateGUI();
			objEditor.selected.length = 1;
			objEditor.nearestPoint = null;
			objEditor.nearestLine = null;
			objEditor.selectedPoint = null;
			objEditor.selectedDetails.length = 0;
		}
	}
	this.selectedDeleteButton.onclick = function(){//Delete button in the 'Move/Select' tab
		if( objEditor.selected.length > 0 ){
			var l2 = objEditor.selected.length;
			for(var m = 0; m < l2; m++){
				var l = objEditor.polygons.length;
				for(var n = 0; n < l; n++){
					if( objEditor.polygons[n] == objEditor.selected[m] ){
						objEditor.polygons.splice(n,1);
						break;
					}
				}
				l = objEditor.objects.length;
				for(var n = 0; n < l; n++){
					if( objEditor.objects[n] == objEditor.selected[m] ){
						//Check that the object can be deleted
						if( objEditor.objectTypes[objEditor.objects[n].type].mustExist ){
							var nType = objEditor.objects[n].type;
							var isLastInstance = true;
							for(var i = 0; i < l; i++){
								if( i != n )
									if( nType == objEditor.objects[i].type ){
										isLastInstance = false;
										break;
									}
							}
							if( ! isLastInstance )
								objEditor.objects.splice(n,1);
							else alert("Not allowed to delete the only instance of " + objEditor.objectTypes[nType].name + "!");
						} else objEditor.objects.splice(n,1);
						break;
					}
				}
			}
			objEditor.selected[m] = null;
			objEditor.selected.length = 0;
			objEditor.toplevelState = "moveselect";
			objEditor.updateGUI();
		}
	}
	this.checkJumpThrough.onclick = function(){//Checkbox for whether a polygon is jumpthrough, in the 'Edit' tab
		if( objEditor.selected.length > 0 ){
			objEditor.selected[0].jumpThrough = this.checked;
		}
	}
	this.checkVisible.onclick = function(){//Checkbox for whether a polygon is visible, in the 'Edit' tab
		if( objEditor.selected.length > 0 ){
			objEditor.selected[0].visible = this.checked;
		}
	}
	this.polyBgColor.onchange = function(){//Color selector for the background color that a polygon's texture is drawn additively on top of, in the 'Edit' tab
		if( objEditor.selected.length > 0 ){
			objEditor.selected[0].bgColor = this.value;
		}
	}
	this.polyTexOpacity.oninput = function(){//Texture opacity of a polygon, in the 'Edit' tab
		if( objEditor.selected.length > 0 ){
			objEditor.selected[0].textureOpacity = this.value / 100;
		}
	}
	this.polyTex.onchange = function(){//Polygon texture selection list, in the 'Edit' tab
		if( objEditor.selected.length > 0 ){
			objEditor.selected[0].texture = resources.textures[this.value];
		}
	}
	this.selDetail.onchange = function(){//Detail selection list, in the 'Edit' tab, to change the type of detail for the detail "brush"
		objEditor.currentDetail = this.value;
	}
	
	this.radEditPoly.onclick = function(){//Radio button for editing the shape of a polygon
		objEditor.editType = this.value;
	}
	this.radEditSolid.onclick = function(){//Radio button for editing the solidness of a polygon's lines
		objEditor.editType = this.value;
	}
	this.radEditDetails1.onclick = function(){//Radio button for editing the back layer of a polygon's details
		objEditor.selectedDetails.length = 0;
		objEditor.editType = this.value;
		objEditor.nearestDetail = null;
		objEditor.selectedDetails.length = 0;
	}
	this.radEditDetails2.onclick = function(){//Radio button for editing the inside/clipped layer of a polygon's details
		objEditor.selectedDetails.length = 0;
		objEditor.editType = this.value;
		objEditor.nearestDetail = null;
		objEditor.selectedDetails.length = 0;
	}
	this.radEditDetails3.onclick = function(){//Radio button for editing the front layer of a polygon's details
		objEditor.selectedDetails.length = 0;
		objEditor.editType = this.value;
		objEditor.nearestDetail = null;
		objEditor.selectedDetails.length = 0;
	}
	
	
	
	
	
	
	
	this.step = function(){
		var viewMoveX = 0;
		var viewMoveY = 0;
		if( mouse.isHeld(1) ){
			if( mouse.x >= 0 && mouse.y >= 0 && mouse.x < screenWidth && mouse.y < screenHeight ){
				viewMoveX -= mouse.x - mouse.px;
				viewMoveY -= mouse.y - mouse.py;
			}
		}
		if( keyboard.isPressed(cKey) ){
			this.viewX = 0;
			this.viewY = 0;
			this.zoom = 1;
		}
		
		this.zoom *= 1 + mouse.wdelta * 0.1;
		if( Math.abs(this.zoom - 1)<0.06 )
			this.zoom = 1;
		
		this.viewX += screenWidth * 0.5 / this.zoom * mouse.wdelta * 0.1;
		this.viewY += screenHeight * 0.5 / this.zoom * mouse.wdelta * 0.1;
		
		this.viewX += viewMoveX / this.zoom;
		this.viewY += viewMoveY / this.zoom;
		
		var mousex, mousey, mousepx, mousepy;
		mousex = Math.round(mouse.x / this.zoom + this.viewX);
		mousey = Math.round(mouse.y / this.zoom + this.viewY);
		mousepx = Math.round(mouse.px / this.zoom + this.viewX);
		mousepy = Math.round(mouse.py / this.zoom + this.viewY);
		var mouseInView = ( mouse.x >= 0 && mouse.y >= 0 && mouse.x < screenWidth && mouse.y < screenHeight );
		
		if( mouseInView )
			document.getElementById("debugInfo").innerHTML = "ZOOM = " + Math.round(this.zoom*100) + "%      Mouse position: (" + mousex + ", " + mousey + ")";
			
			
		switch(this.toplevelState){
	
			case "create":
				if( mouseInView ){
					if( mouse.isPressed(0) ){
						var obj = this.createObject(this.createType);
						obj.position.x = mousex;
						obj.position.y = mousey;
					}
				}
				break;
			case "moveselect":
				if( mouseInView ){
					//If holding shiftKey, do a rectangle selection of objects when you click and drag the mouse
					if( keyboard.isHeld(shiftKey) ){
						if( mouse.isPressed(0) ){
							this.selRectCornerA = new Point(mousex, mousey);
						}
						if( mouse.isReleased(0) ){
							this.selRectCornerB = new Point(mousex, mousey);
							if( this.selRectCornerA != null ){
								
								var minx = Math.min(this.selRectCornerA.x, this.selRectCornerB.x);
								var miny = Math.min(this.selRectCornerA.y, this.selRectCornerB.y);
								var maxx = Math.max(this.selRectCornerA.x, this.selRectCornerB.x);
								var maxy = Math.max(this.selRectCornerA.y, this.selRectCornerB.y);
								
								//rect-select polygons
								var l = this.polygons.length;
								var l2 = this.selected.length;
								for( var n = 0; n < l; n++){
									var br = false;
									//Check that the polygon isn't already selected
									for(var m = 0; m < l; m++){
										if( this.selected[m] == this.polygons[n] ){
											br = true;
											break;
										}
									}
									if( ! br ){
										var p = this.polygons[n].position;
										if( p.x >= minx && p.y >= miny && p.x < maxx && p.y < maxy ){
											this.selected.push(this.polygons[n]);
										}
									}
								}
								//rect-select objects
								var l = this.objects.length;
								for( var n = 0; n < l; n++){
									var br = false;
									//Check that the object isn't already selected
									for(var m = 0; m < l; m++){
										if( this.selected[m] == this.objects[n] ){
											br = true;
											break;
										}
									}
									if( ! br ){
										var p = this.objects[n].position;
										if( p.x >= minx && p.y >= miny && p.x < maxx && p.y < maxy ){
											this.selected.push(this.objects[n]);
										}
									}
								}
								this.selRectCornerA = null;
							}
						}
					
					} else {
						//Find the polygon or object that is closest to the mouse and within a small distance
						this.nearestObj = null;
						var nearestDist = 99999999;
						var l = this.polygons.length;
						for( var n = 0; n < l; n++){
							var p = this.polygons[n].position;
							var d = (p.x - mousex) * (p.x - mousex) + (p.y - mousey) * (p.y - mousey);
							if( d < (90 * 90)/(this.zoom * this.zoom) && d < nearestDist){
								this.nearestObj = this.polygons[n];
								nearestDist = d;
							}
						}
						var l = this.objects.length;
						for( var n = 0; n < l; n++){
							var p = this.objects[n].position;
							var d = (p.x - mousex) * (p.x - mousex) + (p.y - mousey) * (p.y - mousey);
							if( d < (90 * 90)/(this.zoom * this.zoom) && d < nearestDist){
								this.nearestObj = this.objects[n];
								nearestDist = d;
							}
						}
						
						//If the mouse is pressed, select the nearest object if there is one. If it's too far away, unselect all.
						if( mouse.isPressed(0) ){
							if( this.nearestObj != null ){
								//Make sure the object isn't already selected
								var isSelected = false;
								for(var m = 0; m < l; m++){
									if( this.selected[m] == this.nearestObj ){
										isSelected = true;
										break;
									}
								}
								if( ! isSelected ){
									this.selected.length = 1;
									this.selected[0] = this.nearestObj;
								}
							} else {
								this.selected.length = 0;
							}
						}
						
						//If the mouse is held and dragged, move selected objects
						//If the controlKey is held, move only the origin of selected polygons
						if( mouse.isHeld(0) ){
							if( ! keyboard.isHeld(controlKey) ){
								var l = this.selected.length;
								for(var n = 0; n < l; n++){
									this.selected[n].position.x += mousex - mousepx + viewMoveX;
									this.selected[n].position.y += mousey - mousepy + viewMoveY;
								}
							} else {
								var l = this.selected.length;
								for(var n = 0; n < l; n++){
									if( this.selected[n].type == -1 ){//Only move origin if the object is a polygon
										this.selected[n].position.x += mousex - mousepx + viewMoveX;
										this.selected[n].position.y += mousey - mousepy + viewMoveY;
										//Move the points and details the opposite way to make them keep their position in the level
										var l2 = this.selected[n].points.length;
										for(var m = 0; m < l2; m++){
											this.selected[n].points[m].x -= mousex - mousepx + viewMoveX;
											this.selected[n].points[m].y -= mousey - mousepy + viewMoveY;			
										}
										for(var h = 0; h < 3; h++){
											l2 = this.selected[n].details[h].length;
											for(var m = 0; m < l2; m++){
												this.selected[n].details[h][m].x -= mousex - mousepx + viewMoveX;
												this.selected[n].details[h][m].y -= mousey - mousepy + viewMoveY;
												
											}
										}
									}
								}
							}
						}
						//Re-arrange depth of selected polygons and objects
						if( this.selected.length == 1 ){
							var shift = 0;//How far to shift the selected object
							if( keyboard.isPressed(leftKey) )
								shift = -99999999;
							else if( keyboard.isPressed(rightKey) )
								shift = 99999999;
							if( keyboard.isPressed(downKey) )
								shift = -1;
							else if( keyboard.isPressed(upKey) )
								shift = 1;
							if( shift != 0 ){
								for(var n = 0; n < this.polygons.length; n++){
									if(	this.polygons[n] == this.selected[0] ){
										var o = this.polygons[n];
										this.polygons.splice(n,1);
										var nn = n+shift;
										if( nn < 0 ) 
											nn = 0;
										else if( nn > this.polygons.length )
											nn = this.polygons.length;
										this.polygons.splice(nn,0,o);
										break;
									}
								}
								for(var n = 0; n < this.objects.length; n++){
									if(	this.objects[n] == this.selected[0] ){
										var o = this.objects[n];
										this.objects.splice(n,1);
										var nn = n+shift;
										if( nn < 0 ) 
											nn = 0;
										else if( nn > this.objects.length )
											nn = this.objects.length;
										this.objects.splice(nn,0,o);
										break;
									}
								}
							}
						}
					}
				}
				break;
			case "edit":
				if( mouseInView && this.selected[0].type == -1 ){//Check that the mouse is inside the editor screen, and that the selected object is a polygon(-1)
					if( this.editType == "Details1" || this.editType == "Details2" || this.editType == "Details3" ){//Check if we're in 'Edit Details' mode
						//Find which layer of Details is being edited
						var layer;
						if(this.editType == "Details1")
							layer = 0;
						if(this.editType == "Details2")
							layer = 1;
						if(this.editType == "Details3")
							layer = 2;
						if( keyboard.isHeld(shiftKey) ){//Rectangle selected of details with SHIFT
							if( mouse.isPressed(0) ){
								this.selRectCornerA = new Point(mousex, mousey);
							}
							if( mouse.isReleased(0) ){
								this.selRectCornerB = new Point(mousex, mousey);
								if( this.selRectCornerA != null ){
									
									var minx = Math.min(this.selRectCornerA.x, this.selRectCornerB.x);
									var miny = Math.min(this.selRectCornerA.y, this.selRectCornerB.y);
									var maxx = Math.max(this.selRectCornerA.x, this.selRectCornerB.x);
									var maxy = Math.max(this.selRectCornerA.y, this.selRectCornerB.y);
									
									var l = this.selected[0].details[layer].length;
									var l2 = this.selectedDetails.length;
									for( var n = 0; n < l; n++){
										var br = false;
										for(var m = 0; m < l; m++){
											if( this.selectedDetails[m] == this.selected[0].details[layer][n] ){
												br = true;
												break;
											}
										}
										if( ! br ){
											var p = Point.Add(this.selected[0].position,this.selected[0].details[layer][n]);
											if( p.x >= minx && p.y >= miny && p.x < maxx && p.y < maxy ){
												this.selectedDetails.push(this.selected[0].details[layer][n]);
											}
										}
									}
									this.selRectCornerA = null;
								}
							}
						
						} else {//If not holding shift, edit the details with other keyboard keys
							//Change the properties of the "brush" detail by holding keys and moving the mouse horizontally
							var add = false;
							if( keyboard.isHeld(rKey) ){
								this.currentDetailAngle += (mouse.x - mouse.px) * 0.5;
								add = true;
							} else if( keyboard.isHeld(xKey) ){
								this.currentDetailXscale += (mouse.x - mouse.px) * 0.1;
								add = true;
							} else if( keyboard.isHeld(yKey) ){
								this.currentDetailYscale += (mouse.x - mouse.px) * 0.1;
								add = true;
							} else if( keyboard.isHeld(aKey) ){
								this.currentDetailOpacity += (mouse.x - mouse.px) * 0.01;
								this.currentDetailOpacity = Math.min( Math.max( 0, this.currentDetailOpacity), 1);
								add = true;
							}
							if( add && this.selectedDetails.length == 0 ){//If brush is transformed, and no details are selected, add the brush to the layer of details
								var dtl = this.selected[0].addDetail(layer, this.currentDetail, 
													mousex - this.selected[0].position.x, mousey - this.selected[0].position.y, 
													this.currentDetailXscale, this.currentDetailYscale, 
													this.currentDetailAngle, this.currentDetailOpacity);
								this.selectedDetails.length = 1;
								this.selectedDetails[0] = dtl;
							} else if (this.selectedDetails.length != 0 ){//If a detail is selected, apply the brush transformation to it.
								this.selectedDetails[0].angle = this.currentDetailAngle;
								this.selectedDetails[0].xscale = this.currentDetailXscale;
								this.selectedDetails[0].yscale = this.currentDetailYscale;
								this.selectedDetails[0].opacity = this.currentDetailOpacity;
							}
							
							//If the CTRL key is being held, deselect all details
							if( mouse.isHeld(0) && keyboard.isHeld(controlKey) )
								this.selectedDetails.length = 0
							
							//Find the nearest detail within a distance of 20 from the mouse, if there is one
							this.nearestDetail = null;
							var nearestDist = 999999;
							var l = this.selected[0].details[layer].length;
							for( var n = 0; n < l; n++){
								var p = Point.Add(this.selected[0].position,this.selected[0].details[layer][n]);
								var d = (p.x - mousex) * (p.x - mousex) + (p.y - mousey) * (p.y - mousey);
								if( d < (20 * 20)/(this.zoom * this.zoom) && d < nearestDist){
									this.nearestDetail = this.selected[0].details[layer][n];
									nearestDist = d;
								}
							}
							//If holding CTRL and the mouse, and there is a nearest detail, erase it
							if( keyboard.isHeld(controlKey) ){
								if( mouse.isHeld(0) && this.nearestDetail != null ){
									var l = this.selected[0].details[layer].length;
									for(var n = 0; n < l; n++){
										if( this.nearestDetail == this.selected[0].details[layer][n] )
											this.selected[0].details[layer].splice(n, 1);
									}
									this.selectedDetails.length = 0;
									 
									this.nearestDetail = null;
								}
							} else {//If the CTRL key is not held
								if( mouse.isPressed(0) ){//If the mouse is pressed
									if( this.nearestDetail != null ){//If there is a nearest detail
										var br = false;
										for(var m = 0; m < l; m++){
											if( this.selectedDetails[m] == this.nearestDetail ){
												br = true;
												break;
											}
										}
										if( ! br ){//If the nearest detail isn't selected, make only the nearest detail selected
											this.selectedDetails.length = 1;
											this.selectedDetails[0] = this.nearestDetail;
											this.currentDetailAngle = this.selectedDetails[0].angle;
											this.currentDetailXscale = this.selectedDetails[0].xscale;
											this.currentDetailYscale = this.selectedDetails[0].yscale;
											this.currentDetailOpacity = this.selectedDetails[0].opacity;
										}
									} else {//If there isn't a detail close enough
										if( this.selectedDetails.length == 0 ){//Add a new detail at mouse position if no details are selected
											var dtl = this.selected[0].addDetail(layer, this.currentDetail, 
																mousex - this.selected[0].position.x, mousey - this.selected[0].position.y, 
																this.currentDetailXscale, this.currentDetailYscale, 
																this.currentDetailAngle, this.currentDetailOpacity);
											this.selectedDetails.length = 1;
											this.selectedDetails[0] = dtl;
										} else //If there are details selected, deselect all
											this.selectedDetails.length = 0;
									}
								}
								if( mouse.isHeld(0) ){//If the mouse is held, drag selected details with the mouse
									var l = this.selectedDetails.length;
									for(var n = 0; n < l; n++){
										this.selectedDetails[n].x += mousex - mousepx + viewMoveX;
										this.selectedDetails[n].y += mousey - mousepy + viewMoveY;
									}
								}
							}
							//Re-arrange detail depths
							if( this.selectedDetails.length == 1 ){
								var selDetLayer = this.selected[0].details[layer];
							
								var shift = 0;
								if( keyboard.isPressed(leftKey) )
									shift = -selDetLayer.length;
								else if( keyboard.isPressed(rightKey) )
									shift = selDetLayer.length;
								if( keyboard.isPressed(downKey) )
									shift = -1;
								else if( keyboard.isPressed(upKey) )
									shift = 1;
								if( shift != 0 ){
									for(var n = 0; n < selDetLayer.length; n++){
										if(	selDetLayer[n] == this.selectedDetails[0] ){
											var o = selDetLayer[n];
											selDetLayer.splice(n,1);
											var nn = n+shift;
											if( nn < 0 ) 
												nn = 0;
											else if( nn > selDetLayer.length )
												nn = selDetLayer.length;
											selDetLayer.splice(nn,0,o);
											break;
										}
									}
								}
							}
						}
						
					} else {//If not editing details
						if( this.selectedPoint == null ){
							this.nearestPoint = null;
							this.nearestLine = null;
							var nearestDist = 999999;
							
							var points = this.selected[0].points;
							var l = points.length;
							if( this.editType == "Polygon" )//If editing the polygon shape, find the nearest of it's corner points, if it is close enough
								for( var n = 0; n < l; n++){
									var p1 = new Point(points[n].x + this.selected[0].position.x, points[n].y + this.selected[0].position.y);
									var d = (p1.x - mousex) * (p1.x - mousex) + (p1.y - mousey) * (p1.y - mousey);
									if( d < (30 * 30)/(this.zoom * this.zoom) && d < nearestDist){
										this.nearestPoint = n;
										nearestDist = d;
									}
								}
							if( nearestDist > 10 * 10  && ( ! keyboard.isHeld(controlKey) || this.editType == "Solid" ) )//if the nearest point isn't too close, or we --
								//-- didn't try to find one, and the CTRL key is either not held, or we're editing the solidness of the polygon, find the --
								//-- nearest line if it isn't too far away, and "forget" the nearest point
								for( var n = 0; n < l; n++){
									var p1 = new Point(points[n].x + this.selected[0].position.x, points[n].y + this.selected[0].position.y);
									var p2 = new Point(points[(n + 1) % l].x + this.selected[0].position.x, points[(n + 1) % l].y + this.selected[0].position.y);
									var lp = nearestPointOnLine(mousex, mousey, p1.x, p1.y, p2.x, p2.y);
									d = (lp.x - mousex) * (lp.x - mousex) + (lp.y - mousey) * (lp.y - mousey);
									if( d < (20 * 20)/(this.zoom * this.zoom) && d < nearestDist){
										this.nearestPoint = null;
										this.nearestLine = n;
										nearestDist = d;
									}
								}
						}
						if( mouse.isPressed(0) || ( mouse.isHeld(0) && this.editType == "Solid" ) ){//If the mouse is pressed, or held while we're editing solid
							if( this.nearestPoint != null ){//If there is a nearest point
								if( keyboard.isHeld(controlKey) && this.selected[0].points.length > 3 ){//If CTRL is held and th polygon has more than 3 points, delete the nearest point
									this.selected[0].points.splice(this.nearestPoint, 1); 
									this.nearestPoint = null;
								} else this.selectedPoint = this.selected[0].points[this.nearestPoint];//Otherwise, select/grab the nearest point
							} else if( this.nearestLine != null ){//If there is a nearest line
								if( this.editType == "Solid"){//If editing the solidness of polygon lines and the mouse is held, set the 'solid property' --
									//-- of the first endpoint of the nearest line to 'true' if CTRL is not held, and 'false' if it is held.
									this.selected[0].points[this.nearestLine].solid = (! keyboard.isHeld(controlKey));
								} else {//If not editing solid, add a new point at the mouse position, splitting the nearest line in two parts
									var p = new Point(mousex - this.selected[0].position.x, mousey - this.selected[0].position.y);
									p.solid = this.selected[0].points[this.nearestLine].solid;
									this.selected[0].points.splice((this.nearestLine + 1) % this.selected[0].points.length, 0, p); 
									this.selectedPoint = p;
								}
							} else this.selectedPoint = null;//If there isn't a nearest point, and no nearest line, deselect an eventually selected point
						}
						if( mouse.isHeld(0) ){//If the mouse is held and there are selected points, drag them with the mouse
							if( this.selectedPoint != null ){
								this.selectedPoint.x += mousex - mousepx + viewMoveX;
								this.selectedPoint.y += mousey - mousepy + viewMoveY;
							}
						}
						if( mouse.isReleased(0) ){//Let go of the selected/held point when the mouse is released
							this.selectedPoint = null;
						}
					}
				} else {//Deselect an eventually selected polygon point if the mouse is outside the view
					objEditor.nearestPoint = null;
					objEditor.nearestLine = null;
					objEditor.selectedPoint = null;
				}
				break;
		}
	}
	this.draw = function(){
		
		//Calculate view transformed mouse coordinates
		var mousex, mousey, mousepx, mousepy;
		mousex = mouse.x / this.zoom + this.viewX;
		mousey = mouse.y / this.zoom + this.viewY;
		mousepx = mouse.px / this.zoom + this.viewX;
		mousepy = mouse.py / this.zoom + this.viewY;
		
		//Draw the background
		context.fillStyle = 'rgb(255, 150, 255)';
		context.fillRect(0, 0, screenWidth, screenHeight);
		
		context.save();
		context.scale(this.zoom, this.zoom);
		context.translate(-this.viewX, -this.viewY);
		
		//Draw polygons with their texture and Details
		var l = this.polygons.length;
		for(var n = 0; n < l; n++){
			if(	this.polygons[n].visible )
				this.polygons[n].draw();
			else this.polygons[n].drawPolygon(context, null, null);
			if( this.polygons[n].jumpThrough )
				this.polygons[n].drawPolygon(context, null, context.createPattern(texJumpThrough.img,"repeat"));
		}
		
		//Draw objects as sprites
		l = this.objects.length;
		for(var n = 0; n < l; n++){
			var obj = this.objects[n];
			drawSprite(context, objectTypes[obj.type].spr, 0, obj.position.x, obj.position.y, obj.xscale, obj.yscale, obj.angle);
		}
		//Draw origin circle of objects
		for(var n = 0; n < l; n++){
			context.beginPath();
			context.arc(this.objects[n].position.x, this.objects[n].position.y, 10, 0, 2 * Math.PI);
			context.strokeStyle = "white";
			context.lineWidth = 3;
			context.stroke();
			context.strokeStyle = "black";
			context.lineWidth = 2;
			context.stroke();
		}
		//Draw origin circle of polygons
		l = this.polygons.length;
		for(var n = 0; n < l; n++){
			context.beginPath();
			context.arc(this.polygons[n].position.x, this.polygons[n].position.y, 10, 0, 2 * Math.PI);
			context.strokeStyle = "white";
			context.lineWidth = 3;
			context.stroke();
			context.strokeStyle = "black";
			context.lineWidth = 2;
			context.stroke();
		}
		
		//If in object selection mode
		if( this.toplevelState == "moveselect"){
			//draw a white origin circle at the object closest to the mouse
			if( this.nearestObj != null && ! mouse.isHeld(0) ){
				context.beginPath();
				context.arc(this.nearestObj.position.x, this.nearestObj.position.y, 14, 0, 2 * Math.PI);
				context.strokeStyle = "white";
				context.lineWidth = 2;
				context.stroke();
				if( this.nearestObj.type == -1 )
						this.nearestObj.drawPolygon(context, 0, 0, null, "white");
			}
			//draw a white selection rectangle if holding shift and selecting
			if( keyboard.isHeld(shiftKey) && this.selRectCornerA != null){
				context.strokeStyle = "white";
				context.strokeRect(this.selRectCornerA.x, this.selRectCornerA.y, mousex - this.selRectCornerA.x,  mousey - this.selRectCornerA.y);
			}
		}
		
		//Draw yellow origin circles at selected objects
		var l = this.selected.length;
		for(var n = 0; n < l; n++){
			
			context.beginPath();
			context.arc(this.selected[n].position.x, this.selected[n].position.y, 10, 0, 2 * Math.PI);
			context.strokeStyle = "yellow";
			context.lineWidth = 2;
			context.stroke();
			//Draw a dotted pattern on selected polygons to make them stand out
			if( this.selected[n].type == -1 ){
				this.selected[n].drawPolygon(context, 0, 0, texSelected, null);
			}
		}
		
		if( this.toplevelState == "edit" ){
			if(this.selected.length > 0){

				if( this.selected[0].type == -1 ){
					//Here things are drawn to show the properties of the currently selected polygons
					var l = this.selected[0].points.length;
					
					//Draw solid lines thick and black
					context.save();
					context.translate(this.selected[0].position.x, this.selected[0].position.y);
						context.beginPath();
						for(var n = 0; n < l; n++){
							if( this.selected[0].points[n].solid ){
								context.moveTo(this.selected[0].points[n].x, this.selected[0].points[n].y);
								context.lineTo(this.selected[0].points[(n + 1) % l].x, this.selected[0].points[(n + 1) % l].y);
							}
						}
						context.strokeStyle = "black";
						context.lineWidth = 5;
						context.stroke();
					context.restore();
					
					//Draw white outline
					if( this.selected[0].jumpThrough )
						this.selected[0].drawPolygon(context, null, context.createPattern(texJumpThroughInv.img,"repeat"));//Dotted line to signify that the polygon is 'jumpThrough'
					else
						this.selected[0].drawPolygon(context, null, "white");
				
					//Draw small white circles at points
					context.save();
					context.translate(this.selected[0].position.x, this.selected[0].position.y);
						for(var n = 0; n < l; n++){
							
							context.beginPath();
							context.arc(this.selected[0].points[n].x, this.selected[0].points[n].y, 2, 0, 2 * Math.PI);
							context.strokeStyle = "white";
							context.lineWidth = 2;
							context.stroke();
						}
					context.restore();
					
					if( this.editType == "Polygon" ){//If editing the polygon structure
						if( ! mouse.isHeld(0) ){
							context.save();
							context.translate(this.selected[0].position.x, this.selected[0].position.y);
							if( this.nearestPoint != null ){//If there is a nearest point
							
								//If CTRL is held, draw a red line showing how the polygon will look with the nearest point omitted
								//If not holding CTRL, highlight the nearest point to show that it can be grabbed
							
								context.beginPath();
								
								if( keyboard.isHeld(controlKey) ){
									var n1 = (this.nearestPoint + 1) % this.selected[0].points.length;
									var n2 = (this.nearestPoint - 1 + this.selected[0].points.length) % this.selected[0].points.length;
									context.moveTo(this.selected[0].points[n1].x, this.selected[0].points[n1].y);
									context.lineTo(this.selected[0].points[n2].x, this.selected[0].points[n2].y);
									context.lineWidth = 3;
								} else {
									context.arc(this.selected[0].points[this.nearestPoint].x, this.selected[0].points[this.nearestPoint].y, 4, 0, 2 * Math.PI);
									context.lineWidth = 5;
								}
								context.strokeStyle = "black";
								
								context.stroke();
								if( keyboard.isHeld(controlKey) ){
									context.strokeStyle = "red";
									context.lineWidth = 1;
								} else {
									context.strokeStyle = "white";
									context.lineWidth = 2;
								}
								
								
								context.stroke();
							} else if( this.nearestLine != null ){//Draw lines to show how the nearest line can be split in two
								context.beginPath();
								context.moveTo(this.selected[0].points[this.nearestLine].x, this.selected[0].points[this.nearestLine].y);
								var n = (this.nearestLine + 1) % this.selected[0].points.length;
								context.lineTo(mousex - this.selected[0].position.x, mousey - this.selected[0].position.y);
								context.lineTo(this.selected[0].points[n].x, this.selected[0].points[n].y);
								context.strokeStyle = "black";
								context.lineWidth = 3;
								context.stroke();
								context.strokeStyle = "white";
								context.lineWidth = 2;
								context.stroke();
							}
							context.restore();
						}
					} else if( this.editType == "Solid" ){//If editing solid, highlight the nearest line with blue
						context.save();
						context.translate(this.selected[0].position.x, this.selected[0].position.y);
						if( this.nearestLine != null ){
							context.beginPath();
							context.moveTo(this.selected[0].points[this.nearestLine].x, this.selected[0].points[this.nearestLine].y);
							var n = (this.nearestLine + 1) % this.selected[0].points.length;
							context.lineTo(this.selected[0].points[n].x, this.selected[0].points[n].y);
							context.strokeStyle = "blue";
							context.lineWidth = 1;
							context.stroke();
						}
						context.restore();
						
					}
				}
			
				if( (this.editType == "Details1" || this.editType == "Details2" || this.editType == "Details3") ){//If in 'edit details' mode
					var layer;
					if(this.editType == "Details1")
						layer = 0;
					if(this.editType == "Details2")
						layer = 1;
					if(this.editType == "Details3")
						layer = 2;
					//Draw white selection rectangle when holding shift
					if( keyboard.isHeld(shiftKey) && this.selRectCornerA != null){
						context.strokeStyle = "white";
						context.strokeRect(this.selRectCornerA.x, this.selRectCornerA.y, mousex - this.selRectCornerA.x,  mousey - this.selRectCornerA.y);
					}
					var l2 = this.selected[0].details[layer].length;
					//Draw red dots at origin of all details in the current layer
					context.save();
					context.translate(this.selected[0].position.x, this.selected[0].position.y);
						
						for(var m = 0; m < l2; m++){
							var detail = this.selected[0].details[layer][m];
							context.beginPath();
							context.arc(detail.x, detail.y, 1, 0, 2 * Math.PI);
							context.strokeStyle = "red";
							context.lineWidth = 2;
							context.stroke();
							context.beginPath();
							context.arc(detail.x, detail.y, 2, 0, 2 * Math.PI);
							context.strokeStyle = "black";
							context.stroke();
						}
					context.restore();
					
					//Draw the nearest detail's origin highlighted white
					if( this.nearestDetail != null ){
						var l2 = this.selectedDetails.length;
						context.beginPath();
						context.arc(this.nearestDetail.x + this.selected[0].position.x, this.nearestDetail.y + this.selected[0].position.y, 8, 0, 2 * Math.PI);
						context.strokeStyle = "white";
						context.stroke();
					}
					
					if( this.selectedDetails.length == 0 ){//If no details are selected, draw the detail that can be placed by the mouse
						if( (! keyboard.isHeld(shiftKey) || this.selRectCornerA == null) && ! keyboard.isHeld(controlKey) && this.nearestDetail == null ){
							var dtl = resources.details[this.currentDetail];
							context.save();
							context.globalAlpha = this.currentDetailOpacity;
							context.translate(mousex, mousey);
							context.rotate(this.currentDetailAngle * Math.PI / 180);
							context.scale(this.currentDetailXscale, this.currentDetailYscale);
							context.drawImage(dtl.img, -dtl.originX, -dtl.originY);
							context.restore();
						}
					} else {
						//Highlight selected details with aqua color
						var l2 = this.selectedDetails.length;
						context.save();
						context.translate(this.selected[0].position.x, this.selected[0].position.y);
						
						for(var m = 0; m < l2; m++){
							var detail = this.selectedDetails[m];
							context.beginPath();
							context.arc(detail.x, detail.y, 3, 0, 2 * Math.PI);
							context.fillStyle = "aqua";
							context.fill();
							context.beginPath();
							context.arc(detail.x, detail.y, 5, 0, 2 * Math.PI);
							context.strokeStyle = "black";
							context.lineWidth = 2;
							context.stroke();
						}
						context.restore();
					}
				}
			}
		}
		
		context.restore();
	}
};