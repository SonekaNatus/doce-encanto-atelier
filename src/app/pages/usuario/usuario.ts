import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';

interface Bolo {
  id?: number;
  sectionId: number;
  title: string;
  description: string;
  price: number;
  image: string;
  destaque: boolean;
}

interface Section {
  id?: number;
  title: string;
  image: string;
}

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss',
})
export class Usuario implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  readonly imageService = inject(ImageService);

  private readonly apiUrl = 'http://localhost:3000';

  user = this.authService.currentUser;
  isAdm = computed(() => this.user()?.adm === true);

  // Profile editing
  editing = signal(false);
  editName = '';
  editPassword = '';
  showPassword = signal(false);
  saving = signal(false);

  // Admin data
  sections = signal<Section[]>([]);
  bolos = signal<Bolo[]>([]);

  // Imagens disponíveis para o dropdown (estáticas + cadastradas)
  get availableImages() {
    const estaticas = [
      { label: 'especiais.jpg', value: '/assets/categorias/especiais.jpg' },
      { label: 'chocolate.jpg', value: '/assets/categorias/chocolate.jpg' },
      { label: 'brancos.jpg', value: '/assets/categorias/brancos.jpg' },
      { label: 'zero.jpg', value: '/assets/categorias/zero.jpg' },
      { label: 'caseiros.jpg', value: '/assets/categorias/caseiros.jpg' },
      { label: 'hero-cake.png', value: '/images/hero-cake.png' },
      { label: '(sem imagem)', value: '' },
    ];
    const cadastradas = this.imageService.imagensDisponiveis().map(img => ({
      label: img.nome,
      value: img.nome, // salva só o nome; ImageService resolve o base64 na exibição
    }));
    return [...cadastradas, ...estaticas];
  }

  // Bolo Modal
  showBoloModal = signal(false);
  modalAnimating = signal(false);
  editingBolo = signal<Bolo | null>(null);
  boloForm: Bolo = this.emptyBolo();
  boloErrors: Record<string, string> = {};

  // Section Modal
  showSectionModal = signal(false);
  sectionModalAnimating = signal(false);
  editingSection = signal<Section | null>(null);
  sectionForm: Section = { title: '', image: '' };
  sectionErrors: Record<string, string> = {};

  // Delete modals
  showDeleteModal = signal(false);
  deletingBolo = signal<Bolo | null>(null);
  showDeleteSectionModal = signal(false);
  deletingSection = signal<Section | null>(null);

  // Image upload modal
  showImageModal = signal(false);
  imageModalAnimating = signal(false);
  selectedFile = signal<File | null>(null);
  uploadingImage = signal(false);
  uploadError = signal('');

  // Computed tables
  destaques = computed(() => this.bolos().filter(b => b.destaque));

  sectionWithCount = computed(() =>
    this.sections().map(s => ({
      ...s,
      count: this.bolos().filter(b => Number(b.sectionId) === Number(s.id)).length
    }))
  );

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    if (this.isAdm()) {
      this.loadData();
    }
  }

  loadData() {
    forkJoin({
      sections: this.http.get<Section[]>(`${this.apiUrl}/sections`),
      bolos: this.http.get<Bolo[]>(`${this.apiUrl}/bolos`)
    }).subscribe(({ sections, bolos }) => {
      this.sections.set(sections);
      this.bolos.set(bolos);
    });
  }

  // ---------- Profile ----------
  startEdit() {
    this.editName = this.user()?.name || '';
    this.editPassword = this.user()?.password || '';
    this.showPassword.set(false);
    this.editing.set(true);
  }

  cancelEdit() {
    this.editing.set(false);
    this.showPassword.set(false);
  }

  saveEdit() {
    const u = this.user();
    if (!u) return;
    const data: Partial<User> = {
      name: this.editName,
      password: this.editPassword
    };
    this.saving.set(true);
    this.authService.updateUser(u.id, data).subscribe(() => {
      this.saving.set(false);
      this.editing.set(false);
      this.showPassword.set(false);
    });
  }

  toggleShowPassword() {
    this.showPassword.set(!this.showPassword());
  }

  // ---------- Bolo Modal ----------
  emptyBolo(): Bolo {
    return { sectionId: 0, title: '', description: '', price: 0, image: '', destaque: false };
  }

  openCreateBolo() {
    this.editingBolo.set(null);
    this.boloForm = this.emptyBolo();
    this.boloErrors = {};
    this.openBoloModal();
  }

  openEditBolo(bolo: Bolo) {
    this.editingBolo.set(bolo);
    this.boloForm = { ...bolo };
    this.boloErrors = {};
    this.openBoloModal();
  }

  openBoloModal() {
    this.showBoloModal.set(true);
    setTimeout(() => this.modalAnimating.set(true), 10);
  }

  closeBoloModal() {
    this.modalAnimating.set(false);
    setTimeout(() => this.showBoloModal.set(false), 300);
  }

  validateBolo(): boolean {
    const e: Record<string, string> = {};
    if (!this.boloForm.title?.trim()) e['title'] = 'Nome é obrigatório.';
    if (!this.boloForm.description?.trim()) e['description'] = 'Descrição é obrigatória.';
    if (!this.boloForm.price || this.boloForm.price <= 0) e['price'] = 'Informe um preço válido.';
    if (!this.boloForm.sectionId || Number(this.boloForm.sectionId) === 0) e['sectionId'] = 'Selecione uma sessão.';
    this.boloErrors = e;
    return Object.keys(e).length === 0;
  }

  submitBolo() {
    if (!this.validateBolo()) return;
    const b = this.boloForm;
    const existing = this.editingBolo();
    if (existing && existing.id) {
      this.http.put<Bolo>(`${this.apiUrl}/bolos/${existing.id}`, { ...b, id: existing.id }).subscribe(() => {
        this.loadData(); this.closeBoloModal();
      });
    } else {
      this.http.post<Bolo>(`${this.apiUrl}/bolos`, b).subscribe(() => {
        this.loadData(); this.closeBoloModal();
      });
    }
  }

  // ---------- Section Modal ----------
  openCreateSection() {
    this.editingSection.set(null);
    this.sectionForm = { title: '', image: '' };
    this.sectionErrors = {};
    this.openSectionModal();
  }

  openEditSection(section: Section) {
    this.editingSection.set(section);
    this.sectionForm = { ...section };
    this.sectionErrors = {};
    this.openSectionModal();
  }

  openSectionModal() {
    this.showSectionModal.set(true);
    setTimeout(() => this.sectionModalAnimating.set(true), 10);
  }

  closeSectionModal() {
    this.sectionModalAnimating.set(false);
    setTimeout(() => this.showSectionModal.set(false), 300);
  }

  validateSection(): boolean {
    const e: Record<string, string> = {};
    if (!this.sectionForm.title?.trim()) e['title'] = 'Nome é obrigatório.';
    this.sectionErrors = e;
    return Object.keys(e).length === 0;
  }

  submitSection() {
    if (!this.validateSection()) return;
    const existing = this.editingSection();
    if (existing && existing.id) {
      this.http.put<Section>(`${this.apiUrl}/sections/${existing.id}`, { ...this.sectionForm, id: existing.id }).subscribe(() => {
        this.loadData(); this.closeSectionModal();
      });
    } else {
      this.http.post<Section>(`${this.apiUrl}/sections`, this.sectionForm).subscribe(() => {
        this.loadData(); this.closeSectionModal();
      });
    }
  }

  // ---------- Delete Bolo ----------
  openDeleteModal(bolo: Bolo) {
    this.deletingBolo.set(bolo);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deletingBolo.set(null);
  }

  confirmDelete(comImagem = false) {
    const b = this.deletingBolo();
    if (!b || !b.id) return;

    this.http.delete(`${this.apiUrl}/bolos/${b.id}`).subscribe(() => {
      if (comImagem && b.image) {
        // Só tenta deletar se for imagem cadastrada (nome sem "/" = registro da tabela imagens)
        const isCadastrada = !b.image.startsWith('/');
        if (isCadastrada) {
          const imagem = this.imageService.imagensDisponiveis()
            .find(img => img.nome === b.image);
          if (imagem?.id) {
            this.http.delete(`${this.apiUrl}/imagens/${imagem.id}`).subscribe(() => {
              this.imageService.carregar().subscribe();
            });
          }
        }
      }
      this.loadData();
      this.closeDeleteModal();
    });
  }

  // ---------- Delete Section ----------
  openDeleteSectionModal(section: Section) {
    this.deletingSection.set(section);
    this.showDeleteSectionModal.set(true);
  }

  closeDeleteSectionModal() {
    this.showDeleteSectionModal.set(false);
    this.deletingSection.set(null);
  }

  confirmDeleteSection(comImagem = false) {
    const s = this.deletingSection();
    if (!s || !s.id) return;
    this.http.delete(`${this.apiUrl}/sections/${s.id}`).subscribe(() => {
      if (comImagem && s.image) {
        const isCadastrada = !s.image.startsWith('/');
        if (isCadastrada) {
          const imagem = this.imageService.imagensDisponiveis()
            .find(img => img.nome === s.image);
          if (imagem?.id) {
            this.http.delete(`${this.apiUrl}/imagens/${imagem.id}`).subscribe(() => {
              this.imageService.carregar().subscribe();
            });
          }
        }
      }
      this.loadData();
      this.closeDeleteSectionModal();
    });
  }

  // ---------- Image Upload Modal ----------
  openImageModal() {
    this.selectedFile.set(null);
    this.uploadError.set('');
    this.showImageModal.set(true);
    setTimeout(() => this.imageModalAnimating.set(true), 10);
  }

  closeImageModal() {
    this.imageModalAnimating.set(false);
    setTimeout(() => this.showImageModal.set(false), 300);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.uploadError.set('Selecione apenas arquivos de imagem.');
      this.selectedFile.set(null);
      return;
    }
    this.uploadError.set('');
    this.selectedFile.set(file);
  }

  // Lê o arquivo como base64 e salva via POST /imagens no json-server
  uploadImage() {
    const file = this.selectedFile();
    if (!file) return;

    // Verifica se já existe uma imagem com o mesmo nome
    const jaExiste = this.imageService.imagensDisponiveis()
      .some(img => img.nome === file.name);
    if (jaExiste) {
      this.uploadError.set('Já existe uma imagem com esse nome.');
      return;
    }

    this.uploadingImage.set(true);
    this.uploadError.set('');

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.imageService.salvar({ nome: file.name, base64 }).subscribe({
        next: () => {
          this.uploadingImage.set(false);
          this.closeImageModal();
        },
        error: () => {
          this.uploadError.set('Erro ao salvar a imagem. Verifique se o json-server está rodando.');
          this.uploadingImage.set(false);
        }
      });
    };
    reader.onerror = () => {
      this.uploadError.set('Erro ao ler o arquivo.');
      this.uploadingImage.set(false);
    };
    reader.readAsDataURL(file);
  }

  // ---------- Helpers ----------
  getSectionName(sectionId: number): string {
    return this.sections().find(s => Number(s.id) === Number(sectionId))?.title || '—';
  }

  getImageName(path: string): string {
    if (!path) return '—';
    return path.split('/').pop() || path;
  }

  truncate(text: string, max = 60): string {
    return text.length > max ? text.substring(0, max) + '...' : text;
  }

  logout() {
    localStorage.removeItem('doce_user');
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
