import { Routes } from '@angular/router';
import { LandingPageComponent } from './Components/landing-page/landing-page.component';

export const routes: Routes = [
	{
		path: '',
		component: LandingPageComponent
	},
	{
		path: 'main',
		loadComponent : () => import('./Components/main-page/main-page.component').then(r => r.MainPageComponent),
		children: [
			{
				path: 'boards/:boardName',
				loadComponent: () => import('./Components/threadwrapper/threadwrapper.component').then(r => r.ThreadwrapperComponent),
				children: [
					{
						path: 'threads/:threadId',
						loadComponent: () => import('./Components/reply/reply.component').then(r => r.ReplyComponent)
					}
				]
			},
		]
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}
];
