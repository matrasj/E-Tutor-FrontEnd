import { Component, OnInit } from '@angular/core';
import {SubjectService} from "../../service/subject-service";
import {SubjectSearchResponseModel} from "../../model/subject-search-response-model";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  subjectsWithAddsQuantity : Map<string, number> = new Map<string, number>();
  constructor(private subjectService : SubjectService) { }

  ngOnInit(): void {
    this.subjectService.getEntrySubjectsWithAddsQuantities()
      .subscribe((subjectsWithQuantities) => {
        this.subjectsWithAddsQuantity = subjectsWithQuantities;
      });
  }


}
