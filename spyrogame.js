//Variables:
//General:
var canvas = document.getElementById("gamecanvas"), context = canvas.getContext("2d");
var gameLoop, screenWidth, screenHeight;

//Keyboard keys
var leftKey, upKey, rightKey, downKey, aKey, sKey, spaceKey, shiftKey, controlKey;


//Objects
var objTimer = null;
var objLevel = null;
var objEditor = null;
var objSpyro = null;
var objSparx = null;
var objCamera = null;
var gravity = 1.5;

//Sprites
var sprSpyro = resources.addSprite("graphics/sprSpyro.png", 2, 64, 64, 32, 32, 0);
var sprSpyroHurt = resources.addSprite("graphics/sprSpyroHurt.png", 2, 64, 64, 32, 32, 0);
var sprEnemy = resources.addSprite("graphics/sprEnemy.png", 1, 64, 64, 32, 32, 0);
var sprSparx = resources.addSprite("graphics/sprSparx.png", 6, 32, 32, 16, 16, 0);
//Sounds
var sndRumble = resources.addSound("sounds/rumble.ogg");
var sndJump = resources.addSound("sounds/jump.ogg");
//Textures
var texDesert = resources.addTexture("graphics/texDesert.png");
var texDesert2 = resources.addTexture("graphics/texDesert2.png");
var texSelected = resources.addTexture("graphics/texSelected.png");
var texJumpThrough = resources.addTexture("graphics/texJumpThrough.png");
var texJumpThroughInv = resources.addTexture("graphics/texJumpThroughInv.png");
//Details
var dtlCactus = resources.addDetail("graphics/dtlCactus1.png", 24, 32);
var dtlDesertTower = resources.addDetail("graphics/dtlDesertTower.png", 28, 55);
var dtlShadow1 = resources.addDetail("graphics/dtlShadow1.png", 40, 40);
var dtlShadow2 = resources.addDetail("graphics/dtlShadow2.png", 40, 40);
var dtlSandTop = resources.addDetail("graphics/dtlSandTop.png", 32, 8);
//Levels
var levelString = [];
levelString[0] = "@Polygon{x:1544£y:9£jumpThrough:true£visible:true£bgColor:#3e250d£texture:texDesert£textureOpacity:1.000£^points{^point{x:-166.959£y:-8.348£solid:true£} ^point{x:-110.842£y:-21.565£solid:true£} ^point{x:-27.595£y:-31.595£solid:false£} ^point{x:-2.585£y:-63.987£solid:false£} ^point{x:-11.585£y:-105.987£solid:true£} ^point{x:49.913£y:-114.450£solid:true£} ^point{x:143.538£y:-119.928£solid:false£} ^point{x:115.415£y:-59.987£solid:false£} ^point{x:112.415£y:43.013£solid:false£} ^point{x:142.843£y:104.813£solid:false£} ^point{x:-138.205£y:70.030£solid:false£} } ^details1{^detail{x:86£y:-164£dtl:dtlDesertTower£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } ^details2{^detail{x:-86£y:-39£dtl:dtlShadow1£xscale:2.400£yscale:1.000£angle:-11.000£opacity:1.000£} ^detail{x:-1£y:79£dtl:dtlShadow1£xscale:6.000£yscale:2.000£angle:13.500£opacity:0.710£} ^detail{x:62£y:-121£dtl:dtlShadow1£xscale:2.500£yscale:-1.000£angle:-6.500£opacity:0.710£} ^detail{x:31£y:-110£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-0.500£opacity:1.000£} ^detail{x:100£y:-116£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-7.500£opacity:1.000£} ^detail{x:-127£y:-16£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-7.500£opacity:1.000£} ^detail{x:-74£y:-24£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-11.000£opacity:1.000£} } ^details3{} } @Polygon{x:1549£y:148£jumpThrough:true£visible:true£bgColor:#241b11£texture:texDesert£textureOpacity:1.000£^points{^point{x:-148.456£y:-24.986£solid:false£} ^point{x:-188.328£y:-90.555£solid:true£} ^point{x:-139.460£y:-95.673£solid:true£} ^point{x:-48.210£y:-86.677£solid:true£} ^point{x:85.452£y:-50.691£solid:true£} ^point{x:164.696£y:-42.623£solid:false£} ^point{x:162.809£y:34.754£solid:false£} ^point{x:-138.546£y:100.587£solid:false£} } ^details1{^detail{x:121£y:-75£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-61£y:-117£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } ^details2{^detail{x:2£y:57£dtl:dtlShadow1£xscale:5.700£yscale:1.900£angle:-14.500£opacity:0.730£} ^detail{x:-6£y:-98£dtl:dtlShadow1£xscale:5.700£yscale:1.900£angle:1.500£opacity:0.730£} ^detail{x:-153£y:-89£dtl:dtlSandTop£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-72£y:-82£dtl:dtlSandTop£xscale:1.700£yscale:1.500£angle:9.500£opacity:1.000£} ^detail{x:31£y:-63£dtl:dtlSandTop£xscale:1.700£yscale:1.500£angle:12.500£opacity:1.000£} ^detail{x:108£y:-50£dtl:dtlSandTop£xscale:1.700£yscale:1.500£angle:5.000£opacity:1.000£} } ^details3{} } @Polygon{x:1527£y:236£jumpThrough:true£visible:true£bgColor:#1f1710£texture:texDesert£textureOpacity:1.000£^points{^point{x:-163.237£y:119.342£solid:false£} ^point{x:-152.263£y:50.754£solid:false£} ^point{x:-151.342£y:-29.717£solid:true£} ^point{x:8.230£y:-57.613£solid:true£} ^point{x:105.624£y:-89.163£solid:true£} ^point{x:204.390£y:-83.676£solid:false£} ^point{x:187.929£y:-10.974£solid:false£} ^point{x:237.761£y:159.583£solid:false£} ^point{x:-186.557£y:222.672£solid:false£} } ^details1{^detail{x:-114£y:-71£dtl:dtlCactus1£xscale:-1.500£yscale:1.200£angle:-12.500£opacity:1.000£} } ^details2{^detail{x:-93£y:199£dtl:dtlShadow1£xscale:5.400£yscale:2.900£angle:-1.000£opacity:0.580£} ^detail{x:91£y:163£dtl:dtlShadow1£xscale:5.400£yscale:2.900£angle:-15.000£opacity:0.580£} ^detail{x:-10£y:-75£dtl:dtlShadow1£xscale:5.400£yscale:2.900£angle:-15.000£opacity:0.580£} ^detail{x:145£y:-89£dtl:dtlShadow1£xscale:2.700£yscale:1.300£angle:-15.000£opacity:0.580£} ^detail{x:-67£y:-40£dtl:dtlSandTop£xscale:2.700£yscale:1.300£angle:-5.000£opacity:1.000£} ^detail{x:67£y:-66£dtl:dtlSandTop£xscale:2.000£yscale:1.300£angle:-18.000£opacity:1.000£} ^detail{x:167£y:-84£dtl:dtlSandTop£xscale:1.400£yscale:1.100£angle:-3.500£opacity:1.000£} } ^details3{} } @Polygon{x:2949£y:250£jumpThrough:false£visible:true£bgColor:#111224£texture:texDesert£textureOpacity:0.350£^points{^point{x:-394.901£y:52.633£solid:false£} ^point{x:-391.392£y:-75.441£solid:false£} ^point{x:-407.449£y:-235.304£solid:false£} ^point{x:278.802£y:-354.396£solid:false£} ^point{x:358.325£y:133.127£solid:false£} ^point{x:-433.345£y:110.950£solid:false£} } ^details1{} ^details2{^detail{x:-30£y:68£dtl:dtlShadow2£xscale:11.000£yscale:2.200£angle:-3.500£opacity:0.740£} ^detail{x:-46£y:-225£dtl:dtlShadow2£xscale:11.000£yscale:2.200£angle:-186.000£opacity:0.660£} ^detail{x:100£y:-104£dtl:dtlShadow2£xscale:11.000£yscale:7.200£angle:-464.500£opacity:0.720£} } ^details3{} } @Polygon{x:1497£y:462£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-1704.075£y:328.662£solid:true£} ^point{x:-1704.176£y:-550.634£solid:true£} ^point{x:-1495.874£y:-557.409£solid:true£} ^point{x:-1438.295£y:-562.489£solid:true£} ^point{x:-1390.877£y:-486.281£solid:true£} ^point{x:-1365.474£y:-427.008£solid:true£} ^point{x:-1406.118£y:-347.413£solid:true£} ^point{x:-1392.570£y:-296.608£solid:true£} ^point{x:-1402.731£y:-210.239£solid:true£} ^point{x:-1242.801£y:-168.338£solid:true£} ^point{x:-1101.287£y:-183.143£solid:true£} ^point{x:-984.434£y:-193.304£solid:true£} ^point{x:-872.663£y:-183.143£solid:true£} ^point{x:-684.683£y:-162.821£solid:true£} ^point{x:-555.977£y:-164.514£solid:true£} ^point{x:-472.995£y:-179.756£solid:true£} ^point{x:-364.610£y:-259.351£solid:true£} ^point{x:-395.093£y:-174.676£solid:true£} ^point{x:-378.158£y:-81.533£solid:true£} ^point{x:-357.836£y:-44.275£solid:true£} ^point{x:-246.065£y:-29.034£solid:true£} ^point{x:-105.503£y:-37.501£solid:true£} ^point{x:51.993£y:-37.501£solid:true£} ^point{x:179.006£y:-71.371£solid:true£} ^point{x:316.180£y:-157.740£solid:true£} ^point{x:416.097£y:-167.901£solid:true£} ^point{x:622.705£y:-164.514£solid:true£} ^point{x:817.459£y:-152.660£solid:true£} ^point{x:924.150£y:-128.951£solid:true£} ^point{x:1259.465£y:-106.935£solid:true£} ^point{x:1427.122£y:-113.709£solid:true£} ^point{x:1625.263£y:-101.855£solid:true£} ^point{x:1782.759£y:-113.709£solid:true£} ^point{x:1737.034£y:-435.476£solid:true£} ^point{x:1667.600£y:-487.975£solid:true£} ^point{x:1518.572£y:-511.684£solid:true£} ^point{x:1438.977£y:-511.684£solid:true£} ^point{x:1345.834£y:-498.136£solid:true£} ^point{x:1154.467£y:-460.879£solid:true£} ^point{x:1081.646£y:-415.154£solid:true£} ^point{x:1057.937£y:-332.172£solid:true£} ^point{x:1008.825£y:-332.172£solid:true£} ^point{x:1013.906£y:-399.912£solid:true£} ^point{x:1122.291£y:-604.827£solid:true£} ^point{x:1063.018£y:-689.502£solid:true£} ^point{x:1054.550£y:-762.323£solid:true£} ^point{x:1118.904£y:-811.435£solid:true£} ^point{x:1057.937£y:-857.160£solid:true£} ^point{x:1093.501£y:-948.609£solid:true£} ^point{x:1835.258£y:-891.030£solid:true£} ^point{x:1899.292£y:252.991£solid:true£} } ^details1{^detail{x:-830£y:-205£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-1192£y:-201£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:9£y:-62£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:459£y:-192£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:725£y:-184£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:898£y:-159£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } ^details2{^detail{x:1314£y:-435£dtl:dtlShadow1£xscale:7.000£yscale:4.200£angle:0.000£opacity:1.000£} ^detail{x:1537£y:-447£dtl:dtlShadow1£xscale:7.000£yscale:4.200£angle:0.000£opacity:1.000£} ^detail{x:1161£y:-342£dtl:dtlShadow1£xscale:3.100£yscale:4.200£angle:0.000£opacity:1.000£} ^detail{x:1710£y:-299£dtl:dtlShadow1£xscale:3.200£yscale:7.000£angle:-13.500£opacity:1.000£} ^detail{x:1596£y:-110£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:1334£y:-110£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:1143£y:-123£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:958£y:-142£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:771£y:-176£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:503£y:-199£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:168£y:-107£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:-16.500£opacity:1.000£} ^detail{x:-210£y:-66£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:4.500£opacity:1.000£} ^detail{x:-358£y:-135£dtl:dtlShadow1£xscale:3.000£yscale:1.900£angle:89.500£opacity:1.000£} ^detail{x:-1369£y:-340£dtl:dtlShadow1£xscale:3.000£yscale:1.900£angle:89.500£opacity:1.000£} ^detail{x:-1342£y:-217£dtl:dtlShadow1£xscale:3.000£yscale:1.900£angle:30.000£opacity:1.000£} ^detail{x:-663£y:-196£dtl:dtlShadow1£xscale:6.300£yscale:1.900£angle:3.500£opacity:1.000£} ^detail{x:-1030£y:-208£dtl:dtlShadow1£xscale:6.300£yscale:1.900£angle:-2.000£opacity:1.000£} ^detail{x:549£y:162£dtl:dtlShadow2£xscale:59.900£yscale:5.900£angle:-2.000£opacity:1.000£} ^detail{x:1033£y:-600£dtl:dtlShadow1£xscale:3.600£yscale:3.700£angle:0.000£opacity:1.000£} ^detail{x:1066£y:-817£dtl:dtlShadow1£xscale:3.600£yscale:1.200£angle:0.000£opacity:1.000£} ^detail{x:1667£y:-103£dtl:dtlSandTop£xscale:3.600£yscale:2.200£angle:-5.000£opacity:1.000£} ^detail{x:1438£y:-95£dtl:dtlSandTop£xscale:3.600£yscale:2.200£angle:1.000£opacity:1.000£} ^detail{x:1211£y:-98£dtl:dtlSandTop£xscale:3.600£yscale:2.200£angle:1.000£opacity:1.000£} ^detail{x:988£y:-111£dtl:dtlSandTop£xscale:3.600£yscale:2.200£angle:4.500£opacity:1.000£} ^detail{x:792£y:-136£dtl:dtlSandTop£xscale:3.600£yscale:2.500£angle:8.500£opacity:1.000£} ^detail{x:568£y:-154£dtl:dtlSandTop£xscale:4.300£yscale:2.700£angle:1.000£opacity:1.000£} ^detail{x:381£y:-149£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-1.500£opacity:1.000£} ^detail{x:251£y:-108£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-26.500£opacity:1.000£} ^detail{x:-284£y:-29£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:3.000£opacity:1.000£} ^detail{x:-143£y:-29£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-2.500£opacity:1.000£} ^detail{x:0£y:-33£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-2.500£opacity:1.000£} ^detail{x:125£y:-56£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-12.500£opacity:1.000£} ^detail{x:-1330£y:-190£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:21.000£opacity:1.000£} ^detail{x:-1194£y:-170£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-4.000£opacity:1.000£} ^detail{x:-1050£y:-179£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-4.000£opacity:1.000£} ^detail{x:-905£y:-178£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:4.000£opacity:1.000£} ^detail{x:-762£y:-167£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:4.000£opacity:1.000£} ^detail{x:-586£y:-168£dtl:dtlSandTop£xscale:3.400£yscale:2.400£angle:-4.500£opacity:1.000£} ^detail{x:-424£y:-221£dtl:dtlSandTop£xscale:2.300£yscale:2.400£angle:-37.000£opacity:1.000£} } ^details3{} } @Spyro[x:825£y:254£] @Enemy[x:594£y:194£gemDrop:5£] @Enemy[x:1263£y:198£gemDrop:5£] @Enemy[x:2485£y:271£gemDrop:5£] @Enemy[x:1263£y:198£gemDrop:5£] @Enemy[x:2485£y:271£gemDrop:5£]";
levelString[1] = "@Polygon{x:437£y:121£jumpThrough:true£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-118.000£y:-16.000£solid:false£} ^point{x:-133.000£y:-62.000£solid:true£} ^point{x:-35.000£y:-54.000£solid:true£} ^point{x:6.000£y:-38.000£solid:true£} ^point{x:74.000£y:-36.000£solid:false£} ^point{x:95.000£y:16.000£solid:false£} ^point{x:-120.000£y:28.000£solid:false£} } ^details1{} ^details2{^detail{x:-13£y:-57£dtl:dtlShadow1£xscale:5.200£yscale:1.000£angle:5.500£opacity:0.800£} ^detail{x:-78£y:-57£dtl:dtlSandTop£xscale:1.700£yscale:1.000£angle:4.500£opacity:1.000£} ^detail{x:38£y:-36£dtl:dtlSandTop£xscale:1.100£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-16£y:-44£dtl:dtlSandTop£xscale:1.100£yscale:1.000£angle:18.500£opacity:1.000£} ^detail{x:-8£y:16£dtl:dtlShadow1£xscale:3.600£yscale:1.000£angle:-1.000£opacity:0.800£} } ^details3{} } @Polygon{x:403£y:184£jumpThrough:true£visible:true£bgColor:#000000£texture:texDesert£textureOpacity:1.000£^points{^point{x:-130.000£y:47.000£solid:false£} ^point{x:-119.000£y:-35.000£solid:true£} ^point{x:19.000£y:-55.000£solid:true£} ^point{x:145.000£y:-54.000£solid:false£} ^point{x:155.000£y:30.000£solid:false£} } ^details1{} ^details2{^detail{x:4£y:-53£dtl:dtlShadow1£xscale:5.100£yscale:1.000£angle:-2.000£opacity:0.790£} ^detail{x:78£y:-54£dtl:dtlSandTop£xscale:2.100£yscale:1.000£angle:-3.000£opacity:1.000£} ^detail{x:-50£y:-42£dtl:dtlSandTop£xscale:2.100£yscale:1.000£angle:-6.500£opacity:1.000£} ^detail{x:40£y:4£dtl:dtlShadow2£xscale:4.400£yscale:0.600£angle:-3.500£opacity:0.900£} } ^details3{} } @Polygon{x:355£y:281£jumpThrough:false£visible:true£bgColor:#000000£texture:texDesert£textureOpacity:1.000£^points{^point{x:-228.000£y:-92.000£solid:true£} ^point{x:-161.000£y:-92.000£solid:true£} ^point{x:-84.000£y:-78.000£solid:true£} ^point{x:65.000£y:-73.000£solid:true£} ^point{x:165.000£y:-82.000£solid:true£} ^point{x:192.000£y:-93.000£solid:true£} ^point{x:251.000£y:-94.000£solid:true£} ^point{x:249.000£y:9.000£solid:true£} ^point{x:179.000£y:109.000£solid:true£} ^point{x:34.000£y:167.000£solid:true£} ^point{x:-130.000£y:152.000£solid:true£} ^point{x:-187.000£y:74.000£solid:true£} } ^details1{^detail{x:-106£y:-113£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:199£y:-107£dtl:dtlCactus1£xscale:0.800£yscale:0.500£angle:0.000£opacity:1.000£} } ^details2{^detail{x:15£y:5£dtl:dtlShadow1£xscale:7.000£yscale:4.700£angle:0.000£opacity:0.590£} ^detail{x:14£y:4£dtl:dtlShadow1£xscale:7.000£yscale:4.700£angle:0.000£opacity:0.550£} ^detail{x:15£y:-76£dtl:dtlShadow1£xscale:7.700£yscale:2.000£angle:0.000£opacity:0.610£} ^detail{x:-7£y:-70£dtl:dtlSandTop£xscale:2.200£yscale:1.000£angle:1.500£opacity:1.000£} ^detail{x:131£y:-80£dtl:dtlSandTop£xscale:2.200£yscale:1.000£angle:-9.500£opacity:1.000£} ^detail{x:-146£y:-84£dtl:dtlSandTop£xscale:2.200£yscale:1.000£angle:9.500£opacity:1.000£} ^detail{x:214£y:-92£dtl:dtlSandTop£xscale:1.300£yscale:1.000£angle:-2.000£opacity:1.000£} ^detail{x:-187£y:-91£dtl:dtlSandTop£xscale:1.300£yscale:1.000£angle:3.500£opacity:1.000£} } ^details3{} } @Spyro[x:183£y:155£] @Enemy[x:508£y:164£gemDrop:5£] @Enemy[x:414£y:55£gemDrop:5£]";
		
//Start the game
gameInit();


//Below here are the game functions:
function gameInit(){
	//Set the game screen size
	screenWidth = 640;
	screenHeight = 480;
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	
	//Add keyboard keys to "listen" for
	leftKey = keyboard.addKey(37);
	upKey = keyboard.addKey(38);
    rightKey = keyboard.addKey(39);
	downKey = keyboard.addKey(40);
	spaceKey = keyboard.addKey(32);
	shiftKey = keyboard.addKey(16);
	controlKey = keyboard.addKey(17);
	aKey = keyboard.addKey(ord("A"));
	sKey = keyboard.addKey(ord("S"));
	rKey = keyboard.addKey(ord("R"));
	xKey = keyboard.addKey(ord("X"));
	yKey = keyboard.addKey(ord("Y"));
	cKey = keyboard.addKey(ord("C"));
	
	
	objSparx = new Sparx();
	objCamera = new Camera();
	
	//Add object types to the list of objects that can be loaded from a level string, and are place-able in the level editor
	addObjectType("Spyro", true, true, sprSpyro, Spyro);//name, only one, must exist, sprite, constructor
	var x = addObjectType("Enemy", false, false, sprEnemy, Enemy);
	addObjectTypeProperty(x, "gemDrop", "The combined value of the gems the enemy should drop.", 5);//Default value is set to 5
	
	//Show a couple of questions to let the user decide whether to open the level editor or run a level
	var r = confirm("Open level editor?(OK) Or play a level?(Cancel)");
	if (r == true) {
		objEditor = new Editor();
	} else {
		objLevel = new PolygonLevel();
		var l = confirm("Big level that may lagg?(OK) Or small level?(Cancel)");
		if( l )
			objLevel.loadString(levelString[0]);
		else
			objLevel.loadString(levelString[1]);
		objLevel.init();
	}
	
	//Start the game loop
	objTimer = new Timer( 1000/30, gameStep, gameDraw );
	gameLoop = this.setInterval("objTimer.update()", 1);
}


function gameDraw(){
    if( resources.loaded ){
		if( objEditor == null ){
		    // Clear the canvas with a pink background colour
			context.setTransform(1, 0, 0, 1, 0, 0);
			context.fillStyle = 'rgb(185, 140, 170)';
			context.fillRect(0, 0, screenWidth, screenHeight);
		    objCamera.setView(context);
		    objLevel.draw();
		} else {
		    objEditor.draw();
		}
    }
}


function gameStep(){
	if( resources.loaded ){
		if( objEditor == null ){
			objLevel.step();
			objCamera.step();
		} else {
			objEditor.step();
		}
	} else {
		resources.loadStep();
	}
	keyboard.update(); // Make keys go to the state of just being held or untouched after being pressed or released
	mouse.update();
}
