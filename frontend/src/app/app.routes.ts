import { Routes } from '@angular/router';
import { ThreadwrapperComponent } from './Components/threadwrapper/threadwrapper.component';

export const routes: Routes = [
	{
		path : 'boards/:boardName',
		component : ThreadwrapperComponent,
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
