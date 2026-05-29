import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { Avaliacoes } from './components/avaliacoes/avaliacoes';
import { ImageService } from './services/image.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Avaliacoes],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('doce-encanto');
  private readonly imageService = inject(ImageService);

  ngOnInit() {
    // Carrega todas as imagens uma única vez ao iniciar o app
    this.imageService.carregar().subscribe();
  }
}
