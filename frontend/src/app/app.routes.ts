import { Routes } from '@angular/router';

export const routes: Routes = [
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
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}
];
