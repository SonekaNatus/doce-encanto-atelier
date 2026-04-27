import { Component, inject, signal, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cardapio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cardapio.html',
  styleUrl: './cardapio.scss'
})
export class Cardapio implements OnInit {
  protected readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  sections = [
    {
      id: 'novidades',
      title: 'Novidades',
      items: [
        { title: 'Bolo de Pistache com Frutas Vermelhas', description: 'Massa amanteigada de pistache com geleia artesanal de frutas vermelhas.', price: 135.0, image: '/assets/categorias/especiais.jpg' },
        { title: 'Bolo Duo Trufado', description: 'Combinação perfeita de trufa branca e trufa meio amargo.', price: 98.0, image: '/assets/categorias/chocolate.jpg' },
        { title: 'Delícia de Abacaxi Zero', description: 'Versão zero açúcar do nosso clássico de abacaxi com coco.', price: 110.0, image: '' }
      ]
    },
    {
      id: 'chocolate',
      title: 'Bolos de chocolate',
      items: [
        { title: 'Chocolatudo Premium', description: 'Massa black com cacau 50%, recheio duplo de brigadeiro gourmet.', price: 95.0, image: '/assets/categorias/chocolate.jpg' },
        { title: 'Sensação', description: 'Massa de chocolate belga, recheio de brigadeiro de morango trufado.', price: 90.0, image: '' },
        { title: 'Brigadeiro Belga', description: 'Massa de chocolate com recheio de brigadeiro de chocolate belga.', price: 88.0, image: '' },
        { title: 'Duo Chocolate', description: 'Massa de chocolate com recheio de chocolate branco e ao leite.', price: 92.0, image: '' }
      ]
    },
    {
      id: 'brancos',
      title: 'Bolos brancos',
      items: [
        { title: 'Ninho com Nutella', description: 'Massa branca de baunilha, recheio de leite ninho e Nutella.', price: 105.0, image: '/assets/categorias/brancos.jpg' },
        { title: 'Quatro Leites', description: 'Massa branca com recheio cremoso de quatro leites.', price: 87.0, image: '/assets/categorias/brancos.jpg' },
        { title: 'Morango com Suspiro', description: 'Massa de baunilha, morangos frescos e creme belga.', price: 85.0, image: '' },
        { title: 'Abacaxi com Coco', description: 'Massa pão de ló, creme de coco e abacaxi caramelizado.', price: 80.0, image: '' }
      ]
    },
    {
      id: 'zero',
      title: 'Zero Açúcar',
      items: [
        { title: 'Chocolate Zero', description: 'Massa de chocolate 70% cacau sem açúcar, recheio de ganache fit.', price: 110.0, image: '' },
        { title: 'Frutas Vermelhas Zero', description: 'Massa branca funcional com geleia de frutas vermelhas sem açúcar.', price: 115.0, image: '/assets/categorias/zero.jpg' },
        { title: 'Coco Zero', description: 'Bolo de coco fofinho sem açúcar e sem glúten.', price: 98.0, image: '' }
      ]
    },
    {
      id: 'caseiros',
      title: 'Bolos caseiros',
      items: [
        { title: 'Cenoura com Chocolate', description: 'Clássico bolo de cenoura com cobertura de brigadeiro.', price: 45.0, image: '' },
        { title: 'Fubá com Goiabada', description: 'Bolo de fubá cremoso com pedaços de goiabada.', price: 35.0, image: '' },
        { title: 'Milho Cremoso', description: 'Bolo de milho verde super úmido e saboroso.', price: 38.0, image: 'assets/categorias/caseiros.jpg' },
        { title: 'Laranja Especial', description: 'Bolo de laranja natural com calda cítrica.', price: 32.0, image: '' }
      ]
    },
    {
      id: 'especiais',
      title: 'Bolos Especiais',
      items: [
        { title: 'Red Velvet Clássico', description: 'Massa aveludada vermelha com creme de cream cheese.', price: 110.0, image: '' },
        { title: 'Pistache Supremo', description: 'Massa amanteigada de pistache e geleia de frutas vermelhas.', price: 130.0, image: '/assets/categorias/especiais.jpg' },
        { title: 'Nozes Real', description: 'Massa de nozes com recheio de doce de leite e nozes picadas.', price: 120.0, image: '' }
      ]
    }
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['buy'] === 'true') {
        this.openModal(this.sections[0].items[0]);
      } else if (params['bolo']) {
        const boloName = params['bolo'];
        for (const section of this.sections) {
          const bolo = section.items.find(item => item.title.toLowerCase() === boloName.toLowerCase());
          if (bolo) {
            this.openModal(bolo);
            break;
          }
        }
      }
    });

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        setTimeout(() => {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 400); // Increased delay slightly
      }
    });
  }

  selectedBolo: any = null;
  modalOpen = false;
  showSuccess = false;
  selectedOption: number | 'custom' = 4;
  customWeight: number = 1;
  calculatedWeight: number = 1;
  totalPrice: number = 0;

  get isWeightInvalid(): boolean {
    return this.selectedOption === 'custom' && this.customWeight > 5;
  }

  openModal(bolo: any) {
    this.selectedBolo = bolo;
    this.modalOpen = true;
    this.showSuccess = false;
    this.selectOption(4);
  }

  closeModal() {
    this.modalOpen = false;
    this.selectedBolo = null;
    this.showSuccess = false;
  }

  selectOption(opt: number | 'custom') {
    this.selectedOption = opt;
    if (opt !== 'custom') {
      this.calculatedWeight = opt * 0.25;
    } else {
      this.calculatedWeight = this.customWeight;
    }
    this.updatePrice();
  }

  onCustomWeightChange(event: any) {
    this.customWeight = parseFloat(event.target.value) || 0;
    this.calculatedWeight = this.customWeight;
    this.updatePrice();
  }

  updatePrice() {
    if (this.selectedBolo) {
      this.totalPrice = this.selectedBolo.price * this.calculatedWeight;
    }
  }

  addToCart() {
    if (this.selectedBolo && !this.isWeightInvalid) {
      this.cartService.addItem({
        id: Math.random().toString(36).substr(2, 9),
        title: this.selectedBolo.title,
        image: this.selectedBolo.image || '/assets/placeholder-cake.png',
        weight: this.calculatedWeight,
        pricePerKg: this.selectedBolo.price,
        totalPrice: this.totalPrice
      });

      this.showSuccess = true;
      this.cdr.detectChanges();
      
      setTimeout(() => {
        this.closeModal();
        this.cdr.detectChanges();
      }, 2000);
    }
  }
}
