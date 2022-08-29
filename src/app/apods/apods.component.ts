import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import { APOD } from '../apod';
import { APODService } from '../apod.service';
import config from '../../../config.json' assert {type: 'json'}

@Component({
  selector: 'app-apods',
  templateUrl: './apods.component.html',
  styleUrls: ['./apods.component.css']
})
export class ApodsComponent implements OnInit {
  private setCarouselPosition = new Subject<number>(); 
  private readonly margin = config.apodMargin;

  prevAPOD?: APOD = undefined;
  currAPOD?: APOD = undefined;
  nextAPOD?: APOD = undefined;

  @ViewChild('prevAPODEl', {static: false}) prevAPODEl!: ElementRef;
  @ViewChild('currAPODEl', {static: false}) currAPODEl!: ElementRef;
  @ViewChild('nextAPODEl', {static: false}) nextAPODEl!: ElementRef;

  constructor(private apodService: APODService) { }

  ngOnInit(): void {
    this.setCarouselPosition
      .pipe(debounceTime(200))
      .subscribe(this.updateCarouselPositions.bind(this));

    this.updateAPODs();
  }

  updateAPODs(date?: string) {  
    // TODO
    // let currDate = '2022-08-22' youtube
    // let currDate1 = '2022-08-23' //copyrigth
    // let currDate = '2022-08-25';

    const localDate = date ? new Date(date) : new Date();

    // Timezones could mess up
    // Setting date to avoid UTC time conversions
    const currDate = new Date(localDate);
    // const currDate =  date ? new Date(date) : new Date();
    let prevDate = new Date(localDate);
    let nextDate = new Date(localDate);

    prevDate.setDate(currDate.getDate() - 1);
    nextDate.setDate(currDate.getDate() + 1);

    this.apodService.getAPOD(currDate.toISOString().split('T')[0])
      .subscribe(apod => this.currAPOD = apod)
      
    this.apodService.getAPOD(prevDate.toISOString().split('T')[0])
      .subscribe(apod => this.prevAPOD = apod)
    
    this.apodService.getAPOD(nextDate.toISOString().split('T')[0])
      .subscribe(apod => this.nextAPOD = apod)
  }

  dateChanged(date: string) {
    this.updateAPODs(date);
  }

  mediaLoaded() {
    this.setCarouselPosition.next(window.outerWidth)
  }

  mediaClicked(date: string) {
    this.updateAPODs(date);
  }
  
  onResize($event: UIEvent) {
    let target: Window = $event.target as Window;
    this.setCarouselPosition.next(target.innerWidth);
  }

  // Gets the width of APODs on screen. Then will attempt to flank the
  // current APOD with prev and next APOD, showing only 25% of the flanking
  // APODs. If 25% is not possible, then showing less of the flanking APODs
  // is acceptable up to a limit/margin.
  updateCarouselPositions(width: number) {
    // All math is done in pixel units

    if (!this.currAPOD) {
      return;
    }

    // Get available space between center APOD and end
    const currAPODEl_Width = (this.currAPODEl.nativeElement as HTMLElement)?.offsetWidth;
    const totalAvailSpace = width - currAPODEl_Width;
    const availSpaceOneSide = totalAvailSpace / 2;

    // Calculate previous APOD position
    let prevAPOD75px = 0
    if (this.prevAPOD) {
      const prevAPODEl_Width = (this.prevAPODEl.nativeElement as HTMLElement)?.offsetWidth;

      // Find the pixels to hide 75% of image
      prevAPOD75px = prevAPODEl_Width * 0.75;
      // Then find the amount of margin between prev and curr APOD with 75% hidden
      const leftSideAvailSpace = availSpaceOneSide - (prevAPODEl_Width - prevAPOD75px);

      // If there is less space then the specified margin, then margin will be the allowed distance
      if (leftSideAvailSpace < this.margin) {
        prevAPOD75px = prevAPODEl_Width - (availSpaceOneSide - this.margin)
      }

      this.prevAPODEl.nativeElement.style.left = '-'+ prevAPOD75px + 'px';
    }

    // Calculate next APOD position
    let nextAPOD75px = 0
    if (this.nextAPOD) {
      const nextAPODEl_Width = (this.nextAPODEl.nativeElement as HTMLElement)?.offsetWidth;

      // Find the pixels to hide 75% of image
      nextAPOD75px = nextAPODEl_Width * 0.75;
      // Then find the amount of margin between next and curr APOD with 75% hidden
      const leftSideAvailSpace = availSpaceOneSide - (nextAPODEl_Width - nextAPOD75px);

      // If there is less space then the specified margin, then margin will be the allowed distance
      if (leftSideAvailSpace < this.margin) {
        nextAPOD75px = nextAPODEl_Width - (availSpaceOneSide - this.margin)
      }
      
      this.nextAPODEl.nativeElement.style.right = '-'+ nextAPOD75px + 'px';
    }
  }
}
