import { Component, Input, AfterViewInit, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { Subscription, fromEvent, TimeInterval } from 'rxjs';

@Component({
  selector: 'app-player-canvas',
  templateUrl: './player-canvas.component.html',
  styleUrls: ['./player-canvas.component.scss']
})
export class PlayerCanvasComponent implements AfterViewInit, OnInit {
  
   @ViewChild('canvas') public canvas: ElementRef;


   @Input() private width = 420;
   @Input() private height = 770;


   private x = 12;
   private y = 22;
   private grid = [];
   private blockSize = 35;
   private blockAmount = 0;
   private current = [];
   private shapes = [
      [0,0,0,0,
       1,1,1,1],
      [1,1,0,
       1,1,0],
      [0,1,0,
        1,1,1],

      [1,1,0,
      0,1,1],
      [0,1,1,
        1,1,0],
      [1,0,0,
       1,1,1],
       [0,0,1,
        1,1,1],

   ];
   private end: boolean = false;
   private s = 4;
   private currentX: number = 0;
   private currentY: number = 0;
   private currentType: number = 0;
   private blockColor: string = "";
   private gameInterval;

  private subscription: Subscription;


   private context: CanvasRenderingContext2D;



     ngAfterViewInit(){
      const canvas: HTMLCanvasElement = this.canvas.nativeElement;
      this.context = canvas.getContext('2d');

      canvas.width = this.width;
      canvas.height = this.height;
      this.context.lineWidth = 3;
      this.context.strokeStyle="#FFF";
      this.context.fillStyle = "#000000";
      this.context.fillRect(0,0,this.width,this.height);
      this.context.fillStyle = "#70A100";

   }

   ngOnInit(){

    this.startGame();

    this.subscription = fromEvent(document,'keydown').subscribe((e:KeyboardEvent) => {
        this.keyPress(e);

    });
    
  

   }

   startGame(){

    this.initializeGrid();

     this.newBlock();


    this.gameInterval = setInterval(()=>this.down(),350);

   }
   

   newBlock(){
    
     this.currentY = 0;
     this.currentX = 4;
     this.currentType = Math.floor(Math.random()*7);
     if(this.currentType==0){
      this.s = 4;
      this.blockColor = "#0071A0";
     }
     else{
       this.s = 3;
     }



 
    if(this.currentType == 1){
      this.blockColor = "#A07100";
    }
    else if(this.currentType == 2){
      this.blockColor = "#0021F0";
    }
    else if(this.currentType == 3){
      this.blockColor = "#802130";
    }
    else if(this.currentType == 4){
      this.blockColor = "#F0F180";
    }
    else if(this.currentType == 5){
      this.blockColor = "#80F1F0";
    }
    else if(this.currentType == 6){
      this.blockColor = "#F080F1";
    }

     this.current = this.shapes[this.currentType];
   

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
         xLine.push([0,"#151515"]);
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
           clearInterval(this.gameInterval);
         }
         else{
       this.newBlock();
         }


   }
   this.drawAll();
   

   }

   keyPress(event: KeyboardEvent){

     switch (event.code){
       case 'ArrowLeft':{
     if(this.checkAround(-1)){
       this.currentX -= 1;
       this.drawAll();
     }
     break;
    }
       case 'ArrowRight':{
       if(this.checkAround(1)){
        this.currentX += 1;
        this.drawAll();
      }
      break;
       }
       case 'ArrowDown':{
           this.down();
           break; 
           }
          case 'ArrowUp':{
            if(this.currentType!=1){
            let rotated = this.rotation(this.current);
            if(this.checkAround(0,0,rotated)){
             this.current = rotated;
              this.down();
            }
          }
            break; 
          }
      }
     this.drawAll();

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

    for(let i=this.currentY+this.s-1;i>=this.currentY;i--){
     this.checkForLine(i);

    }
  }

  checkForLine(i){
    if(i<this.y){
      let line = true;
       for(let x=0;x<this.x;x++){
           if(this.grid[i][x][0]==0){
             line = false;
           }
          }
       if(line){
         this.destroyLine(i); 
         this.checkForLine(i);
       }
       else{
       return false;
       }
  
  }
}

  destroyLine(y){
     for(let x=0;x<this.x;x++){
         this.grid[y][x][0] = 0;
         this.grid[y][x][1] = "#151515";
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
         newGrid[0][i] = [0,"#151515"];
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

 
  drawAll(){
    this.context.fillStyle = "#000";
    this.context.fillRect(0,0,this.width,this.height);
   
    for(let i = 0;i < this.grid.length;i++){
      for(let j =0;j<this.grid[i].length;j++){
       this.context.fillStyle =  this.grid[i][j][1]; 
       this.context.fillRect(j*this.blockSize,i*this.blockSize,this.blockSize-1,this.blockSize-1);

      }
    }

    this.context.fillStyle = this.blockColor;
   for(let y=0;y<this.s;y++){
      for(let x=0;x<this.s;x++){
         if(this.current[y][x]){
             this.context.fillRect((this.currentX + x)*this.blockSize,(this.currentY + y)*this.blockSize,this.blockSize-1,this.blockSize-1);
         }
      }

   }



  }

  }
