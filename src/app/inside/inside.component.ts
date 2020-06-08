import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.css']
})
export class InsideComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
  async ngAfterViewInit() {
    // <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
    await this.loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
    await this.loadScript('/assets/js/jquery.min.js');
    await this.loadScript('/assets/js/popper.js');
    await this.loadScript('/assets/js/bootstrap.min.js');
    await this.loadScript('/assets/js/main.js');
  }
  loadScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    })
  }
}
