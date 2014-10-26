//Variables:
//General:
var canvas = document.getElementById("gamecanvas"), context = canvas.getContext("2d");
var gameLoop, screenWidth, screenHeight;
var redraw = 0;

//Keyboard keys
var leftKey, upKey, rightKey, downKey, aKey, sKey, rKey, xKey, yKey, cKey,
        spaceKey, shiftKey, controlKey, returnKey, escapeKey;

//Objects
var objTimer = null;
var mainMenu = null;
var pauseMenu = null;
var objLevel = null;
var objEditor = null;
var objSpyro = null;
var objSparx = null;
var objCamera = null;
var gravity = 1.5;

//Sprites
var sprSpyroJump = resources.addSprite("graphics/sprSpyroJump.png", 6, 118, 82, 63, 38, 0);
var sprSpyroBreak = resources.addSprite("graphics/sprSpyroBreak.png", 4, 116, 68, 74, 34, 0);
var sprSpyroIdle = resources.addSprite("graphics/sprSpyroIdle.png", 19, 105, 71, 67, 33, 0);
var sprSpyroRun = resources.addSprite("graphics/sprSpyroRun.png", 5, 116, 63, 68, 31, 0);
var sprSpyroGlide = resources.addSprite("graphics/sprSpyroGlide.png", 4, 139, 67, 68, 31, 0);
var sprSpyroHover = resources.addSprite("graphics/sprSpyroHover.png", 4, 92, 92, 40, 48, 0);
var sprSpyroFall = resources.addSprite("graphics/sprSpyroFall.png", 10, 132, 65, 68, 30, 0);

var sprEnemy = resources.addSprite("graphics/sprEnemy.png", 1, 64, 64, 32, 32, 0);
var sprSparx = resources.addSprite("graphics/sprSparx.png", 4, 32, 32, 16, 16, 0);
var sprGemRed = resources.addSprite("graphics/sprGemRed.png", 1, 24, 24, 12, 12, 0);
var sprGemGreen = resources.addSprite("graphics/sprGemGreen.png", 1, 24, 24, 12, 12, 0);
var sprGemBlue = resources.addSprite("graphics/sprGemBlue.png", 1, 24, 24, 12, 12, 0);
var sprGemYellow = resources.addSprite("graphics/sprGemYellow.png", 1, 24, 24, 12, 12, 0);
var sprGemPurple = resources.addSprite("graphics/sprGemPurple.png", 1, 24, 24, 12, 12, 0);

var sprChestBasket = resources.addSprite("graphics/sprChestBasket.png", 1, 64, 48, 32, 24, 0);
var sprChestVase = resources.addSprite("graphics/sprChestVase.png", 6, 26, 40, 12, 10, 0);
var sprChestLife = resources.addSprite("graphics/sprChestLife.png", 1, 64, 64, 32, 32, 0);

var sprButterflyHealth = resources.addSprite("graphics/sprButterflyHealth.png", 6, 32, 32, 16, 16, 0);
var sprButterflyLife = resources.addSprite("graphics/sprButterflyLife.png", 6, 32, 32, 16, 16, 0);

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
levelString[0] = "@Polygon{x:2949£y:250£jumpThrough:false£visible:true£bgColor:#111224£texture:texDesert£textureOpacity:0.350£^points{^point{x:-394.901£y:52.633£solid:false£} ^point{x:-391.392£y:-75.441£solid:false£} ^point{x:-398.449£y:-232.304£solid:false£} ^point{x:-130.000£y:-306.000£solid:false£} ^point{x:278.802£y:-307.396£solid:false£} ^point{x:338.325£y:113.127£solid:false£} ^point{x:-433.345£y:110.950£solid:false£} } ^details1{} ^details2{^detail{x:-30£y:68£dtl:dtlShadow2£xscale:11.000£yscale:2.200£angle:-3.500£opacity:0.740£} ^detail{x:-46£y:-225£dtl:dtlShadow2£xscale:11.000£yscale:2.200£angle:-186.000£opacity:0.660£} ^detail{x:100£y:-104£dtl:dtlShadow2£xscale:11.000£yscale:7.200£angle:-464.500£opacity:0.720£} } ^details3{} } @Polygon{x:1544£y:9£jumpThrough:true£visible:true£bgColor:#3e250d£texture:texDesert£textureOpacity:1.000£^points{^point{x:-166.959£y:-8.348£solid:true£} ^point{x:-110.842£y:-21.565£solid:true£} ^point{x:-27.595£y:-31.595£solid:false£} ^point{x:-2.585£y:-63.987£solid:false£} ^point{x:-11.585£y:-105.987£solid:true£} ^point{x:49.913£y:-114.450£solid:true£} ^point{x:143.538£y:-119.928£solid:false£} ^point{x:115.415£y:-59.987£solid:false£} ^point{x:112.415£y:43.013£solid:false£} ^point{x:142.843£y:104.813£solid:false£} ^point{x:-138.205£y:70.030£solid:false£} } ^details1{^detail{x:86£y:-164£dtl:dtlDesertTower£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } ^details2{^detail{x:-86£y:-39£dtl:dtlShadow1£xscale:2.400£yscale:1.000£angle:-11.000£opacity:1.000£} ^detail{x:-1£y:79£dtl:dtlShadow1£xscale:6.000£yscale:2.000£angle:13.500£opacity:0.710£} ^detail{x:62£y:-121£dtl:dtlShadow1£xscale:2.500£yscale:-1.000£angle:-6.500£opacity:0.710£} ^detail{x:31£y:-110£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-0.500£opacity:1.000£} ^detail{x:100£y:-116£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-7.500£opacity:1.000£} ^detail{x:-127£y:-16£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-7.500£opacity:1.000£} ^detail{x:-74£y:-24£dtl:dtlSandTop£xscale:1.400£yscale:1.000£angle:-11.000£opacity:1.000£} } ^details3{} } @Polygon{x:1549£y:148£jumpThrough:true£visible:true£bgColor:#241b11£texture:texDesert£textureOpacity:1.000£^points{^point{x:-148.456£y:-24.986£solid:false£} ^point{x:-188.328£y:-90.555£solid:true£} ^point{x:-139.460£y:-95.673£solid:true£} ^point{x:-48.210£y:-86.677£solid:true£} ^point{x:85.452£y:-50.691£solid:true£} ^point{x:164.696£y:-42.623£solid:false£} ^point{x:162.809£y:34.754£solid:false£} ^point{x:-138.546£y:100.587£solid:false£} } ^details1{^detail{x:121£y:-75£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-61£y:-117£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } ^details2{^detail{x:2£y:57£dtl:dtlShadow1£xscale:5.700£yscale:1.900£angle:-14.500£opacity:0.730£} ^detail{x:-6£y:-98£dtl:dtlShadow1£xscale:5.700£yscale:1.900£angle:1.500£opacity:0.730£} ^detail{x:-153£y:-89£dtl:dtlSandTop£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-72£y:-82£dtl:dtlSandTop£xscale:1.700£yscale:1.500£angle:9.500£opacity:1.000£} ^detail{x:31£y:-63£dtl:dtlSandTop£xscale:1.700£yscale:1.500£angle:12.500£opacity:1.000£} ^detail{x:108£y:-50£dtl:dtlSandTop£xscale:1.700£yscale:1.500£angle:5.000£opacity:1.000£} } ^details3{} } @Polygon{x:1527£y:236£jumpThrough:true£visible:true£bgColor:#1f1710£texture:texDesert£textureOpacity:1.000£^points{^point{x:-163.237£y:119.342£solid:false£} ^point{x:-152.263£y:50.754£solid:false£} ^point{x:-151.342£y:-29.717£solid:true£} ^point{x:8.230£y:-57.613£solid:true£} ^point{x:105.624£y:-89.163£solid:true£} ^point{x:204.390£y:-83.676£solid:false£} ^point{x:187.929£y:-10.974£solid:false£} ^point{x:237.761£y:159.583£solid:false£} ^point{x:-186.557£y:222.672£solid:false£} } ^details1{^detail{x:-114£y:-71£dtl:dtlCactus1£xscale:-1.500£yscale:1.200£angle:-12.500£opacity:1.000£} } ^details2{^detail{x:-93£y:199£dtl:dtlShadow1£xscale:5.400£yscale:2.900£angle:-1.000£opacity:0.580£} ^detail{x:91£y:163£dtl:dtlShadow1£xscale:5.400£yscale:2.900£angle:-15.000£opacity:0.580£} ^detail{x:-10£y:-75£dtl:dtlShadow1£xscale:5.400£yscale:2.900£angle:-15.000£opacity:0.580£} ^detail{x:145£y:-89£dtl:dtlShadow1£xscale:2.700£yscale:1.300£angle:-15.000£opacity:0.580£} ^detail{x:-67£y:-40£dtl:dtlSandTop£xscale:2.700£yscale:1.300£angle:-5.000£opacity:1.000£} ^detail{x:67£y:-66£dtl:dtlSandTop£xscale:2.000£yscale:1.300£angle:-18.000£opacity:1.000£} ^detail{x:167£y:-84£dtl:dtlSandTop£xscale:1.400£yscale:1.100£angle:-3.500£opacity:1.000£} } ^details3{} } @Polygon{x:2500£y:423£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-120.000£y:313.000£solid:false£} ^point{x:-78.850£y:-89.951£solid:true£} ^point{x:256.465£y:-67.935£solid:true£} ^point{x:424.122£y:-74.709£solid:true£} ^point{x:622.263£y:-62.855£solid:true£} ^point{x:779.759£y:-74.709£solid:true£} ^point{x:748.034£y:-325.476£solid:false£} ^point{x:858.258£y:-331.030£solid:false£} ^point{x:896.292£y:291.991£solid:false£} } ^details1{} ^details2{^detail{x:707£y:-260£dtl:dtlShadow1£xscale:3.200£yscale:7.000£angle:-13.500£opacity:1.000£} ^detail{x:593£y:-71£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:331£y:-71£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:140£y:-84£dtl:dtlShadow1£xscale:7.000£yscale:1.900£angle:0.500£opacity:1.000£} ^detail{x:664£y:-64£dtl:dtlSandTop£xscale:3.600£yscale:2.200£angle:-5.000£opacity:1.000£} ^detail{x:435£y:-56£dtl:dtlSandTop£xscale:3.600£yscale:2.200£angle:1.000£opacity:1.000£} ^detail{x:208£y:-59£dtl:dtlSandTop£xscale:3.600£yscale:2.200£angle:1.000£opacity:1.000£} ^detail{x:6£y:-71£dtl:dtlSandTop£xscale:3.500£yscale:2.000£angle:6.000£opacity:1.000£} } ^details3{} } @Polygon{x:910£y:553£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-116.000£y:-252.000£solid:true£} ^point{x:30.000£y:-253.000£solid:true£} ^point{x:117.000£y:-269.000£solid:true£} ^point{x:222.000£y:-347.000£solid:true£} ^point{x:191.000£y:-266.000£solid:true£} ^point{x:209.000£y:-170.000£solid:true£} ^point{x:230.000£y:-133.000£solid:true£} ^point{x:344.000£y:-121.000£solid:true£} ^point{x:481.000£y:-128.000£solid:false£} ^point{x:481.000£y:209.000£solid:false£} ^point{x:241.000£y:214.000£solid:false£} ^point{x:-143.000£y:221.000£solid:false£} } ^details1{} ^details2{^detail{x:357£y:-156£dtl:dtlShadow1£xscale:4.400£yscale:2.100£angle:0.000£opacity:1.000£} ^detail{x:54£y:-284£dtl:dtlShadow1£xscale:7.400£yscale:2.700£angle:-17.500£opacity:0.880£} ^detail{x:-51£y:-244£dtl:dtlSandTop£xscale:2.300£yscale:1.700£angle:-0.500£opacity:1.000£} ^detail{x:88£y:-264£dtl:dtlSandTop£xscale:2.200£yscale:1.500£angle:-18.500£opacity:1.000£} ^detail{x:182£y:-316£dtl:dtlSandTop£xscale:1.700£yscale:1.500£angle:-41.500£opacity:1.000£} ^detail{x:420£y:-115£dtl:dtlSandTop£xscale:2.000£yscale:1.600£angle:0.000£opacity:1.000£} ^detail{x:294£y:-125£dtl:dtlSandTop£xscale:2.000£yscale:1.600£angle:10.500£opacity:1.000£} } ^details3{} } @Polygon{x:263£y:554£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-472.000£y:241.000£solid:false£} ^point{x:-466.000£y:-632.000£solid:false£} ^point{x:-204.000£y:-656.000£solid:true£} ^point{x:-152.000£y:-582.000£solid:true£} ^point{x:-125.000£y:-513.000£solid:true£} ^point{x:-169.000£y:-431.000£solid:true£} ^point{x:-150.000£y:-389.000£solid:true£} ^point{x:-172.000£y:-302.000£solid:true£} ^point{x:-6.000£y:-257.000£solid:true£} ^point{x:252.000£y:-284.000£solid:true£} ^point{x:535.000£y:-252.000£solid:false£} ^point{x:535.000£y:218.000£solid:false£} } ^details1{^detail{x:231£y:-308£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:428£y:-292£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } ^details2{^detail{x:-106£y:-356£dtl:dtlShadow1£xscale:3.200£yscale:2.400£angle:0.000£opacity:1.000£} ^detail{x:271£y:-298£dtl:dtlShadow1£xscale:7.600£yscale:2.200£angle:0.000£opacity:0.630£} ^detail{x:476£y:-254£dtl:dtlShadow1£xscale:7.600£yscale:2.200£angle:0.000£opacity:0.700£} ^detail{x:62£y:-283£dtl:dtlShadow1£xscale:7.600£yscale:2.200£angle:0.000£opacity:0.650£} ^detail{x:333£y:-266£dtl:dtlSandTop£xscale:2.400£yscale:1.800£angle:6.500£opacity:1.000£} ^detail{x:482£y:-247£dtl:dtlSandTop£xscale:2.400£yscale:1.700£angle:6.500£opacity:1.000£} ^detail{x:183£y:-268£dtl:dtlSandTop£xscale:2.400£yscale:1.800£angle:-4.500£opacity:1.000£} ^detail{x:31£y:-261£dtl:dtlSandTop£xscale:2.400£yscale:1.800£angle:-0.500£opacity:1.000£} ^detail{x:-97£y:-280£dtl:dtlSandTop£xscale:2.400£yscale:1.800£angle:18.500£opacity:1.000£} ^detail{x:-117£y:-456£dtl:dtlShadow1£xscale:3.200£yscale:1.500£angle:0.000£opacity:1.000£} } ^details3{} } @Polygon{x:2056£y:552£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-672.000£y:-126.000£solid:true£} ^point{x:-510.000£y:-127.000£solid:true£} ^point{x:-378.000£y:-161.000£solid:true£} ^point{x:-241.000£y:-246.000£solid:true£} ^point{x:-132.000£y:-258.000£solid:true£} ^point{x:246.000£y:-242.000£solid:true£} ^point{x:371.000£y:-218.000£solid:false£} ^point{x:371.000£y:179.000£solid:false£} ^point{x:-672.000£y:210.000£solid:false£} } ^details1{} ^details2{^detail{x:118£y:-249£dtl:dtlShadow1£xscale:7.400£yscale:2.100£angle:5.000£opacity:0.800£} ^detail{x:-383£y:-167£dtl:dtlShadow1£xscale:7.400£yscale:2.100£angle:-13.500£opacity:0.800£} ^detail{x:124£y:-237£dtl:dtlSandTop£xscale:3.800£yscale:2.500£angle:2.500£opacity:1.000£} ^detail{x:-119£y:-242£dtl:dtlSandTop£xscale:3.900£yscale:2.500£angle:-1.000£opacity:1.000£} ^detail{x:-585£y:-121£dtl:dtlSandTop£xscale:2.900£yscale:1.900£angle:-3.000£opacity:1.000£} ^detail{x:-406£y:-154£dtl:dtlSandTop£xscale:2.900£yscale:1.900£angle:-17.500£opacity:1.000£} ^detail{x:-279£y:-209£dtl:dtlSandTop£xscale:1.800£yscale:1.900£angle:-27.500£opacity:1.000£} ^detail{x:296£y:-219£dtl:dtlSandTop£xscale:2.400£yscale:1.900£angle:11.500£opacity:1.000£} } ^details3{} } @Polygon{x:3043£y:-164£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-446.000£y:-326.000£solid:false£} ^point{x:295.000£y:-275.000£solid:false£} ^point{x:321.000£y:256.000£solid:false£} ^point{x:205.000£y:262.000£solid:true£} ^point{x:192.000£y:186.000£solid:true£} ^point{x:122.000£y:136.000£solid:true£} ^point{x:-22.000£y:112.000£solid:true£} ^point{x:-109.000£y:114.000£solid:true£} ^point{x:-385.000£y:163.000£solid:true£} ^point{x:-461.000£y:204.000£solid:true£} ^point{x:-487.000£y:288.000£solid:true£} ^point{x:-533.000£y:288.000£solid:true£} ^point{x:-529.000£y:221.000£solid:true£} ^point{x:-421.000£y:16.000£solid:true£} ^point{x:-481.000£y:-66.000£solid:true£} ^point{x:-487.000£y:-142.000£solid:true£} ^point{x:-419.000£y:-191.000£solid:true£} ^point{x:-487.000£y:-236.000£solid:true£} } ^details1{} ^details2{^detail{x:48£y:269£dtl:dtlShadow1£xscale:6.200£yscale:6.900£angle:-78.000£opacity:1.000£} ^detail{x:-243£y:210£dtl:dtlShadow1£xscale:3.600£yscale:6.700£angle:-112.500£opacity:1.000£} ^detail{x:-465£y:-9£dtl:dtlShadow1£xscale:1.900£yscale:2.700£angle:-200.500£opacity:0.720£} ^detail{x:-467£y:-204£dtl:dtlShadow1£xscale:1.900£yscale:2.700£angle:-252.000£opacity:0.720£} } ^details3{} } @Spyro[x:831£y:265£] @Enemy[x:292£y:235£gemDrop:5£] @Enemy[x:444£y:223£gemDrop:5£] @Enemy[x:346£y:155£gemDrop:5£] @Enemy[x:204£y:205£gemDrop:5£] @Gem 1[x:356£y:275£value:1£] @Gem 1[x:440£y:144£value:1£] @Gem 1[x:238£y:273£value:1£] @Gem 2[x:159£y:263£value:2£] @Gem 2[x:580£y:67£value:2£] @Gem 2[x:1217£y:416£value:2£] @Gem 2[x:1319£y:414£value:2£] @Gem 2[x:1553£y:406£value:2£] @Gem 1[x:1271£y:410£value:1£] @Gem 10[x:1639£y:-140£value:10£] @Gem 10[x:1469£y:-46£value:10£] @Gem 5[x:1495£y:156£value:5£] @Gem 5[x:1693£y:129£value:5£] @Gem 1[x:2555£y:327£value:1£] @Gem 1[x:2596£y:323£value:1£] @Gem 1[x:2658£y:328£value:1£] @Gem 1[x:2717£y:328£value:1£] @Gem 1[x:2829£y:328£value:1£] @Gem 1[x:2913£y:328£value:1£] @Gem 2[x:2765£y:323£value:2£] @Gem 2[x:2865£y:322£value:2£] @Gem 2[x:2963£y:328£value:2£] @Gem 2[x:3040£y:333£value:2£] @Gem 2[x:3124£y:329£value:2£] @Gem 5[x:2992£y:333£value:5£] @Gem 5[x:3087£y:330£value:5£] @Gem 5[x:3175£y:337£value:5£] @Gem 5[x:3231£y:328£value:5£] @Gem 10[x:3065£y:314£value:10£] @Gem 10[x:3153£y:308£value:10£] @Gem 25[x:3213£y:298£value:25£] @Gem 25[x:3260£y:307£value:25£] @Gem 5[x:1077£y:67£value:5£] @Gem 5[x:1033£y:-116£value:5£] @Gem 5[x:1031£y:170£value:5£] @ChestBasket[x:595£y:257£gemDrop:5£] @ChestBasket[x:1432£y:402£gemDrop:5£] @ChestVase[x:977£y:264£gemDrop:5£] @ChestVase[x:721£y:264£gemDrop:5£] @ChestLife[x:1581£y:-135£] @ChestLife[x:1424£y:-41£] ";
levelString[1] = "@Polygon{x:437£y:121£jumpThrough:true£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-118.000£y:-16.000£solid:false£} ^point{x:-133.000£y:-62.000£solid:true£} ^point{x:-35.000£y:-54.000£solid:true£} ^point{x:6.000£y:-38.000£solid:true£} ^point{x:74.000£y:-36.000£solid:false£} ^point{x:95.000£y:16.000£solid:false£} ^point{x:-120.000£y:28.000£solid:false£} } ^details1{} ^details2{^detail{x:-13£y:-57£dtl:dtlShadow1£xscale:5.200£yscale:1.000£angle:5.500£opacity:0.800£} ^detail{x:-78£y:-57£dtl:dtlSandTop£xscale:1.700£yscale:1.000£angle:4.500£opacity:1.000£} ^detail{x:38£y:-36£dtl:dtlSandTop£xscale:1.100£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-16£y:-44£dtl:dtlSandTop£xscale:1.100£yscale:1.000£angle:18.500£opacity:1.000£} ^detail{x:-8£y:16£dtl:dtlShadow1£xscale:3.600£yscale:1.000£angle:-1.000£opacity:0.800£} } ^details3{} } @Polygon{x:403£y:184£jumpThrough:true£visible:true£bgColor:#000000£texture:texDesert£textureOpacity:1.000£^points{^point{x:-130.000£y:47.000£solid:false£} ^point{x:-119.000£y:-35.000£solid:true£} ^point{x:19.000£y:-55.000£solid:true£} ^point{x:145.000£y:-54.000£solid:false£} ^point{x:155.000£y:30.000£solid:false£} } ^details1{} ^details2{^detail{x:4£y:-53£dtl:dtlShadow1£xscale:5.100£yscale:1.000£angle:-2.000£opacity:0.790£} ^detail{x:78£y:-54£dtl:dtlSandTop£xscale:2.100£yscale:1.000£angle:-3.000£opacity:1.000£} ^detail{x:-50£y:-42£dtl:dtlSandTop£xscale:2.100£yscale:1.000£angle:-6.500£opacity:1.000£} ^detail{x:40£y:4£dtl:dtlShadow2£xscale:4.400£yscale:0.600£angle:-3.500£opacity:0.900£} } ^details3{} } @Polygon{x:355£y:281£jumpThrough:false£visible:true£bgColor:#000000£texture:texDesert£textureOpacity:1.000£^points{^point{x:-228.000£y:-92.000£solid:true£} ^point{x:-161.000£y:-92.000£solid:true£} ^point{x:-84.000£y:-78.000£solid:true£} ^point{x:65.000£y:-73.000£solid:true£} ^point{x:165.000£y:-82.000£solid:true£} ^point{x:192.000£y:-93.000£solid:true£} ^point{x:251.000£y:-94.000£solid:true£} ^point{x:249.000£y:9.000£solid:true£} ^point{x:179.000£y:109.000£solid:true£} ^point{x:34.000£y:167.000£solid:true£} ^point{x:-130.000£y:152.000£solid:true£} ^point{x:-187.000£y:74.000£solid:true£} } ^details1{^detail{x:-106£y:-113£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:199£y:-107£dtl:dtlCactus1£xscale:0.800£yscale:0.500£angle:0.000£opacity:1.000£} } ^details2{^detail{x:15£y:5£dtl:dtlShadow1£xscale:7.000£yscale:4.700£angle:0.000£opacity:0.590£} ^detail{x:14£y:4£dtl:dtlShadow1£xscale:7.000£yscale:4.700£angle:0.000£opacity:0.550£} ^detail{x:15£y:-76£dtl:dtlShadow1£xscale:7.700£yscale:2.000£angle:0.000£opacity:0.610£} ^detail{x:-7£y:-70£dtl:dtlSandTop£xscale:2.200£yscale:1.000£angle:1.500£opacity:1.000£} ^detail{x:131£y:-80£dtl:dtlSandTop£xscale:2.200£yscale:1.000£angle:-9.500£opacity:1.000£} ^detail{x:-146£y:-84£dtl:dtlSandTop£xscale:2.200£yscale:1.000£angle:9.500£opacity:1.000£} ^detail{x:214£y:-92£dtl:dtlSandTop£xscale:1.300£yscale:1.000£angle:-2.000£opacity:1.000£} ^detail{x:-187£y:-91£dtl:dtlSandTop£xscale:1.300£yscale:1.000£angle:3.500£opacity:1.000£} } ^details3{} } @Spyro[x:183£y:155£] @Enemy[x:508£y:164£gemDrop:5£] @Enemy[x:414£y:55£gemDrop:5£]";
levelString[2] = "@Polygon{x:177£y:288£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-62.000£y:-40.000£solid:true£} ^point{x:72.000£y:4.000£solid:true£} ^point{x:196.000£y:14.000£solid:true£} ^point{x:323.000£y:19.000£solid:true£} ^point{x:427.000£y:19.000£solid:true£} ^point{x:320.000£y:130.000£solid:true£} ^point{x:53.000£y:121.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:732£y:296£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-32.000£y:-16.000£solid:true£} ^point{x:136.000£y:-31.000£solid:true£} ^point{x:50.000£y:33.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:221£y:631£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-210.000£y:-1.000£solid:true£} ^point{x:-448.000£y:-501.000£solid:true£} ^point{x:-446.000£y:-804.000£solid:true£} ^point{x:-370.000£y:-802.000£solid:true£} ^point{x:-367.000£y:-500.000£solid:true£} ^point{x:-281.000£y:-284.000£solid:true£} ^point{x:-181.000£y:-282.000£solid:true£} ^point{x:-250.000£y:-235.000£solid:true£} ^point{x:-215.000£y:-158.000£solid:true£} ^point{x:-126.000£y:-158.000£solid:true£} ^point{x:-164.000£y:-90.000£solid:true£} ^point{x:373.000£y:-28.000£solid:true£} ^point{x:365.000£y:48.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:650£y:616£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-57.000£y:-10.000£solid:true£} ^point{x:683.000£y:-47.000£solid:true£} ^point{x:1070.000£y:-49.000£solid:true£} ^point{x:619.000£y:46.000£solid:true£} ^point{x:-61.000£y:63.000£solid:true£} } ^details1{} ^details2{} ^details3{^detail{x:205£y:-54£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:282£y:-61£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:385£y:-71£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:469£y:-71£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:571£y:-71£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } } @Polygon{x:994£y:255£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-32.000£y:-16.000£solid:true£} ^point{x:112.000£y:-23.000£solid:true£} ^point{x:33.000£y:37.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:1234£y:192£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-41.000£y:5.000£solid:true£} ^point{x:96.000£y:-61.000£solid:true£} ^point{x:26.000£y:38.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:1405£y:232£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-32.000£y:-16.000£solid:true£} ^point{x:32.000£y:-16.000£solid:true£} ^point{x:0.000£y:32.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:1718£y:195£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-122.000£y:10.000£solid:true£} ^point{x:32.000£y:-16.000£solid:true£} ^point{x:300.000£y:-22.000£solid:true£} ^point{x:343.000£y:176.000£solid:true£} ^point{x:467.000£y:417.000£solid:true£} ^point{x:595.000£y:584.000£solid:true£} ^point{x:734.000£y:698.000£solid:true£} ^point{x:587.000£y:656.000£solid:true£} ^point{x:382.000£y:425.000£solid:true£} ^point{x:36.000£y:106.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:2305£y:1055£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-192.000£y:210.000£solid:true£} ^point{x:-229.000£y:-201.000£solid:true£} ^point{x:-53.000£y:73.000£solid:true£} ^point{x:478.000£y:156.000£solid:true£} ^point{x:146.000£y:262.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:1822£y:665£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-60.000£y:-52.000£solid:true£} ^point{x:55.000£y:-55.000£solid:true£} ^point{x:0.000£y:32.000£solid:true£} } ^details1{^detail{x:-5£y:-85£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } ^details2{} ^details3{^detail{x:-1068£y:-98£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-1016£y:-101£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } } @Polygon{x:3131£y:1240£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-348.000£y:-26.000£solid:true£} ^point{x:-30.000£y:-129.000£solid:true£} ^point{x:-157.000£y:81.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:3427£y:887£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-207.000£y:25.000£solid:true£} ^point{x:21.000£y:25.000£solid:true£} ^point{x:-103.000£y:142.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:3366£y:1227£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-317.000£y:-23.000£solid:true£} ^point{x:350.000£y:-16.000£solid:true£} ^point{x:573.000£y:97.000£solid:true£} ^point{x:-393.000£y:99.000£solid:true£} } ^details1{} ^details2{} ^details3{} } @Polygon{x:4116£y:1201£jumpThrough:false£visible:true£bgColor:black£texture:texDesert£textureOpacity:1.000£^points{^point{x:-177.000£y:121.000£solid:true£} ^point{x:-194.000£y:-835.000£solid:true£} ^point{x:-5.000£y:-835.000£solid:true£} ^point{x:0.000£y:32.000£solid:true£} } ^details1{} ^details2{} ^details3{^detail{x:-1017£y:-33£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-955£y:-31£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-888£y:-28£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-819£y:-33£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-755£y:-25£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-684£y:-21£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-619£y:-23£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-562£y:-25£dtl:dtlCactus1£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} ^detail{x:-786£y:-339£dtl:dtlDesertTower£xscale:1.000£yscale:1.000£angle:0.000£opacity:1.000£} } } @Spyro[x:317£y:252£] @Gem 25[x:1794£y:600£value:25£] @Gem 1[x:673£y:573£value:1£] @Gem 1[x:477£y:564£value:1£] @Gem 1[x:430£y:567£value:1£] @Gem 2[x:47£y:450£value:2£] @Gem 2[x:-9£y:330£value:2£] @Gem 5[x:782£y:242£value:5£] @Gem 5[x:1045£y:195£value:5£] @Gem 5[x:1402£y:186£value:5£] @Gem 5[x:2348£y:1106£value:5£] @Gem 10[x:3255£y:889£value:10£] @Gem 10[x:3398£y:889£value:10£] @Gem 1[x:1988£y:163£value:1£] @Gem 1[x:2383£y:810£value:1£] @Gem 5[x:3782£y:1193£value:5£] @Gem 5[x:3832£y:1217£value:5£] @Gem 5[x:3717£y:1176£value:5£]"

//Start the game
gameInit();


function debug(message){
    document.getElementById("debug").innerHTML = message;
}

//Below here are the game functions:
function gameInit(){
	//Set the game screen size
	screenWidth = 640;
	screenHeight = 480;
	canvas.width = screenWidth;
	canvas.height = screenHeight;
	
    initKeyboard();
    initObjectTypes();

    objSparx = new Sparx();
    objCamera = new Camera();
    mainMenu = new MainMenu();
    pauseMenu = new PauseMenu();
	
	//Start the game loop
    objTimer = new MainTimer( 1000/30, gameStep, repaint );
	gameLoop = this.setInterval( "objTimer.update()", 1 );
}


function initKeyboard(){
    //Add keyboard keys to "listen" for
    leftKey = keyboard.addKey(37);
    upKey = keyboard.addKey(38);
    rightKey = keyboard.addKey(39);
    downKey = keyboard.addKey(40);
    spaceKey = keyboard.addKey(32);
    shiftKey = keyboard.addKey(16);
    controlKey = keyboard.addKey(17);
    returnKey = keyboard.addKey(13);
    escapeKey = keyboard.addKey(27);
    aKey = keyboard.addKey(ord("A"));
    sKey = keyboard.addKey(ord("S"));
    rKey = keyboard.addKey(ord("R"));
    xKey = keyboard.addKey(ord("X"));
    yKey = keyboard.addKey(ord("Y"));
    cKey = keyboard.addKey(ord("C"));
}


function initObjectTypes(){
    //Add object types to the list of objects that can be loaded from a level string, and are place-able in the level editor
    addObjectType("Spyro", true, true, sprSpyroIdle, Spyro);//name, only one, must exist, sprite, constructor
    var x = addObjectType("Enemy", false, false, sprEnemy, Enemy);
    addObjectTypeProperty(x, "gemDrop", "The combined value of the gems the enemy should drop.", 5);//Default value is set to 5
    x = addObjectType("Gem 1", false, false, sprGemRed, Gem);
    addObjectTypeProperty(x, "value", "The value of the gem. (Should not be changed)", 1);
    x = addObjectType("Gem 2", false, false, sprGemGreen, Gem);
    addObjectTypeProperty(x, "value", "The value of the gem. (Should not be changed)", 2);
    x = addObjectType("Gem 5", false, false, sprGemBlue, Gem);
    addObjectTypeProperty(x, "value", "The value of the gem. (Should not be changed)", 5);
    x = addObjectType("Gem 10", false, false, sprGemYellow, Gem);
    addObjectTypeProperty(x, "value", "The value of the gem. (Should not be changed)", 10);
    x = addObjectType("Gem 25", false, false, sprGemPurple, Gem);
    addObjectTypeProperty(x, "value", "The value of the gem. (Should not be changed)", 25);
    x = addObjectType("ChestBasket", false, false, sprChestBasket, ChestBasket);
    addObjectTypeProperty(x, "gemDrop", "The combined value of the gems the chest should drop.", 5);
    x = addObjectType("ChestVase", false, false, sprChestVase, ChestVase);
    addObjectTypeProperty(x, "gemDrop", "The combined value of the gems the chest should drop.", 5);
    x = addObjectType("ChestLife", false, false, sprChestLife, ChestLife);
    x = addObjectType("Butterfly health", false, false, sprButterflyHealth, Butterfly);
    addObjectTypeProperty(x, "type", "Butterfly type (Should not be changed)", BUTTERFLY_HEALTH);
    x = addObjectType("Butterfly life", false, false, sprButterflyLife, Butterfly);
    addObjectTypeProperty(x, "type", "Butterfly type (Should not be changed)", BUTTERFLY_LIFE);
}


function repaint(){
    redraw = true;
}


function gameStep(){
	if( resources.loaded ){
	    if( mainMenu.active ){
	        mainMenu.step();
        } else if( objEditor == null ){
            if( pauseMenu.active ){
                pauseMenu.step();
            } else if( objLevel != null ){
                objLevel.step();
                if( keyboard.isPressed( escapeKey ) ){
                    pauseMenu.active = true;
                }
            }
		} else {
			objEditor.step();
		}
        objCamera.step();
	} else {
		resources.loadStep();
	}

	keyboard.update(); // Make keys go to the state of just being held or untouched after being pressed or released
	mouse.update();

	if( redraw ) gameDraw();
}


function gameDraw(){
    if( resources.loaded ){
        if( mainMenu.active ){
            mainMenu.draw();
        }
		else if( objEditor == null ){
            objLevel.draw();
            if( pauseMenu.active ) pauseMenu.draw();
		} else {
		    objEditor.draw();
		}
        objCamera.draw();
    }
    
    redraw = false;
}

