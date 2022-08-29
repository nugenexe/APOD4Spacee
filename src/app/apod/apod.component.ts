import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SecurityContext, SimpleChanges, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { APOD } from '../apod';

@Component({
  selector: 'app-apod',
  templateUrl: './apod.component.html',
  styleUrls: ['./apod.component.css']
})
export class ApodComponent implements OnInit {
  defaultMsg = 'There is not an Astronomy Picture of the Day for this date. Please select another date.';
  safeResourceURL?: SafeResourceUrl;
  @ViewChild('media', {static: false}) media!: ElementRef;
  @ViewChild('explanation', {static: false}) explanation!: ElementRef;
  
  @Input() apod?: APOD;
  @Input() enableDatePicker: boolean = false;
  @Output() dateChangeEvent = new EventEmitter<string>();
  @Output() mediaLoadedEvent = new EventEmitter();
  @Output() mediaClickedEvent = new EventEmitter<string>();

  constructor(private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges | any) {
    if (changes['apod']['currentValue']) {
      const apod = changes['apod']['currentValue'] as APOD;
      const sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(apod.url);  
      this.safeResourceURL = sanitizedURL ?? undefined;
    }
  }


  dateChangeFN() {
    this.dateChangeEvent.emit(this.apod?.date);
  }

  mediaLoaded() {
    const mediaWidth = (this.media.nativeElement as HTMLElement)?.offsetWidth;
    const explanationEl = this.explanation.nativeElement as HTMLElement;
    explanationEl.style.maxWidth = mediaWidth+'px';
    this.mediaLoadedEvent.emit();
  }

  mediaClicked() {
    this.mediaClickedEvent.emit(this.apod!.date);
  }
}
