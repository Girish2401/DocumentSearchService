import { Component, Input, OnInit } from '@angular/core';
import { DocumentService } from './document.service';
import { debounceTime, Subject } from 'rxjs';
import { Data } from '@angular/router';
import { DatePipe } from '@angular/common';

interface DataItem {
  filename: string
  modifiedDate: string
  size: number
  url: string
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  public files1: any = [];
  private searchSubject = new Subject<string>(); // Debouncing subject
  public searchValue = '';
  public filteredFiles: DataItem[] = [];

  recentFiles: DataItem[] = []

  files: DataItem[] = [];
  availableFileTypes: any = ["txt", "pdf", "docx"];

  selectedFiles: any = [];
  availableDates: any = [];
  selectedDates: any = [];
  isFiltersEnabled: boolean = false;

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService.getAllFiles().subscribe((res: any) => {
      console.log(res);
      this.recentFiles = res.results.sort((a: any, b: any) => { return new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime() });
      this.recentFiles = this.recentFiles.splice(0, 4);

    })
    this.searchSubject.pipe(debounceTime(500)).subscribe((searchterm) => {
      if (!searchterm) {
        this.files = [];
        this.filteredFiles = [];
        this.isFiltersEnabled = false
        return;
      }
      this.documentService.getRequiredFiles(searchterm).subscribe((res: any) => {
        this.files = res.results;
        this.filteredFiles = res.results;
        this.files.forEach((item) => {
          let date = item.modifiedDate.split('T')[0];
          if (!this.availableDates.includes(date)) {
            this.availableDates.push(date);
          }
        });
      })
    });
  }

  onSearchTermChange(value: string) {
    this.searchSubject.next(value);
  }

  getFileExtension(fileName: string): string {
    return fileName.slice(-3).toLowerCase();
  }

  filterFiles(event: any) {
    if (!this.selectedFiles.length && !this.selectedDates.length) {
      this.filteredFiles = this.files;
    }
    else {
      this.filteredFiles = this.files.filter((file) => {
        if (this.selectedFiles.includes(file.filename.split('.')[1]))
          return true;
        else if (this.selectedDates.includes(file.modifiedDate.split('T')[0]))
          return true;
        return false
      }
      );
    }
  }

  toggleFilters() {
    this.isFiltersEnabled = !this.isFiltersEnabled;
  }
}
