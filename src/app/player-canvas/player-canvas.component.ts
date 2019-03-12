import { Component, Input, AfterViewInit, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { Subscription, fromEvent, TimeInterval } from 'rxjs';

@Component({
  selector: 'app-player-canvas',
  templateUrl: './player-canvas.component.html',
  styleUrls: ['./player-canvas.component.scss']
})
export class PlayerCanvasComponent implements AfterViewInit, OnInit {
  
   @ViewChild('canvas') public canvas: ElementRef;


   @Input() private width = 600;
   @Input() private height = 880;


   private x = 15;
   private y = 22;
   private grid = [];
   private blockSize = 40;
   private blockAmount = 0;
   private current = [];
   private shapes = [
      [1,1,1,1,
       0,0,0,0],
      [1,1,0,0,
        1,1,0,0],
      [0,1,0,0,
        1,1,1,0],
      [1,0,0,0,
          1,1,1,0],
      [1,0,0,0,
            1,0,0,0,
            1,1,0,0],

   ];
   private end: boolean = false;

   private currentX: number = 0;
   private currentY: number = 0;
   private currentType: number = 0;
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


    this.gameInterval = setInterval(()=>this.down(),200);

   }
   

   newBlock(){
     this.currentX = Math.floor(Math.random()*12);
     this.currentY = 0;
     this.currentType = Math.floor(Math.random()*5);

     this.current = this.shapes[this.currentType];


     let shape = [];
    for(let y=0;y<4;y++){
     shape[y] = [];
     for(let x=0;x<4;x++){
        let grid = y * 4 + x;
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
         xLine.push(0);
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
    }
       break;
       case 'ArrowRight':{
       if(this.checkAround(1)){
        this.currentX += 1;
        this.drawAll();
      }
       }
         break;
           case 'ArrowDown':
           this.down();
       
             break;
     }
     this.drawAll();

   }




   blockStop(){
    for(let y=0;y<4;y++){
      for(let x=0;x<4;x++){
        if(this.current[y][x]){
          this.grid[y+ this.currentY][x+ this.currentX] = this.current[y][x];
        }

      }
    }

   }

  

  checkAround(xPos = 0,yPos = 0,current = this.current){
  
   xPos += this.currentX;
   yPos += this.currentY;

   for(let y=0;y<4;y++){

    for(let x=0;x<4;x++){
       if(current[y][x]){
          if(typeof this.grid[y + yPos] === "undefined"
          || typeof this.grid[y + yPos][x + xPos] === "undefined"
          || this.grid[y + yPos][x + xPos]
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
    this.context.fillStyle = "#000000";
    this.context.fillRect(0,0,this.width,this.height);
    this.context.fillStyle = "#70A100";
    for(let i = 0;i < this.grid.length;i++){
      for(let j =0;j<this.grid[i].length;j++){
        if(this.grid[i][j]) this.context.fillRect(j*this.blockSize,i*this.blockSize,this.blockSize-1,this.blockSize-1);
      }
    }

    if(this.currentType == 0){
      this.context.fillStyle = "#0071A0";
    }
    else if(this.currentType == 1){
      this.context.fillStyle = "#A07100";
    }
    else if(this.currentType == 2){
      this.context.fillStyle = "#0021F0";
    }
    else if(this.currentType == 3){
      this.context.fillStyle = "#802130";
    }
    else{
      this.context.fillStyle = "#80F1F0";
    }
   for(let y=0;y<4;y++){
      for(let x=0;x<4;x++){
         if(this.current[y][x]){
             this.context.fillRect((this.currentX + x)*this.blockSize,(this.currentY + y)*this.blockSize,this.blockSize-1,this.blockSize-1);
         }
      }

   }



  }

  }
