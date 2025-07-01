import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/matches',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('../modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'matches',
    loadChildren: () => import('../modules/matches/matches.module').then(m => m.MatchesModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('../modules/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('../modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '/matches'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
