"use strict";

import Status from "/Status.js";
import Hotel from "/Hotel.js";   
import DaoHotel from "/DaoHotel.js";  
import ViewerHotel from "/ViewerHotel.js";  

export default class CtrlManterHoteis { 
  
  //-----------------------------------------------------------------------------------------//

  //
  // Atributos do Controlador
  //
  #dao;      
  #viewer;   
  #posAtual; 
  #status;   
  
  //-----------------------------------------------------------------------------------------//

  constructor() {
    this.#dao = new DaoHotel();  
    this.#viewer = new ViewerHotel(this); 
    this.#posAtual = 1;
    this.#atualizarContextoNavegacao();    
  }
  
  //-----------------------------------------------------------------------------------------//

  async #atualizarContextoNavegacao() {
    
    this.#status = Status.NAVEGANDO;

    this.#viewer.statusApresentacao();
    
    let conjHoteis = await this.#dao.obterHoteis();  
    
    if(conjHoteis.length == 0) {  
     
      this.#posAtual = 0;
      
      this.#viewer.apresentar(0, 0, null);
    }
    else {
     
      if(this.#posAtual == 0 || this.#posAtual > conjHoteis.length)  
        this.#posAtual = 1;
      
      this.#viewer.apresentar(this.#posAtual, conjHoteis.length, conjHoteis[this.#posAtual - 1]);  
    }
  }
  
  //-----------------------------------------------------------------------------------------//

  async apresentarPrimeiro() {
    let conjHoteis = await this.#dao.obterHoteis();  
    if(conjHoteis.length > 0)  
      this.#posAtual = 1;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarProximo() {
    let conjHoteis = await this.#dao.obterHoteis();  
    if(this.#posAtual < conjHoteis.length)  
      this.#posAtual++;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarAnterior() {
    let conjHoteis = await this.#dao.obterHoteis(); 
    if(this.#posAtual > 1)
      this.#posAtual--;
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//

  async apresentarUltimo() {
    let conjHoteis = await this.#dao.obterHoteis();  
    this.#posAtual = conjHoteis.length;  
    this.#atualizarContextoNavegacao();
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarIncluir() {
    this.#status = Status.INCLUINDO;
    this.#viewer.statusEdicao(Status.INCLUINDO);

    this.efetivar = this.incluir;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarAlterar() {
    this.#status = Status.ALTERANDO;
    this.#viewer.statusEdicao(Status.ALTERANDO);

    this.efetivar = this.alterar;
  }

  //-----------------------------------------------------------------------------------------//
  
  iniciarExcluir() {
    this.#status = Status.EXCLUINDO;
    this.#viewer.statusEdicao(Status.EXCLUINDO);

    this.efetivar = this.excluir;
  }

  //-----------------------------------------------------------------------------------------//
 
  async incluir(matr, cnpj, nome, email, telefone, cep) { 
    if(this.#status == Status.INCLUINDO) {
      try {
        let hotel = new Hotel(matr, cnpj, nome, email, telefone, cep);  
        await this.#dao.incluir(hotel);  
        this.#status = Status.NAVEGANDO;
        this.#atualizarContextoNavegacao();
      }
      catch(e) {
        alert(e);
      }
    }    
  }

  //-----------------------------------------------------------------------------------------//
 
  async alterar(matr, cnpj, nome, email, telefone, cep) { 
    if(this.#status == Status.ALTERANDO) {
      try {
        let hotel = await this.#dao.obterHotelPelaMatricula(matr);   
        if(hotel == null) {  
          alert("Hotel com a matrícula " + matr + " não encontrado.");  
        } else {
          hotel.setCnpj(cnpj);  
          hotel.setNome(nome);  
          hotel.setEmail(email);  
          hotel.setTelefone(telefone);  
          hotel.setCep(cep);  
          await this.#dao.alterar(hotel);   
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
        let hotel = await this.#dao.obterHotelPelaMatricula(matr);   
        if(hotel == null) {  
          alert("Hotel com a matrícula " + matr + " não encontrado.");
        } else {
          await this.#dao.excluir(hotel); 
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

