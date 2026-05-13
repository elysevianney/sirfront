import {Component, computed, inject, signal} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {Router, RouterLink} from '@angular/router'
import {AuthService} from '../../../services/authservice'
import {email, form, FormField, minLength, required} from '@angular/forms/signals';
import {finalize} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule, FormField, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  readonly formModel = signal({
    email: '',
    password: '',
  })

  readonly form = form(this.formModel, (path) => {
    required(path.email)
    email(path.email)
    required(path.password)
    minLength(path.password, 6)
  })

  readonly loading = signal(false)
  readonly errorMessage = signal<string | null>(null)

  readonly canSubmit = computed(() => this.form().valid() && this.form().touched() && !this.loading())

  onSubmit(event: Event) {
    event.preventDefault()
    if (!this.canSubmit()) {
      return
    }

    const { email, password } = this.form().value()
    this.loading.set(true)
    this.errorMessage.set(null)
    this.authService.login(email, password)
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']).then()
        },
        error: (err) => {
          this.errorMessage.set(`La connexion a échouée`)
          console.error('Erreur lors de la connexion', err)
        }
      })
  }
}
