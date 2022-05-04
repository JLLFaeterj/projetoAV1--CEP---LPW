"use strict";

import ModelError from "/ModelError.js";
import Hotel from "/Hotel.js";

export default class DaoHotel {
  
  //-----------------------------------------------------------------------------------------//

  static conexao = null;

  constructor() {
    this.arrayHoteis = [];  
    this.obterConexao();
  }

  //-----------------------------------------------------------------------------------------//
  
  
  async obterConexao() {
    if(DaoHotel.conexao == null) {  
      DaoHotel.conexao = new Promise(function(resolve, reject) {
        let requestDB = window.indexedDB.open("HotelDB", 1);  

        requestDB.onupgradeneeded = (event) => {
          let db = event.target.result;
          let store = db.createObjectStore("HotelST", {  
            autoIncrement: true
          });
          store.createIndex("idxMatricula", "matricula", { unique: true });
        };

        requestDB.onerror = event => {
          reject(new ModelError("Erro: " + event.target.errorCode));
        };

        requestDB.onsuccess = event => {
          if (event.target.result) {
            
            resolve(event.target.result);
          }
          else 
            reject(new ModelError("Erro: " + event.target.errorCode));
        };
      });
    }
    return await DaoHotel.conexao;  
  }
  
  //-----------------------------------------------------------------------------------------//

  async obterHoteis() { 
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["HotelST"], "readonly"); 
        store = transacao.objectStore("HotelST");  
        indice = store.index('idxMatricula');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      indice.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Hotel.assign(cursor.value);  
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayHoteis = await promessa;  
    return this.arrayHoteis; 
  }

  //-----------------------------------------------------------------------------------------//

  async obterHotelPelaMatricula(matr) { 
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      let indice;
      try {
        transacao = connection.transaction(["HotelST"], "readonly");  
        store = transacao.objectStore("HotelST");  
        indice = store.index('idxMatricula');
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }

      let consulta = indice.get(matr);
      consulta.onsuccess = function(event) { 
        if(consulta.result != null)
          resolve(Hotel.assign(consulta.result));   
        else
          resolve(null);
      };
      consulta.onerror = function(event) { reject(null); };
    });
    let hotel = await promessa;  
    return hotel;    //
  }

  //-----------------------------------------------------------------------------------------//

  async obterHoteisPeloAutoIncrement() {  
    let connection = await this.obterConexao();      
    let promessa = new Promise(function(resolve, reject) {
      let transacao;
      let store;
      try {
        transacao = connection.transaction(["HotelST"], "readonly"); 
        store = transacao.objectStore("HotelST");  
      } 
      catch (e) {
        reject(new ModelError("Erro: " + e));
      }
      let array = [];
      store.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {        
          const novo = Hotel.assign(cursor.value);  
          array.push(novo);
          cursor.continue();
        } else {
          resolve(array);
        }
      };
    });
    this.arrayHoteis = await promessa;  
    return this.arrayHoteis;  
  }

  //-----------------------------------------------------------------------------------------//

  async incluir(hotel) {  
    let connection = await this.obterConexao();      
    let resultado = new Promise( (resolve, reject) => {
      let transacao = connection.transaction(["HotelST"], "readwrite"); 
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível incluir o hotel", event.target.error));
      };
      let store = transacao.objectStore("HotelST");  
      let requisicao = store.add(Hotel.deassign(hotel));  
      requisicao.onsuccess = function(event) {
          resolve(true);              
      };
    });
    return await resultado;
  }

  //-----------------------------------------------------------------------------------------//

  async alterar(hotel) {
    let connection = await this.obterConexao();      
    let resultado = new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["HotelST"], "readwrite");  
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível alterar o hotel", event.target.error)); 
      };
      let store = transacao.objectStore("HotelST");    
      let indice = store.index('idxMatricula');
      var keyValue = IDBKeyRange.only(hotel.getMatricula());  
      indice.openCursor(keyValue).onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
          if (cursor.value.matricula == hotel.getMatricula()) {  
            const request = cursor.update(Hotel.deassign(hotel)); 
            request.onsuccess = () => {
              console.log("[DaoHotel.alterar] Cursor update - Sucesso ");  
              resolve("Ok");
              return;
            };
          } 
        } else {
          reject(new ModelError("Hotel com a matrícula " + hotel.getMatricula() + " não encontrado!",""));  
        }
      };
    });
    return await resultado;
  }
  
  //-----------------------------------------------------------------------------------------//

  async excluir(hotel) {  
    let connection = await this.obterConexao();      
    let transacao = await new Promise(function(resolve, reject) {
      let transacao = connection.transaction(["HotelST"], "readwrite");  
      transacao.onerror = event => {
        reject(new ModelError("Não foi possível excluir o hotel", event.target.error));  
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