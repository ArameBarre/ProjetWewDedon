window.onload = function () {
    //Declaration des variables
    let zone = document.getElementById("zone");
    let ctx = zone.getContext("2d");
    let engine = {};
    engine.scoreSlot = document.querySelector(".score");
    engine.energyBar = document.querySelector(".energy");

    //çela sera utilisé pour garder les informations importantes plus accessibles
    const gamezone = {};
    gamezone.gameOver = false;
    gamezone.score = 0;
    gamezone.horizontal = 25;
    gamezone.vertical = 15;
    gamezone.width = zone.getBoundingClientRect().width;
    gamezone.height = zone.getBoundingClientRect().height;
    gamezone.tileWidth = Math.floor(gamezone.width / gamezone.horizontal);
    gamezone.tileHeight = Math.floor(gamezone.height / gamezone.vertical);

    //les modéles d'images
    gamezone.tilesMap = [
        new Image(),
        new Image(),
        new Image()
    ];
    gamezone.tilesMap[0].src = "./tile0.png";
    gamezone.tilesMap[1].src = "./tile1.png";
    gamezone.tilesMap[2].src = "./tile2.png";

    

    gamezone.tiles = [];
    for (let index = 0; index < gamezone.horizontal; index++) {
        gamezone.tiles[index] = [];
    }

    //Notre hero

    const hero = {};
    hero.x = 0;
    hero.y = 0;
    hero.width = gamezone.tileWidth;
    hero.height = gamezone.tileHeight;
    hero.speed = 1;
    hero.sprite = new Image();
    hero.sprite.src = "./hero.png";
    hero.energy = 0;

    //controls

    const controls = {};
    controls.up = document.querySelector(".up");
    controls.down = document.querySelector(".down");
    controls.left = document.querySelector(".left");
    controls.right = document.querySelector(".right");
    controls.exit = document.querySelector(".exit");

    //code principale

    engine.updateScore = function(number){
        if(number == 2){
            gamezone.score += 1000;
        }else if(number == 1){
            gamezone.score -= 50;
            if(hero.energy > 0) hero.energy -= 1;
        }else if (number == 0){
            gamezone.score -= 10;
        }
        if(hero.energy == 0){
            gamezone.gameOver = true;
        }
        engine.scoreSlot.innerHTML = `Score : ${ gamezone.score }`;
        engine.energyBar.style.width = `${ ( hero.energy * 80 ) / 40 }%`;
    };

    engine.load = function(){
        hero.energy = 40;
        gamezone.score = 0;
        hero.x = (Math.random() == 0) ? 12 : 13;
        hero.y = (Math.random() == 1) ? 7 : 8;

        let nb;
        for (let i = 0; i < gamezone.horizontal; i++) {
            for (let j = 0; j < gamezone.vertical; j++) {
                nb = Math.floor(Math.random() * 100);
                if (nb < 10) {
                    gamezone.tiles[i][j] = 2;
                }
                else{
                    gamezone.tiles[i][j] = 1;
                }
            }
        }
        gamezone.tiles[hero.x][hero.y] = 0;

        //charger les evenement du clavier
        controls.up.onclick = function(){
            if (hero.y > 0 && (!gamezone.gameOver)) {
                hero.y--;
                engine.updateScore(gamezone.tiles[hero.x][hero.y]);
                gamezone.tiles[hero.x][hero.y] = 0;
            }
        };
        controls.down.onclick = function(){
            if (hero.y < gamezone.vertical - 1 && (!gamezone.gameOver)) {
                hero.y++;
                engine.updateScore(gamezone.tiles[hero.x][hero.y]);
                gamezone.tiles[hero.x][hero.y] = 0;
            }
        };
        controls.left.onclick = function(){
            if (hero.x > 0 && (!gamezone.gameOver)) {
                hero.x--;
                engine.updateScore(gamezone.tiles[hero.x][hero.y]);
                gamezone.tiles[hero.x][hero.y] = 0;
            }
        };
        controls.right.onclick = function(){
            if (hero.x < gamezone.horizontal - 1 && (!gamezone.gameOver)) {
                hero.x++;
                engine.updateScore(gamezone.tiles[hero.x][hero.y]);
                gamezone.tiles[hero.x][hero.y] = 0;
            }
        };
        controls.exit.onclick = function(){
            gamezone.gameOver = true;
        };

        document.onkeydown = (e)=>{
            e.preventDefault();
            if (e.keyCode == 37) {
                controls.left.onclick();
            }
            else if (e.keyCode == 39) {
                controls.right.onclick();
            }
            else if (e.keyCode == 38) {
                controls.up.onclick();
            }
            else if (e.keyCode == 40) {
                controls.down.onclick();
            }else if (e.keyCode == 27){
                gamezone.gameOver = true;
            }
            if(gamezone.gameOver && e.keyCode == 32){
                engine.load();
                engine.updateScore();
            }
        };

        gamezone.gameOver = false;
    };
    engine.update = function(){
        
    };
    engine.draw = function(){
        //Effacer la toile de dessin à chaque fois pour simuler un rafraichissement
        ctx.clearRect(0,0,gamezone.width,gamezone.height);
        //Dessiner notre map ici :
        let x = 0,y = 0;
        for (let i = 0; i < gamezone.horizontal; i++) {
            y = 0;
            for (let j = 0; j < gamezone.vertical; j++) {
                ctx.drawImage(gamezone.tilesMap[gamezone.tiles[i][j]], x,y,gamezone.tileWidth,gamezone.tileHeight);
                y += gamezone.tileWidth;
            }
            x += gamezone.tileHeight;
        }
        

        //Dessinnez notre hero ici
        ctx.drawImage(hero.sprite, hero.x * gamezone.tileWidth, hero.y * gamezone.tileHeight, hero.width, hero.height);
       

     
        if(gamezone.gameOver){
            ctx.fillRect(250,150,200,150);
            ctx.save();
            ctx.textAlign = 'center';
            ctx.font = 'bold 20px ubuntu, Arial, serif';
            ctx.fillStyle = "#fff";
            ctx.fillText("Game Over !",350,205);
            ctx.font = 'bold 16px ubuntu, Arial, serif';
            ctx.fillText(`Score : ${gamezone.score}`,350,235);
            ctx.font = 'bold 12px Verdana, Arial, serif';
            ctx.fillText("Press space key to retry !",350,275);
            ctx.restore();
        }

        
    };
    engine.debug = function(color){
        ctx.fillStyle = `#000`;
        ctx.fillRect(0,0,200,100);
        ctx.fillStyle = `${color}`;
        ctx.fillText(`gameover : ${gamezone.gameOver}`,10,20);
        ctx.fillText(`energy : ${hero.energy}`,10,40);
        ctx.fillText(`tile width : ${gamezone.tileWidth}`,10,60);
        ctx.fillText(`tile height : ${gamezone.tileHeight}`,10,80);
        ctx.fillStyle = `#000`;
    };


   

// debut de notre boucle de jeu
    engine.load();
    let gameloop = setInterval(function(){
        engine.update();
        engine.draw();
    },50);
}



//////////////////////////////////////////////////////////////
// affichage
document.write("Hello word !");

// declaration d'une variable
var age = 14;
// afficher la valeur d'une variable
document.write(age);
 age = 28;
 alert(age);

// afficher le type de la variable age
 document.write(typeof age);
 typeof (age);
 typeof age;
// demander un saisi

var name = prompt("cmt t'appelle tu ?" );
// conversion d'un type
var age = prompt("quel age a tu ?");
age = parseInt(age);
document.write(typeof age);

//constante
const pi = 3.14;
pi =3.14;
document.write(pi);

///les operateurs

let result = 14 ;
document.write(result);

//// condition
let name = "yuna";

if(name == "yunah") 
document.write("oui");
  


switch(name)
{
   case "yuna " : 
      document.write("ok") ;
   break;

   default:  
      alert("pas ok");
   break;

}
//condition terniaire 
let number = 15;
let res = (number > 10 ) ? "vrai": "faux ";
document.write(res);

////Boucles


////POO

class MusicPlayer
{

    constructor(format)
    {
    this.format = format ;
    document.write(this.format);

    }

    getformat()
    { 
        return this.format;
    }
    
    setformat(newformat)
    { 
        this.format = newformat;
    }
    static Hello()
    { 
        return "Hello word"
    }

};
let player = new MusicPlayer("MP3");
player.getformat();

//Oubien
function MusicPlayer(format)
{ 
    this.format = format;
};

/*let player = new MusicPlayer("MP3");
player.getformat();


*/

class Humain
{

constructor (nom)
   {
  this.nom = nom;
  document.write (this.nom);
    
    }
};

let critere = new Humain ("Arame");
let critere1 = new Humain("22");
//////////
class genin 
 {
    constructor(name= "arame",weapon = "Barre")
    {
     this.name=name
     this.weapon= weapon
        
      }
      attack()
      {
       return "Ranhh";
           
         }
    
  };
  let sasute = new genin("fallou");
  document.write(sasute.name);
  document.write(sasute.weapon);
  document.write(sasute.attack());
  //Heritage

  class Nijan 
  {
  constructor(name = "Nuruto")
       {
  this.name= name;
          
        }
   
        
    }

    class SuperNijan extends Nijan
    {
       constructor(name = "Nuruto",weapon = "shuriken")
             {
       
               super(name) ;
               this.weapon = weapon;
              }
         
   }
    let kakashi = new SuperNijan ("kakashi hatak","kukani");
    document.write(kakashi.name + "<br>");
    document.write(kakashi.weapon + "<br>");

 ////Exeption
 //Lever une erreur (code sensible ,qui pourrait lever une exeption)
 throw new console.error("Une erreur s'est produite...");
 //Exeption

 try
  {
   //code sensible ,qui pourrait lever une exeption
   throw new console.error("Une erreur s'est produite...");
  }
     catch(err)
      {

        console.log(err.message);
       }      
  
       finally
       {

        document.write("ok");
       }      
  