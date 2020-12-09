import { Component, OnInit } from '@angular/core';
import { GestionService } from '../Service/gestion.service';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Dialog } from '../Interface/Dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.scss']
})
export class GestionComponent implements OnInit {

  constructor(private gestionService: GestionService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {}

  // TODO BOUTON REMETTRE LES JOUEURS A ZERO

  remiseAZero(): void {
    const accountToDelete: Dialog = {
      id: 'true',
      action: 'Remettre le tournoi à zéro ?',
      option: 'Les poules, binômes de double et tableaux/consolantes seront remis à zéro. Les joueurs seront conservés.'
    };

    this.dialog.open(DialogComponent, {
      width: '45%',
      data: accountToDelete
    }).afterClosed().subscribe(id_joueur => {
      if (id_joueur){
        this.gestionService.reset()
          .subscribe(message => {
            this.notifyService.notifyUser(message.message, this.snackBar, 'success', 2500, 'OK');
          }, err => {
            this.notifyService.notifyUser(err.message, this.snackBar, 'error', 2500, 'OK');
          });
      }
    });
  }

}
