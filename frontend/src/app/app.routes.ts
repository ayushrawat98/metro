import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path : 'boards/:boardName',
		loadComponent : () => import('./Components/threadwrapper/threadwrapper.component').then(t => t.ThreadwrapperComponent),
		children : [
			{
				path : 'threads/:threadId',
				loadComponent : () => import('./Components/reply/reply.component').then(r => r.ReplyComponent)
			}
		]
	},
	{
		path : '**',
		redirectTo : 'boards/b',
		pathMatch : 'full'
	}
];
