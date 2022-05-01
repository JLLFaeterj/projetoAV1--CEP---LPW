import ModelError from "/ModelError.js";

export default class Cliente {  //ALTERADO NOME DA CLASSE
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #nome;
  #cnpj;
  #email;  //ALTERADA ORDEM DA DEVLARAÇÃO DE VARIÁVEIS
  #telefone;
  #matricula;

  //-----------------------------------------------------------------------------------------//

  constructor(matr, cnpj, nome, email, telefone) {
    this.setMatricula(matr);
    this.setCnpj(cnpj);
    this.setNome(nome);
    this.setEmail(email);
    this.setTelefone(telefone);      
  }
  
  //-----------------------------------------------------------------------------------------//

  getMatricula() {
    return this.#matricula;
  }
  
  //-----------------------------------------------------------------------------------------//

  setMatricula(matr) {
    if(!Cliente.validarMatricula(matr))  //Alterado de 'Aluno' para 'Cliente'
      throw new ModelError("Matrícula Inválida: " + matr);
    this.#matricula = matr;
  }
  
  //-----------------------------------------------------------------------------------------//

  getCnpj() {
    return this.#cnpj;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCnpj(cnpj) {
    if(!Cliente.validarCnpj(cnpj))   //Alterado de 'Aluno' para 'Cliente'
      throw new ModelError("CPF Inválido: " + cnpj);
    this.#cnpj = cnpj;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.#nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Cliente.validarNome(nome))   //Alterado de 'Aluno' para 'Cliente'
      throw new ModelError("Nome Inválido: " + nome);
    this.#nome = nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getEmail() {
    return this.#email;
  }
  
  //-----------------------------------------------------------------------------------------//

  setEmail(email) {
    if(!Cliente.validarEmail(email))  //Alterado de 'Aluno' para 'Cliente'
      throw new ModelError("Email inválido: " + email);
    this.#email = email;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTelefone() {
    return this.#telefone;
  }
  
  //-----------------------------------------------------------------------------------------//

  setTelefone(telefone) {
    if(!Cliente.validarTelefone(telefone))   //Alterado de 'Aluno' para 'Cliente'
      throw new ModelError("Telefone inválido: " + telefone);
    this.#telefone = telefone;
  }
  
  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"matricula" : "'+ this.#matricula + '",' +
               '"cnpj" :  "'     + this.#cnpj       + '",' +
               '"nome" : "'     + this.#nome      + '",' +
               '"email" : "'    + this.#email     + '",' +
               '"telefone" : "' + this.#telefone  + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Cliente(obj.matricula, obj.cnpj, obj.nome, obj.email, obj.telefone);  //Alterando nome do objeto de 'Aluno' para 'Cliente'
  }

  //-----------------------------------------------------------------------------------------//
  
  static deassign(obj) { 
    return JSON.parse(obj.toJSON());
  }

  //-----------------------------------------------------------------------------------------//

  static validarMatricula(matr) {
    if(matr == null || matr == "" || matr == undefined)
      return false;
    const padraoMatricula = /[0-9]/;
    if (!padraoMatricula.test(matr))
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarCnpj(cnpj) {
    
    var b = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ]
    var c = String(cnpj).replace(/[^\d]/g, '')
    
    if(c.length !== 14)
        return false

    if(/0{14}/.test(c))
        return false

    for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
    if(c[12] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
    if(c[13] != (((n %= 11) < 2) ? 0 : 11 - n))
        return false

    return true
  }

  //-----------------------------------------------------------------------------------------//

  static validarNome(nome) {
    if(nome == null || nome == "" || nome == undefined)
      return false;
    if (nome.length > 40) 
      return false;
    const padraoNome = /[A-Z][a-z] */;
    if (!padraoNome.test(nome)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarEmail(email) {
    if(email == null || email == "" || email == undefined)
      return false;

    const padraoEmail = /[a-zA-Z0-9._%-]+@[a-zA-Z0-9-]+.[a-zA-Z]{2,4}/;
    if (!padraoEmail.test(email)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//

  static validarTelefone(telefone) {
    if(telefone == null || telefone == "" || telefone == undefined)
      return false;

    const padraoTelefone = /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;
    if (!padraoTelefone.test(telefone)) 
      return false;
    return true;
  }

  //-----------------------------------------------------------------------------------------//
   
  mostrar() {
    let texto = "Matrícula: " + this.matricula + "\n";
    texto += "Nome: " + this.nome + "\n";
      
    alert(texto);
    alert(JSON.stringify(this));
  }
}