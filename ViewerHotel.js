import Status from "/Status.js";
import Hotel from "/Hotel.js";  
import ViewerError from "/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerHotel {  

  #ctrl;
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.divNavegar  = this.obterElemento('divNavegar'); 
    this.divComandos = this.obterElemento('divComandos'); 
    this.divAviso    = this.obterElemento('divAviso'); 
    this.divDialogo  = this.obterElemento('divDialogo');

    this.btPrimeiro  = this.obterElemento('btPrimeiro');
    this.btAnterior  = this.obterElemento('btAnterior');
    this.btProximo   = this.obterElemento('btProximo');
    this.btUltimo    = this.obterElemento('btUltimo');

    this.btIncluir   = this.obterElemento('btIncluir');
    this.btExcluir   = this.obterElemento('btExcluir');
    this.btAlterar   = this.obterElemento('btAlterar');
    this.btSair      = this.obterElemento('btSair');

    this.btOk        = this.obterElemento('btOk');
    this.btCancelar  = this.obterElemento('btCancelar');

    this.tfMatricula = this.obterElemento('tfMatricula');
    this.tfCnpj      = this.obterElemento('tfCnpj');
    this.tfNome      = this.obterElemento('tfNome');
    this.tfEmail     = this.obterElemento('tfEmail');
    this.tfTelefone  = this.obterElemento('tfTelefone');
    this.tfCep       = this.obterElemento('tfCep');   
      
    this.btPrimeiro.onclick = fnBtPrimeiro; 
    this.btProximo.onclick = fnBtProximo; 
    this.btAnterior.onclick = fnBtAnterior; 
    this.btUltimo.onclick = fnBtUltimo; 

    this.btIncluir.onclick = fnBtIncluir; 
    this.btAlterar.onclick = fnBtAlterar; 
    this.btExcluir.onclick = fnBtExcluir; 

    this.btOk.onclick = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

//------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    
    elemento.viewer = this;
    return elemento;
  }

//------------------------------------------------------------------------//
  
  getCtrl() { 
    return this.#ctrl;
  }

//------------------------------------------------------------------------//
  
  apresentar(pos, qtde, hotel) {     
    
    this.configurarNavegacao( pos <= 1 , pos == qtde );   

    if(hotel == null) {  
      this.tfMatricula.value = "";
      this.tfCnpj.value      = "";
      this.tfNome.value      = "";
      this.tfEmail.value     = "";
      this.tfTelefone.value  = "";
      this.tfCep.value       = "";  
      this.divAviso.innerHTML = " Número de Hotéis: 0";  
    } else {
      this.tfMatricula.value = hotel.getMatricula();  
      this.tfCnpj.value      = hotel.getCnpj();  
      this.tfNome.value      = hotel.getNome();  
      this.tfEmail.value     = hotel.getEmail();  
      this.tfTelefone.value  = hotel.getTelefone();  
      this.tfCep.value       = hotel.getCep();  
      this.divAviso.innerHTML = "Posição: " + pos + " | Número de Hotéis: " + qtde;  
    }
  }

//------------------------------------------------------------------------//

  configurarNavegacao(flagInicio, flagFim) {
    this.btPrimeiro.disabled = flagInicio;
    this.btUltimo.disabled   = flagFim;
    this.btProximo.disabled  = flagFim;
    this.btAnterior.disabled = flagInicio;
  }
  
//------------------------------------------------------------------------//
  
  statusEdicao(operacao) { 
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false; 
    
    if(operacao != Status.EXCLUINDO) {
      this.tfCnpj.disabled = false;
      this.tfNome.disabled = false;
      this.tfEmail.disabled = false;
      this.tfTelefone.disabled = false;
      this.tfCep.disabled = false;  
      this.divAviso.innerHTML = "";      
    } else {
      this.divAviso.innerHTML = "Deseja excluir este registro?";      
    }
    if(operacao == Status.INCLUINDO) {
      this.tfMatricula.disabled = false;
      this.tfMatricula.value = "";
      this.tfCnpj.value = "";
      this.tfNome.value = "";
      this.tfEmail.value = "";
      this.tfTelefone.value = "";
      this.tfCep.disabled = "";  
    }
  }

//------------------------------------------------------------------------//
  
  statusApresentacao() { 
    this.tfCnpj.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true; 
    this.tfMatricula.disabled = true;
    this.tfCnpj.disabled = true;
    this.tfNome.disabled = true;
    this.tfEmail.disabled = true;
    this.tfTelefone.disabled = true;
    this.tfCep.disabled = true;   
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtPrimeiro() {
  
  this.viewer.getCtrl().apresentarPrimeiro();
  
}

//------------------------------------------------------------------------//

function fnBtProximo() {

  this.viewer.getCtrl().apresentarProximo();
  
}

//------------------------------------------------------------------------//

function fnBtAnterior() {
 
  this.viewer.getCtrl().apresentarAnterior();
  
}

//------------------------------------------------------------------------//

function fnBtUltimo() {
  
  this.viewer.getCtrl().apresentarUltimo();
  
}
//------------------------------------------------------------------------//

function fnBtIncluir() {
 
  this.viewer.getCtrl().iniciarIncluir();
}

//------------------------------------------------------------------------//

function fnBtAlterar() {

  this.viewer.getCtrl().iniciarAlterar();
  
}

//------------------------------------------------------------------------//

function fnBtExcluir() {

  this.viewer.getCtrl().iniciarExcluir();
}

//------------------------------------------------------------------------//

function fnBtOk() {
  const matricula = this.viewer.tfMatricula.value;
  const cnpj = this.viewer.tfCnpj.value;
  const nome = this.viewer.tfNome.value;
  const email = this.viewer.tfEmail.value;
  const telefone = this.viewer.tfTelefone.value;
  const cep = this.viewer.tfCep.value;  ///ALTERADO CEP

  this.viewer.getCtrl().efetivar(matricula, cnpj, nome, email, telefone, cep);   

}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}

//------------------------------------------------------------------------//



