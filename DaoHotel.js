"use strict";

import ModelError from "/ModelError.js";
import Hotel from "/Hotel.js";

export default class DaoHotel {
  
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.arrayHoteis = [];  //Alterado nome do array de 'arrayAlunos' para 'arrayHoteis'
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD
   */ 
  async obterConexao() {
    if(DaoHotel.conexao == null) {  //Alterado 'DaoAluno' para 'DaoHotel'.
      DaoHotel.conexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("HotelDB", 1);   //Alterado 'AlunoDB' para 'HotelDB'.

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("HotelST", {  //Alterado 'AlunoST' para 'HotelST'.
            autoIncrement: true
          });
          store.createIndex("idxMatricula", "matricula", { unique: true });
        };

        requestDB.onerror = event => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = event => {
          if (event.target.result) {
            // event.target.result apontará para IDBDatabase aberto
            resolve(event.target.result);
          }
          else 
            reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoHotel.conexao;  //Alterado 'DaoAluno' para 'DaoHotel'.
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterHoteis() {  //Alterado 'obterAlunos()' para 'obterHoteis()'.
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["HotelST"], "readonly"); //Alterado 'AlunoST' para 'HotelST'.
        store = transacao.objectStore("HotelST");  //Alterado 'AlunoST' para 'HotelST'.
        indice = store.index('idxMatricula');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Hotel.assign(cursor.value);  //Alterado 'Aluno' para 'Hotel'.
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayHoteis = await promessa;  //Alterado nome do array de 'arrayAlunos' para 'arrayHoteis'.
    return this.arrayHoteis;  //Alterado nome do array de 'arrayAlunos' para 'arrayHoteis'.
  }

  //-----------------------------------------------------------------------------------------//

  async obterHotelPelaMatricula(matr) {  //Alterado 'obterAlunoPelaMatricula' para 'obterHotelPelaMatricula'
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["HotelST"], "readonly");  //Alterado 'AlunoST' para 'HotelT'.
        store = transacao.objectStore("HotelST");  //Alterado 'AlunoST' para 'HotelST'.
        indice = store.index('idxMatricula');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(matr);
      consulta.onsuccess = function(event) { 
        if(consulta.result != null)
          resolve(Hotel.assign(consulta.result));   //Alterado 'Aluno' para 'Hotel'.
        else
          resolve(null);
      };
      consulta.onerror = function(event) { reject(null); };
    });
    let hotel = await promessa;  //Alterado 'aluno' para 'hotel'
    return hotel;    //Alterado 'aluno' para 'hotel'
  }

  //-----------------------------------------------------------------------------------------//

  async obterHoteisPeloAutoIncrement() {  //Alterado 'obterAlunoPeloAutoIncrement' para 'obterHoteisPeloAutoIncrement'
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["HotelST"], "readonly"); //Alterado 'AlunoST' para 'HotelST'.
        store = transacao.objectStore("HotelST");  //Alterado 'AlunoST' para 'HotelST'.
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Hotel.assign(cursor.value);  //Alterado 'Aluno' para 'Hotel'.
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayHoteis = await promessa;  //Alterado nome do array de 'arrayAlunos' para 'arrayHoteis'
    return this.arrayHoteis;  //Alterado nome do array de 'arrayAlunos' para 'arrayHoteis'
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(hotel) {  //Alterado 'aluno' para 'hotel'
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["HotelST"], "readwrite");  //Alterado 'AlunoST' para 'HotelST'.
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o hotel", event.target.error));
      };
      let store = transacao.objectStore("HotelST");  //Alterado 'AlunoST' para 'HotelST'.
      let requisicao = store.add(Hotel.deassign(hotel));  //Alterado 'aluno' para 'hotel'. Minúsculo e maiúsculo.
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(hotel) { //Alterado 'aluno' para 'hotel'
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["HotelST"], "readwrite");  //Alterado 'AlunoST' para 'HotelST'
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o hotel", event.target.error)); //Alterado 'aluno' para 'hotel'
      };
      let store = transacao.objectStore("HotelST");  //Alterado 'AlunoST' para 'HotelST'   
      let indice = store.index('idxMatricula');
      var keyValue = IDBKeyRange.only(hotel.getMatricula());  //Alterado 'aluno' para 'hotel'
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.matricula == hotel.getMatricula()) {  //Alterado 'aluno' para 'hotel'
            const request = cursor.update(Hotel.deassign(hotel));  //Alterado 'aluno' para 'hotel'. Minúsculo e maiúsculo.
            request.onsuccess = () => {
              console.log("[DaoHotel.alterar] Cursor update - Sucesso ");  //Alterado 'DaoAluno' para 'DaoHotel'
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Hotel com a matrícula " + hotel.getMatricula() + " não encontrado!",""));  //Alterado 'Aluno' para 'Hotel'. Minúsculo e maiúsculo.
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(hotel) {  //Alterado 'aluno' para 'hotel'
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["HotelST"], "readwrite");  //Alterado 'AlunoST' para 'HotelST'
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o hotel", event.target.error));  //Alterado 'aluno' para 'hotel'
      };
      let store = transacao.objectStore("HotelST");   //Alterado 'AlunoST' para 'HotelST'
      let indice = store.index('idxMatricula');
      var keyValue = IDBKeyRange.only(hotel.getMatricula());  //Alterado 'aluno' para 'hotel'
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.matricula == hotel.getMatricula()) {  //Alterado 'aluno' para 'hotel'
            const request = cursor.delete();
            request.onsuccess = () => { 
              resolve("Ok"); 
            };
            return;
          }
        } else {
          reject(new ModelError("Hotel com a matrícula " + hotel.getMatricula() + " não encontrado!",""));  //Alterado 'Aluno' para 'Hotel'. Minúsculo e maiúsculo.
        }
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}