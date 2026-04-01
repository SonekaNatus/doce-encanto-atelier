import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Avaliacoes } from './components/avaliacoes/avaliacoes';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Avaliacoes],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('doce-encanto');
}
