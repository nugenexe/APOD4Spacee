import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { APOD } from '../apod';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.css']
})
export class ApodComponent implements OnInit {
  defaultMsg = 'There is not an Astronomy Picture of the Day for this date. Please select another date.';
  @Input() apod?: APOD;
  @Input() enableDatePicker: boolean = false;
  @Output() dateChangeEvent = new EventEmitter<string>();
  @Output() imageLoadedEvent = new EventEmitter();
  @Output() imageClickedEvent = new EventEmitter<string>();
  @ViewChild('image', {static: false}) image!: ElementRef;
  @ViewChild('explanation', {static: false}) explanation!: ElementRef;


  constructor() { }

  ngOnInit(): void {
  }

  dateChangeFN() {
    this.dateChangeEvent.emit(this.apod?.date);
  }

  imageLoaded() {
    const imageWidth = (this.image.nativeElement as HTMLElement)?.offsetWidth;
    const explanationEl = this.explanation.nativeElement as HTMLElement;
    explanationEl.style.maxWidth = imageWidth+'px';
    this.imageLoadedEvent.emit();
  }

  imageClicked() {
    this.imageClickedEvent.emit(this.apod!.date);
  }
}
