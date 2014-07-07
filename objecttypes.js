/*
	'objectTypes' is a list of different kinds of objects that are place-able in the level editor.
	
	The list is also used by the 'polygonlevel' object to dynamically create an array for each kind of these objects, to get easy acess to each instance in a level.
	
	The desired objects are added to the list with the addObjectType() function.
	
	The object types can have various properties that should be editable for each individual copy of the object in the editor,
	in addition to it's position in the level. These are added with the addObjectTypeProperty() function.
*/

var objectTypes = [];
	
/*	
**  addObjectType(name, onlyOne, mustExist, sprite, constr);
**
**  Add an object type to the list.
**
**  'name' should be a string containing the name of the object type
**
**  'onlyOne' should be a boolean, specifying whether only one, or multiple instances of it's (object)type can exist. 
**  If set to 'true', newly created instances will overwrite the existing one, in practice just relocating it and resetting it's properties.
**
**  'mustExist' should be a boolean, specifying whether an instance of the object must exist at any time, in the editor.
**  If set to 'true', an instance is existing to begin with, and you cannot delete the last remaining instance of it's type.
**
**	'sprite' is the sprite that should represent the object in the editor.
**
**	'constr' is the constructor of the object type. 
**
**  Returns the object type.
*/
function addObjectType(name, onlyOne, mustExist, sprite, constr){
	var objType = {
		name: name,
		onlyOne: onlyOne,
		mustExist: mustExist,
		properties: [],
		spr: sprite,
		constr: constr
	};
	
	objectTypes.push(objType);
	return objType;
}
	
/*	
**  Add a property to an object type.
**
**  'objType' is the object type to give add the property to.
**
**  'propName' is the name of the property, and 'propDesc' a description of the property.
**
**	It will get a simple value input element in the editor.
**
**  'def' is the default value of the property.
**  
*/
function addObjectTypeProperty(objType, propName, propDesc, def){
	var a = {
		name: propName,
		description: propDesc,
		def: def
	};
	
	objType.properties.push(a);
	
	return a;
}