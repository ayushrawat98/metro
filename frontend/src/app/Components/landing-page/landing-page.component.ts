import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
	router = inject(Router)

	ngOnInit(){
		const landingDone = localStorage.getItem('landingDone')
		if(landingDone && landingDone == 'true'){
			this.router.navigate(['main'])
		}
	}
	gotoMainPage(){
		this.router.navigate(['main'])
		localStorage.setItem('landingDone', 'true')
	}
}
