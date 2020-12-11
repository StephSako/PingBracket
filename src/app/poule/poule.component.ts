import { Component, OnInit } from '@angular/core';
import { PoulesService } from '../Service/poules.service';
import { JoueurInterface } from '../Interface/Joueur';
import { PouleInterface } from '../Interface/Poule';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '../Service/notify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableauInterface } from '../Interface/Tableau';
import { JoueurService } from '../Service/joueur.service';
import { GestionService } from '../Service/gestion.service';

@Component({
  selector: 'app-poule',
  templateUrl: './poule.component.html',
  styleUrls: ['./poule.component.scss']
})
export class PouleComponent implements OnInit {

  public poules: PouleInterface[];
  public subscribedUnassignedPlayers: JoueurInterface[];
  tableau: TableauInterface = {
    format: null,
    _id: null,
    nom: null,
    consolante: null
  };

  constructor(private pouleService: PoulesService, private router: Router, private route: ActivatedRoute,
              private joueurService: JoueurService, private notifyService: NotifyService, private snackBar: MatSnackBar,
              private gestionService: GestionService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getTableau();
    });
  }

  getTableau(): void {
    this.gestionService.getTableau(this.router.url.split('/').pop()).subscribe(tableau => {
      this.tableau = tableau;
      this.getAllPoulesBinomes();
      if (this.tableau.format === 'double') { this.getSubscribedUnassignedPlayers(); }
    });
  }

  getAllPoulesBinomes(): void {
    this.pouleService.getAll(this.tableau._id).subscribe(poules => this.poules = poules);
  }

  getSubscribedUnassignedPlayers(): void {
    this.joueurService.getSubscribedUnassignedDouble(this.tableau._id).subscribe(joueurs => this.subscribedUnassignedPlayers = joueurs);
  }

  generatePoulesBinomes(): void {
    if (this.tableau.format === 'simple') {
      this.pouleService.generatePoules(this.tableau._id).subscribe(poules => {
        this.poules = poules;
        this.notifyService.notifyUser('Poules générées', this.snackBar, 'success', 1500, 'OK');
      });
    } else {
      this.pouleService.generateBinomes(this.tableau._id).subscribe(poules => {
        this.poules = poules;
        this.notifyService.notifyUser('Poules générées', this.snackBar, 'success', 1500, 'OK');
      });
    }
  }

  editPoule(event: CdkDragDrop<[id: JoueurInterface], any>, id_poule: string): void {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    this.pouleService.editPoule(id_poule, event.container.data).subscribe(() => {}, err => console.log(err));
  }

  editBinome(event: CdkDragDrop<[id: JoueurInterface], any>, id_poule: string): void {
  if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      this.pouleService.editDouble(event.item.data[0], id_poule, event.container.data, event.item.data[1])
        .subscribe(() => {}, err => console.log(err));
    }
  }

  setStatus(poule: PouleInterface): void {
    this.pouleService.setStatus(poule).subscribe(() => this.getAllPoulesBinomes(), err => console.error(err));
  }
}
