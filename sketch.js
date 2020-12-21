var dog,dogImg,happyDog,lazyDog,dead, database;
var foodS=20,foodStock;
var fedTime,lastFed;
var feed,add;
var foodObj;
var gameState,gameStateRef,garden,toilet,sleep,hungry;

function preload(){
dogImg=loadImage("Dog.png");
happyDog=loadImage("happydog.png");
lazyDog=loadImage("Lazy.png");
garden=loadImage("Garden.png");
toilet=loadImage("Wash Room.png");
sleep=loadImage("Bed Room.png");
dead=loadImage("deadDog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  gameStateRef=database.ref('gameState');
  gameStateRef.on("value",function(data){
    gameState=data.val();
});

  dog=createSprite(700,170,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

  feed=createButton("Feed");
  feed.position(950,65);
  feed.mousePressed(feedDog);

  add=createButton("Buy");
  add.position(900,65);
  add.mousePressed(addFoods);

  database.ref('/').update({
    Food:20,
    FeedTime:null,
    gameState:"hungry"

  })

}

function draw() {
  background(rgb(46,139,117));
  foodObj.display();

  //console.log(gameState);

  database.ref('/').update({
   currentTime:hour()
  })

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
   changeState();
   work();

  drawSprites();
  text("Milk - "+foodS,20,20);
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}
function feedDog(){
  //dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
  gameState="fed";
}
function addFoods(){
  foodS=foodS+1;
  database.ref('/').update({
    Food:foodS
  })
  //dog.addImage(dogImg);
}
function changeState(){
  currentTime=database.ref('currentTime');
  currentTime.on("value",function(data){
    currentTime=data.val();
  });
  if(lastFed+1===currentTime){
    gameState="garden";
    update("garden");
    work();
  }
  if(lastFed+2===currentTime){
    gameState="sleep";
    update("sleep");
    work();
  }
  if(lastFed+3===currentTime){
    gameState="toilet";
    update("toilet");
    work();
  }
  if(lastFed+4===currentTime){
    gameState="hungry";
    update("hungry");
    work();
  }
  if(lastFed+5===currentTime){
    gameState="unhealthy";
    update("unhealthy");
    work();
  }
  if(lastFed+6===currentTime){
    gameState="dead";
    update("dead");
    work();
  }
}
function work(){
  if(gameState==="hungry"){
    dog.addImage(lazyDog);
    feed.show();
  }
  if(gameState==="garden"){
    dog.remove();
    background(garden);
    feed.hide();
    add.hide();
  }
  if(gameState==="toilet"){
    dog.remove();
    background(toilet);
    feed.hide();
    add.hide();
  }
  if(gameState==="sleep"){
    dog.remove();
    background(sleep);
    feed.hide();
    add.hide();
  }
  if(gameState==="fed"){
    update("fed");
    dog.addImage(happyDog);
    //background(rgb(46,139,117));
    feed.hide();
  }
  if(gameState==="dead"){
    dog.addImage(dead);
    background(rgb(46,139,117));
    feed.hide();
    add.hide();
  }
}
function update(gameState){
  database.ref('/').update({
    gameState:gameState
  })
}