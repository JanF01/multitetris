import { Component, Input, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { Subscription, fromEvent, TimeInterval } from 'rxjs';

@Component({
  selector: 'app-player-canvas',
  templateUrl: './player-canvas.component.html',
  styleUrls: ['./player-canvas.component.scss']
})
export class PlayerCanvasComponent implements OnInit {
  
   @ViewChild('canvas') public canvas: ElementRef;


   @Input() private width = 500;
   @Input() private height = 700;



  private font = "18px 'Press Start 2P'";

   private x = 10;
   private y = 20;
   private grid = [];
   private blockSize = 35;
   private blockAmount = 0;
   private current = [];
   private hold = [];
   private nextBlock = [];
   private pointCumulator = 0;
   private points = 0;
   private shapes = [
      [0,0,0,0,
       1,1,1,1],
       '#fff200',
       [0,0,0,0,
        0,1,1,0,
        0,1,1,0],
        '#ff4757',
      [0,1,0,
        1,1,1],
        '#2ed573',
      [1,1,0,
      0,1,1],
      '#ff6348',
      [0,1,1,
        1,1,0],
        '#1e90ff',
      [1,0,0,
       1,1,1],
       '#18dcff',
       [0,0,1,
        1,1,1],
        '#c56cf0',
   ];
   private randomBag = [];
   private bagU = [];

   private end: boolean = false;
   private s = 4;
   private sNext = 4;
   private currentX: number = 0;
   private currentY: number = 0;
   private currentType: number = 0;
   private nextType: number = 0;
   private blockColor: string = "";
   private gameSpeed: number = 800;
   private keyInterval;
   private downInterval;
   private bdown = false;
   private animationStop = 0;

  private subscriptiond: Subscription;
  private subscriptionu: Subscription;
  private subscriptionc: Subscription

  private keys = [0];

   private context: CanvasRenderingContext2D;


  private blockDSound;
  private blockDSoundTwo;  
  private soundtrack;
  private lineWin;
  private turn = 0;

     createCanvas(){
      
     this.blockDSound = document.getElementById('blockDown');
     this.blockDSoundTwo = document.getElementById('blockTwo');
     this.lineWin = document.getElementById('lineWin');
     this.soundtrack = document.getElementById('soundtrack');
     this.soundtrack.play();

       this.canvas.nativeElement.style.display = "block";
       document.getElementsByTagName('button')[0].style.display = "none";

      const canvas: HTMLCanvasElement = this.canvas.nativeElement;
      this.context = canvas.getContext('2d');

      canvas.width = this.width;
      canvas.height = this.height;
      this.context.lineWidth = 3;
      
      this.context.font = this.font;
  
  
      this.context.fillStyle = "#004";
    this.context.fillRect(this.width-150,0,this.width,this.height);
    this.context.fillRect(this.width-150,55+this.height/4,150,50);
     this.context.fillStyle = "rgb(43, 148, 255)";
    this.context.fillRect(this.width-150,0,8,this.height);
    this.context.fillRect(this.width-150,0,150,22);
    this.context.fillRect(this.width-150,22+this.height/4,150,26);
 

    this.context.textAlign = 'center';

    this.context.fillStyle = "rgb(0,0,0)";

    this.context.fillText("NEXT",this.width-71,18,120);
    this.context.fillText("POINTS",this.width-71,this.height/4 + 45,100);

    this.context.fillStyle = "rgb(13, 208, 255)";
    this.context.fillText(this.points.toString(),this.width-71,this.height/4 + 93,120);

    this.context.fillStyle = "#000";
      this.startGame();

   }

   ngOnInit(){


    this.subscriptiond = fromEvent(document,'keydown').subscribe((e:KeyboardEvent) => {
        this.keyDown(e);

    });
    this.subscriptionu = fromEvent(document,'keyup').subscribe((e:KeyboardEvent) => {
      this.keyUp(e);

  });
  this.subscriptionc = fromEvent(document,'keydown').subscribe((e:KeyboardEvent) => {
    this.keyClick(e);


  
});
    
  

   }

   startGame(){

    this.initializeGrid();



    this.nextShape();
  

     this.newBlock();


    

    this.keyInterval = setInterval(()=>this.keyPress(),40);
    this.downInterval = setInterval(()=>this.down(),this.gameSpeed);

   }


   endGame(){
    clearInterval(this.keyInterval);
    clearInterval(this.downInterval);
    this.subscriptionc.unsubscribe();
    this.subscriptiond.unsubscribe();
    this.subscriptionu.unsubscribe();
   }
   

   newBlock(){

   
      this.animationStop=0;
    
     this.blockAmount++;
 
     this.currentY = 0;
     this.currentX = 4;
    
     this.current = this.nextBlock;
     this.blockColor = this.randomBag[this.currentType*2+1];
     this.randomBag.splice(this.currentType*2,2);

  
      this.nextType = Math.floor(Math.random()*this.randomBag.length/2);
 
      
     this.s = this.sNext;

 

     let shape = [];
    for(let y=0;y<this.s;y++){
     shape[y] = [];
     for(let x=0;x<this.s;x++){
        let grid = y * this.s + x;
        if(typeof this.current[grid] !== 'undefined' && this.current[grid] ){
             shape[y][x] = 1;
        }
        else{
          shape[y][x] = 0;
        }
     }
    }
    this.current = shape;
   

    this.nextShape();

   }

   setSize(){

    if(this.currentType==0 && !this.bagU[0]){
  
        this.bagU[0]=1;
      return 4;
     }
     else if( ( this.currentType==1 && !this.bagU[0] && !this.bagU[1] ) || ( this.currentType==0 && this.bagU[0] && !this.bagU[1] ) ){
      this.bagU[1]=1;
      return 4;
     }
     else{
      return 3;
     }

   }



   initializeGrid(){
      for(let i=0;i<this.y;i++){
         let xLine = [];
         for(let y=0;y<this.x;y++){
         xLine.push([0,"#000"]);
         }
         this.grid.push(xLine);
      }
    console.log(this.grid);
   }

   down(){

   if(this.gameSpeed<100){
     this.endGame();
   }
   if(this.checkAround(0,1)){
    this.currentY++;
   }
   else{
         this.blockStop();
         if(this.end){
           this.endGame();
         }
         else{
    
          if(!this.turn){
          this.blockDSound.play();
          this.turn=1;
          }
          else{
            this.blockDSoundTwo.play();
            this.turn=0;
          }
          setTimeout(()=>{
          this.newBlock();
          
          },this.animationStop);
         }
         this.bdown=true;
    
   }
    setTimeout(()=>{
    this.drawAll();
   },this.animationStop);
   

   }

   fullDown(){

       let b = this.current;
      this.bdown=false;
       while(!this.bdown){
           this.down();
           this.pointCumulator+=3;
       }

       this.points+=this.pointCumulator;
        this.pointCumulator= 0;


   }


   keyDown(event: KeyboardEvent){
    switch (event.code){
      case 'ArrowDown':{
        this.keys[0] = 1;
        this.pointCumulator++;
    break;
      }
    }
 
  }



   keyUp(event: KeyboardEvent){
    switch (event.code){
      case 'ArrowDown':{
        this.keys[0] = 0;
    break;
   }

   }
  }

   keyPress(){

   
    if(this.keys[0]){
           this.down();
           this.pointCumulator++;
          }

     this.drawAll();
 

   }

   keyClick(event: KeyboardEvent){
       
        switch(event.code){
          case "ArrowLeft":{
            if(this.checkAround(-1)){
              this.currentX -= 1;
              this.drawAll();
            }
                break;
          }
          case "ArrowRight":{
            if(this.checkAround(1)){
              this.currentX += 1;
              this.drawAll();
            }
            break;
          }
          case "ArrowUp":{
            let rotated = this.rotation(this.current);
            if(this.checkAround(0,0,rotated)){
             this.current = rotated;
            }
            break;
          }
          case "Space":{
          this.fullDown();
          }
          break;
        }


   }


   rotation(current){
        let rotated = [];
    for(let y=0;y<this.s;y++){
      rotated[y] = [];
     for(let x=0;x<this.s;x++){
       rotated[y][x] = current[this.s-1-x][y];
     }

    }
      return rotated;
   }



   blockStop(){
     this.points+=this.pointCumulator;
     this.pointCumulator=0;
    for(let y=0;y<this.s;y++){
      for(let x=0;x<this.s;x++){
        if(this.current[y][x]){
          this.grid[y+ this.currentY][x+ this.currentX][0] = this.current[y][x];
          this.grid[y+ this.currentY][x+ this.currentX][1] = this.blockColor;
      
        }

      }
    }

     this.checkLines();
     this.drawPoints();
   }

  checkLines(){
   let combo = [80,0];

   for(let i=this.currentY;i<this.currentY+this.s;i++){
      combo = this.checkForLine(i,combo[0],0);
   }
 
    if(combo[0]!=80){

    this.lineWin.play();

    this.points+=Math.round(combo[0]);

    this.animationStop=200;

    this.gameSpeed-=12;


    clearInterval(this.downInterval);

    setTimeout(()=>{
    this.downInterval = setInterval(()=>this.down(),this.gameSpeed);
    },this.animationStop);
  
    }

  }

  checkForLine(i,c,l){
    if(i<this.y){
      let line = true;
       for(let x=0;x<this.x;x++){
           if(this.grid[i][x][0]==0){
             line = false;
           }
          }

       if(line){

         l+=1;
        c*=3.2;
        this.destroyLine(i);
        let arr = this.checkForLine(i,c,l);

        c = arr[0];
        l = arr[1];
       }
       else{
       return [c,l];
       }
  
  }

       return [c,l];
}

  destroyLine(y){
    
     for(let x=0;x<this.x;x++){
      this.grid[y][x][0] = 0;
         this.grid[y][x][1] = "#FFF";
        
     }

     this.drawAll(y);

  setTimeout(()=>{   
    let newGrid = [];
     
     for(let o=y;o>=1;o--){
       newGrid[o] = [];
        for(let x=0;x<this.x;x++){
       newGrid[o][x] = [this.grid[o-1][x][0],this.grid[o-1][x][1]];
        }
     }
     newGrid[0] = [];
     for(let i=0;i<this.x;i++){
         newGrid[0][i] = [0,"#000"];
     }

     for(let j=y+1;j<this.y;j++){
       newGrid[j] = [];
       for(let x=0;x<this.x;x++){
         newGrid[j][x] = [this.grid[j][x][0],this.grid[j][x][1]];
       }

  
         }
     this.grid = newGrid;
        },600);
  }

  checkAround(xPos = 0,yPos = 0,current = this.current){
  
   xPos += this.currentX;
   yPos += this.currentY;

   for(let y=0;y<this.s;y++){

    for(let x=0;x<this.s;x++){
       if(current[y][x]){
          if(typeof this.grid[y + yPos] === "undefined"
          || typeof this.grid[y + yPos][x + xPos] === "undefined"
          || this.grid[y + yPos][x + xPos][0]
          || x + xPos < 0
          || x + xPos >= this.x
          || y + yPos >= this.y){
            if(yPos == 1 && xPos - this.currentX === 0 && yPos - this.currentY === 1){

            
             this.end = true;
            }
            return false;
          }
          
       }
    }

   }
   return true;
  }



  nextShape(){

    let color = "";

    if(this.randomBag.length<1){
        
      this.randomBag = Array.from(this.shapes);
    this.bagU=[0,0];
    this.currentType = Math.floor(Math.random()*this.randomBag.length/2);
    }
   else{    
      this.currentType = this.nextType;
    }

    this.nextBlock = this.randomBag[this.currentType*2];
    color = this.randomBag[this.currentType*2+1];
    this.context.fillStyle = "#004";
    this.context.fillRect(this.width-142,22,140,this.height/4);

    this.sNext = this.setSize();
   
    this.context.fillStyle = color;
    for(let y=0;y<this.sNext;y++){
    for(let x=0;x<this.sNext;x++){
      let grid = y * this.sNext + x;
       if(typeof this.nextBlock[grid] !== 'undefined'
          && this.nextBlock[grid]){
        this.context.fillRect((12.5 + x)*(this.blockSize-5),(2 + y)*(this.blockSize-5),this.blockSize-7,this.blockSize-7);
      }
     } 
    }
  }

  drawPoints(){
    this.context.fillStyle = "#004";
    this.context.fillRect(this.width-142,55+this.height/4,150,50);
    this.context.fillStyle = "rgb(49, 180, 255)";
    this.context.fillText(this.points.toString(),this.width-71,this.height/4 + 93,120);
  }
 
  drawAll(z=null){
   console.log(z);
    
    this.context.fillStyle = "#333";
    this.context.fillRect(2,0,this.width - 150,this.height);

   
    for(let i = 0;i < this.grid.length;i++){
      for(let j =0;j<this.grid[i].length;j++){
       this.context.fillStyle =  this.grid[i][j][1]; 
       this.context.fillRect(j*this.blockSize+2,i*this.blockSize,this.blockSize-2,this.blockSize-2);

      }
    }


    for(let y=0;y<this.s;y++){
      for(let x=0;x<this.s;x++){
         if(this.current[y][x]){
           if((typeof this.grid[this.currentY+y][this.currentX-1] !== 'undefined' && this.grid[this.currentY+y][this.currentX-1][1]=="#FFF")
           || ( typeof this.grid[this.currentY+y][this.currentX+5] !== 'undefined' && this.grid[this.currentY+y][this.currentX+5][1]=="#FFF")){

            this.context.fillStyle = "#FFF";
           }else{
            this.context.fillStyle = this.blockColor;
           }
             this.context.fillRect((this.currentX + x)*this.blockSize+2,(this.currentY + y)*this.blockSize,this.blockSize-2,this.blockSize-2);
        
         }
      }

   }
   

  }


}