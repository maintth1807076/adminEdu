import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrls: ['./inside.component.css']
  
})
export class InsideComponent implements OnInit {
  constructor(public afs: AngularFirestore,public authService : AuthService) { }

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

  logOut() {
    this.authService.doLogout()
      .then((res) => {
        this.afs.firestore.disableNetwork();
        window.localStorage.removeItem('lastLogin');
        window.localStorage.removeItem('timeExpired');
        // this.router.navigate(['/login']);
      }, (error) => {
        console.log("Logout error", error);
      });
  }
}
