import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.scss'
})
export class Produtos {
  bolos = [
    { title: 'Bolo de Morango com Suspiro', description: 'Massa fofinha de baunilha, recheio de morangos frescos com creme belga e suspiros.', price: 'R$ 85,00/kg' },
    { title: 'Bolo Chocolatudo Premium', description: 'Massa black com cacau 50%, recheio duplo de brigadeiro gourmet e ganache meio amargo.', price: 'R$ 95,00/kg' },
    { title: 'Red Velvet Clássico', description: 'Tradicional massa aveludada vermelha, recheada com um delicioso creme de cream cheese.', price: 'R$ 110,00/kg' },
    { title: 'Bolo Ninho com Nutella', description: 'Massa branca de baunilha, recheio de creme de leite ninho e camada farta de Nutella pura.', price: 'R$ 105,00/kg' },
    { title: 'Bolo Sensação', description: 'Massa de chocolate belga, recheio de brigadeiro de morango trufado.', price: 'R$ 90,00/kg' },
    { title: 'Bolo de Cenoura com Vulcão', description: 'Clássico bolo de cenoura caseiro, com uma cobertura vulcão incrivelmente cremosa.', price: 'R$ 65,00' },
    { title: 'Bolo Abacaxi com Coco', description: 'Massa pão de ló super macia, recheio creme de coco com pedaços de abacaxi caramelizados.', price: 'R$ 80,00/kg' },
    { title: 'Pistache Supremo', description: 'Massa amanteigada de pistache, recheio de brigadeiro de pistache e geleia de frutas vermelhas.', price: 'R$ 130,00/kg' },
  ];
}
