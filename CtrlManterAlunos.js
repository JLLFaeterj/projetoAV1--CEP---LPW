"use strict";

import Status from "/Status.js";
import Aluno from "/Aluno.js";
import DaoAluno from "/DaoAluno.js";
import ViewerAluno from "/ViewerAluno.js";

export default class CtrlManterAlunos {
  
  //-----------------------------------------------------------------------------------------//
  
  constructor() {
    this.dao = new DaoAluno();
    this.viewer = new ViewerAluno(this);
    this.comecarApresentacao();
      
  }
  
  //-----------------------------------------------------------------------------------------//

  async comecarApresentacao() {
    this.status = Status.NAVEGANDO;
    let conjAlunos = await this.dao.obterAlunos();
    if(conjAlunos.length > 0) {
      this.viewer.setQtde(conjAlunos.length);
      this.viewer.apresentar(conjAlunos[0]);
    }
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.viewer.editando();
    this.status = Status.INCLUINDO;
  }

  //-----------------------------------------------------------------------------------------//
 
  incluir(matr, cpf, nome, email, telefone) {
    try {
      let aluno = new Aluno(matr, cpf, nome, email, telefone);
      this.dao.incluir(aluno); 
      this.status = Status.NAVEGANDO;
      this.viewer.apresentando();
    }
    catch(e) {
      alert(e);
    }
    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.status = Status.NAVEGANDO;
    this.viewer.apresentando();
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//

//var aluno1 = new Aluno('1234', '123.456.789-09', 'José da Silva Xavier','jose@eu.com.br','(21)98765-4321');
//aluno1.mostrar();

//var aluno2 = new Aluno('67890', '555.555.555-55', 'Maria de Souza','maria@eu.com.br','(21)99999-8888')//aluno2.mostrar();

//ctrl.dao.incluir(aluno1);
//ctrl.dao.incluir(aluno2);


//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;

//aluno2.setNome('Maria de Souza RAMOS');
//ctrl.dao.alterar(aluno2);

//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;

//ctrl.dao.excluir(aluno1);
//ctrl.dao.excluir(aluno2);

//alert("Atenção 3");
//ctrl.dao.obterAlunos().then( async (value) => await alert(JSON.stringify(value)) ) ;


