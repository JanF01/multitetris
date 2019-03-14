import { Component, Input, AfterViewInit, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { Subscription, fromEvent, TimeInterval } from 'rxjs';

@Component({
  selector: 'app-player-canvas',
  templateUrl: './player-canvas.component.html',
  styleUrls: ['./player-canvas.component.scss']
})
export class PlayerCanvasComponent implements AfterViewInit, OnInit {
  
   @ViewChild('canvas') public canvas: ElementRef;


   @Input() private width = 500;
   @Input() private height = 700;


   private x = 10;
   private y = 20;
   private grid = [];
   private blockSize = 35;
   private blockAmount = 0;
   private current = [];
   private nextBlock = [];
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
   private currentX: number = 0;
   private currentY: number = 0;
   private currentType: number = 0;
   private nextType: number = 0;
   private blockColor: string = "";
   private gameSpeed: number = 800;
   private keyInterval;
   private downInterval;
   private lineOut;

  private subscriptiond: Subscription;
  private subscriptionu: Subscription;
  private subscriptionc: Subscription

  private keys = [0];

   private context: CanvasRenderingContext2D;



     ngAfterViewInit(){
      const canvas: HTMLCanvasElement = this.canvas.nativeElement;
      this.context = canvas.getContext('2d');

      canvas.width = this.width;
      canvas.height = this.height;
      this.context.lineWidth = 3;

  
      this.context.fillStyle = "#004";
    this.context.fillRect(this.width-150,0,this.width,this.height);
    this.context.fillRect(this.width-150,55+this.height/4,150,50);
     this.context.fillStyle = "rgb(43, 148, 255)";
    this.context.fillRect(this.width-150,0,8,this.height);
    this.context.fillRect(this.width-150,0,150,22);
    this.context.fillRect(this.width-150,22+this.height/4,150,22);
 

    this.context.font = "18px 'Press Start 2P'";
    this.context.textAlign = 'center';
    this.context.fillStyle =  this.context.fillStyle = "rgb(0,0,0)";

    this.context.fillText("NEXT",this.width-71,18,60);
    this.context.fillText("POINTS",this.width-71,this.height/4 + 43,60);

    this.context.fillStyle =  this.context.fillStyle = "rgb(13, 208, 255)";
    this.context.fillText(this.points.toString(),this.width-71,this.height/4 + 90,60);

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

  

     this.newBlock();


    

    this.keyInterval = setInterval(()=>this.keyPress(),40);
    this.downInterval = setInterval(()=>this.down(),this.gameSpeed);

   }
   

   newBlock(){

   
      if(this.blockAmount%(this.shapes.length/2)==0){
        
        this.randomBag = Array.from(this.shapes);
      this.bagU=[0,0];
      this.currentType = Math.floor(Math.random()*this.randomBag.length/2);
      this.nextBlock = this.randomBag[this.currentType*2];
      }
      else{
       this.currentType = this.nextType;
       this.nextBlock = this.randomBag[this.currentType*2];
      }
    
     this.blockAmount++;
 
     this.currentY = 0;
     this.currentX = 4;
    
     this.current = this.nextBlock;
     this.blockColor = this.randomBag[this.currentType*2+1];
     this.randomBag.splice(this.currentType*2,2);

  
      this.nextType = Math.floor(Math.random()*this.randomBag.length/2);
      this.drawMenu();
      

     if(this.currentType==0 && !this.bagU[0]){
      this.s = 4;
      this.bagU[0]=1;
     }
     else if( ( this.currentType==1 && !this.bagU[0] && !this.bagU[1] ) || ( this.currentType==0 && this.bagU[0] && !this.bagU[1] ) ){
      this.s = 4;
      this.bagU[1]=1;
     }
     else{
       this.s = 3;
     }



 

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

  
   if(this.checkAround(0,1)){
    this.currentY++;
   }
   else{
         this.blockStop();
         if(this.end){
           clearInterval(this.keyInterval);
           clearInterval(this.downInterval);
         }
         else{
       this.newBlock();
         }


   }
   this.drawAll();
   

   }


   keyDown(event: KeyboardEvent){
    switch (event.code){
      case 'ArrowDown':{
        this.keys[0] = 1;
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
             this.down();
            }
          }
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
    for(let y=0;y<this.s;y++){
      for(let x=0;x<this.s;x++){
        if(this.current[y][x]){
          this.grid[y+ this.currentY][x+ this.currentX][0] = this.current[y][x];
          this.grid[y+ this.currentY][x+ this.currentX][1] = this.blockColor;
      
        }

      }
    }

     this.checkLines();
   }

  checkLines(){
   let combo = 10;
    for(let i=this.currentY+this.s-1;i>=this.currentY;i--){
      combo = this.checkForLine(i,combo);

    }
    if(combo!=10){
    this.points+=Math.round(combo);
    this.context.fillStyle = "#004";
    this.context.fillRect(this.width-142,55+this.height/4,150,50);
    this.context.fillStyle = "rgb(49, 180, 255)";
    this.context.fillText(this.points.toString(),this.width-71,this.height/4 + 90,60);
    }
  }

  checkForLine(i,c){
    if(i<this.y){
      let line = true;
       for(let x=0;x<this.x;x++){
           if(this.grid[i][x][0]==0){
             line = false;
           }
          }
       if(line){
         this.gameSpeed-=10;
         clearInterval(this.downInterval);
         c*=2.5;
         this.destroyLine(i);
         this.downInterval = setInterval(()=>this.down(),this.gameSpeed);
         c = this.checkForLine(i,c);
       }
       else{
       return c;
       }
  
  }
  return c;
}

  destroyLine(y){
    
     for(let x=0;x<this.x;x++){
      this.grid[y][x][0] = 0;
         this.grid[y][x][1] = "#ff8";
        
     }
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

             console.log('You lost');
             this.end = true;
            }
            return false;
          }
          
       }
    }

   }
   return true;
  }



  drawMenu(){
 
    this.context.fillStyle = "#004";
    this.context.fillRect(this.width-142,22,140,this.height/4);

  
   
    this.context.fillStyle = "#A04";
  //  for(let y=0;y<4;y++){
  //   for(let x=0;x<4;x++){
  //     if(typeof this.randomBag[this.nextType*2][y] !== 'undefined'
  //       && typeof this.randomBag[this.nextType*2][y][x] !=='undefined'
  //       && this.randomBag[this.nextType*2][y][x]){
  //      this.context.fillRect((14 + x)*(this.blockSize-8),(2 + y)*(this.blockSize-8),this.blockSize-10,this.blockSize-10);
  //    }
  //   } 
  //  }
  }
 
  drawAll(){
   
    this.context.fillStyle = "#333";
    this.context.fillRect(2,0,this.width - 150,this.height);
   
    for(let i = 0;i < this.grid.length;i++){
      for(let j =0;j<this.grid[i].length;j++){
       this.context.fillStyle =  this.grid[i][j][1]; 
       this.context.fillRect(j*this.blockSize+2,i*this.blockSize,this.blockSize-2,this.blockSize-2);

      }
    }

    this.context.fillStyle = this.blockColor;
   for(let y=0;y<this.s;y++){
      for(let x=0;x<this.s;x++){
         if(this.current[y][x]){
             this.context.fillRect((this.currentX + x)*this.blockSize+2,(this.currentY + y)*this.blockSize,this.blockSize-2,this.blockSize-2);
        
         }
      }

   }



  }

  }
