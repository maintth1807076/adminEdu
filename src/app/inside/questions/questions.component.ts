import { Component, OnInit } from '@angular/core';

// enum QuestionType {
//   YesOrNo = 1,
//   AnOption = 2,
//   ManyChoices = 3,
//   TransplantAnswers = 4,
//   ChooseWord = 5,
//   FillTheWord = 6,
//   Essay = 7,
// }

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  constructor() { }

  // isDisplayed = false;

  // showMe($event, type) {
  //   if (this.isDisplayed) {
  //     this.isDisplayed = false;
  //   } else {
  //     this.isDisplayed = true;
  //   }
  //   switch (type) {
  //     case 'YesOrNo':
  //       document.getElementById('divContent1').style.display = "block";
  //     case 'AnOption':
  //       document.getElementById('divContent1').style.display = "none";
  //       document.getElementById('divContent2').style.display = "block";
  //   }
  // }

  isShow = false;
 
  toggleDisplay() {
    this.isShow = !this.isShow;
  }
  
    ngOnInit(): void {
  }

}
