import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SubjectSearchResponseModel} from "../../../../model/subject-search-response-model";
import {SubjectService} from "../../../../service/subject-service";
import {UntypedFormControl} from "@angular/forms";
import {ReplaySubject, Subject, take, takeUntil} from "rxjs";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-create-advertisement',
  templateUrl: './create-advertisement.component.html',
  styleUrls: ['./create-advertisement.component.css']
})
export class CreateAdvertisementComponent implements OnInit, AfterViewInit, OnDestroy{
  /** list of banks */
  protected subjects: SubjectSearchResponseModel[] = [];

  /** control for the selected bank */
  public subjectCtrl: UntypedFormControl = new UntypedFormControl();

  /** control for the MatSelect filter keyword */
  public subjectFilterCtrl: UntypedFormControl = new UntypedFormControl();

  /** list of banks filtered by search keyword */
  public filteredSubjects: ReplaySubject<SubjectSearchResponseModel[]> = new ReplaySubject<SubjectSearchResponseModel[]>(1);

  // @ts-ignore
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  @Input() placeholderLabel = 'Search';

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  constructor(private subjectService : SubjectService) { }

  ngOnInit(): void {
    this.subjectService.getAllSubjects()
      .subscribe((subjects) => {
        this.subjects = subjects;
        this.subjectCtrl.setValue(this.subjects[10]);

        // load the initial bank list
        this.filteredSubjects.next(this.subjects.slice());

        // listen for search field value changes


        this.subjectFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            console.log("Sf")
            this.filterSubjects();
          });
      })


  }
  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.filteredSubjects
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelect.compareWith = (a: SubjectSearchResponseModel, b: SubjectSearchResponseModel) => a && b && a.id === b.id;
      });
  }

  protected filterSubjects() {
    if (!this.subjects) {
      return;
    }
    // get the search keyword
    let search = this.subjectFilterCtrl.value;
    console.log(search)
    if (!search) {
      this.filteredSubjects.next(this.subjects.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredSubjects.next(
      this.subjects.filter(subject => subject.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
