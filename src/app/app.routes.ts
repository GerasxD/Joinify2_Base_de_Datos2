import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreaciongrupoComponent } from './creaciongrupo/creaciongrupo.component';
import { MisGruposComponent } from './misgrupos/misgrupos.component';
import { UnirGrupoComponent } from './unirgrupo/unirgrupo.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    { path: 'home', component: HomeComponent, data: { animation: 'home' } },
    { path: 'about', component: AboutComponent, data: { animation: 'about' } },
    { path: 'features', component: FeaturesComponent, data: { animation: 'features' } },
    { path: 'contact', component: ContactComponent, data: { animation: 'contact' } },
    { path: 'login', component: LoginComponent, data: { animation: 'login' } },
    { path: 'register', component: RegisterComponent, data: { animation: 'register' } },
    { path: 'crear-grupo', component: CreaciongrupoComponent, data: { animation: 'crear-grupo' } },
    { path: 'mis-grupos', component: MisGruposComponent, data: { animation: 'mis-grupos' } },
    { path: 'unir-grupo', component: UnirGrupoComponent, data: { animation: 'unir-grupo' } },
    { path: 'configuracion', component: ConfiguracionComponent, data: { animation: 'configuracion' } }
];
