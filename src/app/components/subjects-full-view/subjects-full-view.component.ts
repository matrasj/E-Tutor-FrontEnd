import { Component, OnInit } from '@angular/core';
import {SubjectService} from "../../service/subject-service";
import {CityQuantityModel} from "../../model/city/city-quantity-model";
import {SubjectQuantityModel} from "../../model/subject/subject-quantity-model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-subjects-full-view',
  templateUrl: './subjects-full-view.component.html',
  styleUrls: ['./subjects-full-view.component.css']
})
export class SubjectsFullViewComponent implements OnInit {
  public subjectsWithQuantities: SubjectQuantityModel[] = [];
  private ALL_RECORDS: number = 0; // In backend when record's number is < 0 means that we want to get all records

  constructor(private subjectService : SubjectService,
              private router : Router) { }

  ngOnInit(): void {
    this.subjectService.getSubjectsWithAddsQuantities(this.ALL_RECORDS)
      .subscribe((subjectWithQuantities) => this.subjectsWithQuantities = subjectWithQuantities);
  }

  onAdvertisementsFilteringBySubject(subjectName: string) {
    this.router.navigate(['/advertisements'], {
      queryParams : {
        subjectName
      }
    })
  }
}
