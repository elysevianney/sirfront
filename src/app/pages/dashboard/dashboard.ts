import {Component, inject} from '@angular/core'
import {AuthService} from '../../services/authservice'
import {Router} from '@angular/router'
import {Icon} from '../../shared/icon/icon'

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [Icon],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)

  readonly currentUser = this.authService.currentUser

  logout() {
    this.authService.logout()
  }
}
