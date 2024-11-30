import { Component, Input, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { debounceTime, Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  public files: any = [];
  private searchSubject = new Subject<string>(); // Debouncing subject
  public searchValue = '';

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchterm) => {
      this.documentService.getAllFiles(searchterm).subscribe((res: any) => {
        console.log(res);
        this.files = res.results;
      })
    });
  }

  onSearchTermChange(value: string) {
    this.searchSubject.next(value);
  }
}
