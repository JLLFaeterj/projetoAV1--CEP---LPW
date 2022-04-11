import Status from "/Status.js";
import Aluno from "/Aluno.js";
import ViewerError from "/ViewerError.js";

//------------------------------------------------------------------------//

export default class ViewerAluno {

  #qtde;
  #ctrl;
  
  constructor(ctrl) {
    this.#ctrl = ctrl;
    this.#qtde = 0;
    this.divNavegar  = this.obterElemento('divNavegar'); 
    this.divComandos = this.obterElemento('divComandos'); 
    this.divPosicao  = this.obterElemento('divPosicao'); 
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
    this.tfCpf       = this.obterElemento('tfCpf');
    this.tfNome      = this.obterElemento('tfNome');
    this.tfEmail     = this.obterElemento('tfEmail');
    this.tfTelefone  = this.obterElemento('tfTelefone');
      
    this.btIncluir.onclick = fnBtIncluir; 
    this.btAlterar.onclick = fnBtIncluir; 

    this.btOk.onclick = fnBtOk; 
    this.btCancelar.onclick = fnBtCancelar; 
  }

//------------------------------------------------------------------------//

  obterElemento(idElemento) {
    let elemento = document.getElementById(idElemento);
    if(elemento == null) 
      throw new ViewerError("Não encontrei um elemento com id '" + idElemento + "'");
    // Adicionando o atributo 'viewer' no elemento do Viewer. Isso permitirá
    // que o elemento guarde a referência para o objeto Viewer que o contém.
    elemento.viewer = this;
    return elemento;
  }

//------------------------------------------------------------------------//
  
  getCtrl() { 
    return this.#ctrl;
  }

//------------------------------------------------------------------------//
  
  setQtde(qtde) { 
    this.#qtde = qtde;
  }

//------------------------------------------------------------------------//
  
  apresentar(aluno) { 
    this.tfMatricula.value = aluno.getMatricula();
    this.tfCpf.value       = aluno.getCpf();
    this.tfNome.value      = aluno.getNome();
    this.tfEmail.value     = aluno.getEmail();
    this.tfTelefone.value  = aluno.getTelefone();
  }

//------------------------------------------------------------------------//
  
  editando(operacao) { 
    this.divNavegar.hidden = true;
    this.divComandos.hidden = true;
    this.divDialogo.hidden = false; 
    this.tfMatricula.disabled = false;
    this.tfCpf.disabled = false;
    this.tfNome.disabled = false;
    this.tfEmail.disabled = false;
    this.tfTelefone.disabled = false;    
  }

//------------------------------------------------------------------------//
  
  apresentando() { 
    this.tfCpf.disabled = true;
    this.divNavegar.hidden = false;
    this.divComandos.hidden = false;
    this.divDialogo.hidden = true; 
    this.tfMatricula.disabled = true;
    this.tfCpf.disabled = true;
    this.tfNome.disabled = true;
    this.tfEmail.disabled = true;
    this.tfTelefone.disabled = true;
  }

}

//------------------------------------------------------------------------//
// CALLBACKs para os Botões
//------------------------------------------------------------------------//

function fnBtIncluir() {
  // Aqui, o 'this' é o objeto Button. Eu adicionei o atributo 'viewer'
  // no botão para poder executar a instrução abaixo.
  this.viewer.getCtrl().iniciarIncluir();
  
}

//------------------------------------------------------------------------//

function fnBtOk() {
  if(this.viewer.getCtrl().status == Status.INCLUINDO) {
    const matricula = this.viewer.tfMatricula.value;
    const cpf = this.viewer.tfCpf.value;
    const nome = this.viewer.tfNome.value;
    const email = this.viewer.tfEmail.value;
    const telefone = this.viewer.tfTelefone.value;
    this.viewer.getCtrl().incluir(matricula, cpf, nome, email, telefone); 
  }
  
}

//------------------------------------------------------------------------//

function fnBtCancelar() {
  this.viewer.getCtrl().cancelar(); 
}

//------------------------------------------------------------------------//

