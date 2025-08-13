import { Routes } from '@angular/router';
import { ThreadwrapperComponent } from './Components/threadwrapper/threadwrapper.component';
import { ReplyComponent } from './Components/reply/reply.component';

export const routes: Routes = [
	{
		path : 'boards/:boardName',
		component : ThreadwrapperComponent,
		children : [
			{
				path : 'threads/:threadId',
				component : ReplyComponent
			}
		]
	}
];
