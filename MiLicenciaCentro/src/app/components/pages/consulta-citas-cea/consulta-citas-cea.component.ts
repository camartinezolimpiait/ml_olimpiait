import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Icons } from 'src/app/enums/Utils/Icons';
import { InformacionAgenda } from 'src/app/interfaces/agendamiento/CEA/InformacionAgenda';
import { ConsultaCitas } from 'src/app/interfaces/aspirante/ConsultaCitas';
import { DataService } from 'src/app/services/data/cotizador/data.service';
import { MlapiService } from 'src/app/services/data/mlapi/mlapi.service';
import { UtilService } from 'src/app/services/util/util.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { TipoDocumentoPtesaDTO } from 'src/app/interfaces/cotizacion/TipoDocumentoPtesaDTO';
import { TipoDocumentoPtesaClass } from 'src/app/class/cotizador/tipoDocumentoPtesaClass';
import { TipoCliente } from 'src/app/enums/PinesOlimpia/TipoCliente';

@Component({
  selector: 'app-consulta-citas-cea',
  templateUrl: './consulta-citas-cea.component.html',
  styleUrls: ['./consulta-citas-cea.component.scss']
})
export class ConsultaCitasCeaComponent implements OnInit {
  consultaCeaForm!: FormGroup
  tiposDeDocumento: TipoDocumentoPtesaDTO[] = [];
  agendasEstudianteCea: InformacionAgenda[] = [];
  primeraAgenda!: InformacionAgenda
  mostrarConsulta: boolean = true;
  captcha: boolean = false;
  _tipoDocumentoPtesaClass!: TipoDocumentoPtesaClass;

  constructor(
    private readonly _mlApiService: MlapiService,
    private readonly _formBuilder: FormBuilder,
    private readonly _data: DataService,
    private readonly _utils: UtilService,
    private readonly _recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    this._tipoDocumentoPtesaClass = new TipoDocumentoPtesaClass(this._data);
    this.consultaCeaForm = this._formBuilder.group({
      idTipoDocumento: ["", [Validators.required]],
      numeroDocumento: ["", [Validators.required]]
    })
    this.obtenerTiposIdentificacion();
  }

  obtenerCodigoIdentificacion(id: string): string {
    return this.tiposDeDocumento.find(x => x.idTipoSisec == id)!.codigoACH;
  }

  private obtenerTiposIdentificacion(): void {
    this._tipoDocumentoPtesaClass.get().subscribe((s: TipoDocumentoPtesaDTO[]) => {
      this._tipoDocumentoPtesaClass.set(s);
      this.tiposDeDocumento = this._tipoDocumentoPtesaClass.getDocumentosByClienteCompra(TipoCliente.CEA);
    });
  }

  cambiarInterfaz() {
    this.mostrarConsulta = !this.mostrarConsulta
  }

  public validarCaptcha(){
    this._recaptchaV3Service.execute("consultarCitas")
    .subscribe((token) => {
      this.captcha = true;
      this.consultar(token);
    },
    (error) => {
      this.captcha = false;
      this.consultar();
    });
  }

  private consultar(token: string = "") {
    if (this.captcha) {
      let consulta: ConsultaCitas = {
        idTipoDocumento: +(this.consultaCeaForm.value.idTipoDocumento),
        numeroDocumento: this.consultaCeaForm.value.numeroDocumento,
        captchaToken: token
      }
      this._mlApiService.consultarAgendaPorEstudiante(consulta).subscribe(
        (x: InformacionAgenda[]) => {
          if (x?.length > 0) {
            this.agendasEstudianteCea = x;
            this.primeraAgenda = this.agendasEstudianteCea[0];
            this.cambiarInterfaz()
            this.consultaCeaForm.get("captchaResolve")!.setValue(false);
          } else {
            this._utils.abrirDialogo(
              "No se han recuperado resultados. Por favor, verifica",
              Icons.info)
          }
        })
    }
    else {
      this._utils.abrirDialogo("No se pudo completar la verificación captcha, intente más tarde.", Icons.info)
    }
  }
}
