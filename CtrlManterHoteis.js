"use strict";

import Status from "/Status.js";
import Hotel from "/Hotel.js";   //Alterado 'Aluno' para 'Hotel'
import DaoHotel from "/DaoHotel.js";  //Alterado 'DaoAluno' para 'DaoHotel'
import ViewerHotel from "/ViewerHotel.js";  //Alterado 'ViewerAluno' para 'ViewerHotel'

export default class CtrlManterHoteis {  //Alterando o nome da classe para 'CtrlManterHoteis'
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      // Referência para o Data Access Object para o Store de Hoteis
  #viewer;   // Referência para o gerenciador do viewer 
  #posAtual; // Indica a posição do objeto Hotel que estiver sendo apresentado
  #status;   // Indica o que o controlador está fazendo 
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoHotel();  //Alterado 'DaoAluno()' para 'DaoHotel()'
    this.#viewer = new ViewerHotel(this);  //Alterado 'ViewerAluno(this)' para 'ViewerHotel(this)'
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    // Guardo a informação que o controlador está navegando pelos dados
    this.#status = Status.NAVEGANDO;

    // Determina ao viewer que ele está apresentando dos dados 
    this.#viewer.statusApresentacao();
    
    // Solicita ao DAO que dê a lista de todos os alunos presentes na base
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()'
    
    // Se a lista de alunos estiver vazia
    if(conjClientes.length == 0) {  //Alterado 'conjAlunos' para 'conjClientes'
      // Posição Atual igual a zero indica que não há objetos na base
      this.#posAtual = 0;
      
      // Informo ao viewer que não deve apresentar nada
      this.#viewer.apresentar(0, 0, null);
    }
    else {
      // Se é necessário ajustar a posição atual, determino que ela passa a ser 1
      if(this.#posAtual == 0 || this.#posAtual > conjClientes.length)  //Alterado 'conjAlunos' para 'conjClientes'
        this.#posAtual = 1;
      // Peço ao viewer que apresente o objeto da posição atual
      this.#viewer.apresentar(this.#posAtual, conjClientes.length, conjClientes[this.#posAtual - 1]);  //Alterado 'conjAlunos' para 'conjClientes'
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
    if(conjClientes.length > 0)  //Alterado 'conjAlunos' para 'conjClientes'
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
    if(this.#posAtual < conjClientes.length)  //Alterado 'conjAlunos' para 'conjClientes'
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjClientes = await this.#dao.obterClientes();  //Alterado 'conjAlunos' para 'conjClientes' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
    this.#posAtual = conjClientes.length;  //Alterado 'conjAlunos' para 'conjClientes'
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "incluir"
    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "alterar"
    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);
    // Guardo a informação que o método de efetivação da operação é o método incluir. 
    // Preciso disto, pois o viewer mandará a mensagem "efetivar" (polimórfica) ao invés de 
    // "excluir"
    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(matr, cnpj, nome, email, telefone) {
    if(this.#status == Status.INCLUINDO) {
      try {
        let cliente = new Cliente(matr, cnpj, nome, email, telefone);  //Alterado 'aluno' para 'cliente'. Maiúsculas e minúsculas (classe e variável)
        await this.#dao.incluir(cliente);  //Alterado 'aluno' para 'cliente'
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(matr, cnpj, nome, email, telefone) {
    if(this.#status == Status.ALTERANDO) {
      try {
        let cliente = await this.#dao.obterClientePelaMatricula(matr);   //Alterado 'aluno' para 'cliente' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
        if(cliente == null) {  //Alterado 'aluno' para 'cliente'
          alert("Cliente com a matrícula " + matr + " não encontrado.");  //Alterado 'Aluno' para 'Cliente'
        } else {
          cliente.setCnpj(cnpj);  //Alterado 'aluno' para 'cliente'
          cliente.setNome(nome);  //Alterado 'aluno' para 'cliente'
          cliente.setEmail(email);  //Alterado 'aluno' para 'cliente'
          cliente.setTelefone(telefone);  //Alterado 'aluno' para 'cliente'
          await this.#dao.alterar(cliente);   //Alterado 'aluno' para 'cliente'
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async excluir(matr) {
    if(this.#status == Status.EXCLUINDO) {
      try {
        let cliente = await this.#dao.obterClientePelaMatricula(matr);   //Alterado 'aluno' para 'cliente' e Alterado '#dao.obterAlunos()' para '#dao.obterClientes()''
        if(cliente == null) {  //Alterado 'Aluno' para 'Cliente'
          alert("Cliente com a matrícula " + matr + " não encontrado.");
        } else {
          await this.#dao.excluir(cliente);  //Alterado 'Aluno' para 'Cliente'
        }
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//

  cancelar() {
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  getStatus() {
    return this.#status;
  }

  //-----------------------------------------------------------------------------------------//
}

//------------------------------------------------------------------------//

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


