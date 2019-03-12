import { Component, Input, AfterViewInit, OnInit,  ViewChild, ElementRef} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';

@Component({
  selector: 'app-player-canvas',
  templateUrl: './player-canvas.component.html',
  styleUrls: ['./player-canvas.component.scss']
})
export class PlayerCanvasComponent implements AfterViewInit, OnInit {
  
   @ViewChild('canvas') public canvas: ElementRef;


   @Input() private width = 600;
   @Input() private height = 800;



   private blocksX = [];
   private blocksY = [];
   private current: number = 0;

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
    
    this.blocksX.push(0);
    this.blocksY.push(0);

    this.subscription = fromEvent(document,'keydown').subscribe((e:KeyboardEvent) => {
        this.keyPress(e);

    });
	
	this.gameInterval = setInterval(function(){this.down();},500);

   }

   down(){
	   
	 this.blocksY[this.current] += 40;  
	   
   }

   keyPress(event: KeyboardEvent){

    this.context.fillStyle = "#000000";
    this.context.fillRect(0,0,this.width,this.height);

     switch (event.code){
    case 'ArrowLeft':
     this.blocksX[this.current] -= 40;
       break;
       case 'ArrowRight':
       this.blocksX[this.current] += 40;
         break;
         case 'ArrowUp':
         this.blocksY[this.current] -= 40;
           break;
           case 'ArrowDown':
           this.blocksY[this.current] += 40;
             break;
             case 'Enter':
              this.current++;
              this.blocksX.push(0);
              this.blocksY.push(0);
               break;
     }
     this.drawAll();
   }


  drawAll(){
    this.context.fillStyle = "#70A100";
    for(let i = 0;i < this.blocksX.length;i++){
        this.context.fillRect(this.blocksX[i],this.blocksY[i],40,160);
    }


  }

  }
