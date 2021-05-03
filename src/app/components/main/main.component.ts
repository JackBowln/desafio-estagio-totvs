import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ContactsService } from 'src/app/Services/contacts.service';

export interface DialogData {
  dialogMessage: string;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  contacts: any = [];
  currentContact:any = [];
  contact = {
    _id: '',
    name: '',
    email: '',
    phone: ''
  }

  constructor(private contactService: ContactsService, private _snackBar: MatSnackBar, public dialog: MatDialog) {

  }

  openDialog(message: string) {
    this.dialog.open(DialogComponent, {
      data: { dialogMessage: message }
    });
  }
  ngOnInit(): void {
    this.contactService.getAll().subscribe((data: []) => {
      this.contacts = data;
    })
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  phone = new FormControl('', [Validators.required]);
  name = new FormControl('', [Validators.required, Validators.pattern(/[a-z]* [a-z]*/)]);


  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'Email é obrigatório';
    }
    return this.email.hasError('email') ? 'Email inválido' : '';
  }
  getPhoneErrorMessage() {
    if (this.phone.hasError('required')) {
      return 'Telefone é obrigatório';
    }
    return;
  }
  getNameErrorMessage() {
    if (this.name.hasError('required')) {
      return 'Nome é obrigatório';
    }
    return this.name.hasError('pattern') ? 'Insira o nome completo' : '';
  }

  getContacts(): any {
    return this.contactService.getAll().subscribe(
      (data: any) => {
        this.contacts = data;
      },
      (error: any) => {
        console.log(error);
      });;
  }


  updateContact(id: any) {
    this.getContacts()
    const data = {
      name: this.contact.name,
      email: this.contact.email,
      phone: this.contact.phone
    };
    if(data.name == '' && data.email == '' && data.phone == '' ){
      this.openDialog("Após preencher algum campo, clique em editar no contato que deseja modificar")
    } else {

      this.contactService.update(id, data)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.getContacts()

          if(response.codeName == "DuplicateKey") {
            this.openDialog(`O campo ${Object.keys(response.keyPattern)} já está em uso`)
          }
          this.openSnackBar('Contato editado com sucesso', 'Ok!')
        },
        (error: any) => {
          console.log(error);
        });
      }
  }

  saveContact(): void {
    const data = {
      name: this.contact.name,
      email: this.contact.email,
      phone: this.contact.phone
    };
    this.getContacts()
    this.contactService.create(data)
      .subscribe(
        (response: any) => {
          this.getContacts()
          console.log(response);
          if (response.name == "ValidationError") {
            this.openDialog("Todos os campos são obrigatórios");
          }
          if (response.code = 11000) {
            this.openDialog(`O campo ${Object.keys(response.keyPattern)} já está cadastrado`);
          }

          if (response.code != 11000 && response.name != "ValidationError") {
            this.openSnackBar('Contato criado com sucesso', 'Ok!')
          }

        },
        (error: any) => {
          console.log(error);
        });

  }
  delete(id: any): void {
    this.getContacts()
    this.contactService.delete(id)
      .subscribe(
        (response: any) => {
          this.openSnackBar('Contato deletado com sucesso', 'Ok!')
          console.log(response);
        },
        (error: any) => {
          console.log(error);
        });
    this.getContacts()
  }

  displayedColumns: string[] = ['name', 'email', 'phone', '_id'];

}

@Component({
  templateUrl: 'dialog.component.html',
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}
