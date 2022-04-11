"use strict";

import ModelError from "/ModelError.js";
import Aluno from "/Aluno.js";

var cont = 1;

export default class DaoAluno {
  
  //-----------------------------------------------------------------------------------------//
  
  constructor() {
    this.arrayAlunos = [];
    
    // Como desejamos que a instrução abaixo só finalize quando uma Promise 
    // for resolvida, criamos a função async obterDB para receber a referência para o IndexedDB
    this.db = this.abrirDB(); 
  }

  //-----------------------------------------------------------------------------------------//
  
  /*
   *  Devolve uma Promise com a referência para o BD
   */ 
  abrirDB() {
    return new Promise(function(resolve, reject) {

      let requestDB = window.indexedDB.open("AlunoDB", 1); 

      requestDB.onupgradeneeded = (event) => {
        let db = event.target.result;
        let store = db.createObjectStore("AlunoST", {
          autoIncrement: true
        });
        store.createIndex("matricula", "matricula", { unique: true });
      };

      requestDB.onerror = event => {
        reject(new ModelError("Erro: " + event.target.errorCode));
      };

      requestDB.onsuccess = event => {
        if (event.target.result) 
          // event.target.result apontará para IDBDatabase aberto
          resolve(event.target.result);
        else 
          reject(new ModelError("Erro: " + event.target.errorCode));
      };
    });
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterAlunos() {
    let db = await this.db;
    this.arrayAlunos = new Promise(
      function(resolve, reject) {
        let transacao;
        let store;
        try {
          transacao = db.transaction(["AlunoST"], "readonly");
          store = transacao.objectStore("AlunoST");
        } 
        catch (e) {
          reject(new ModelError("Erro: " + e));
        }
        let array = [];
        store.openCursor().onsuccess = (event) => {
          var cursor = event.target.result;
          if (cursor) {        
            const novo = Aluno.assign(cursor.value);
            array.push(novo);
            cursor.continue();
          } else {
            resolve(array);
          }
        };
      }
    );
    return await this.arrayAlunos;
  }

  //-----------------------------------------------------------------------------------------//


  async incluir(aluno) {
    let db = await this.db;
    let resultado = new Promise( (resolve, reject) => {
      let transacao = db.transaction(["AlunoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o aluno", event.target.error));
      };
      let store = transacao.objectStore("AlunoST");
      store.add(aluno);
      resolve(true);      
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(aluno) {
    let db = await this.db;
    let resultado = new Promise(function(resolve, reject) {
      let transacao = db.transaction(["AlunoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o aluno", event.target.error));
      };
      let store = transacao.objectStore("AlunoST");
      store.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.matricula == aluno.matricula) {
            const request = cursor.update(aluno);
            request.onsuccess = () => {
              console.log("[DaoAluno.alterar] Cursor update - Sucesso ");
              resolve("Ok");
            };
          }
          cursor.continue();
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(aluno) {
    let db = await this.db;
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = db.transaction(["AlunoST"], "readwrite");
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o aluno", event.target.error));
      };
      let store = transacao.objectStore("AlunoST");
      store.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.matricula == aluno.matricula) {
            const request = cursor.delete();
            request.onsuccess = () => { resolve("Ok"); };
            return true;
          }
          cursor.continue();
        }
        reject(new ModelError("Aluno com a matrícula" + aluno.matricula + " não encontrado!",""));
      };
    });
    return false;
  }

  //-----------------------------------------------------------------------------------------//
}