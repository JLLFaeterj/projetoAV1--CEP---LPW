import ModelError from "/ModelError.js";

export default class Cliente {  //ALTERADO NOME DA CLASSE
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #nome;
  #cpf;
  #email;  //ALTERADA ORDEM DA DEVLARAÇÃO DE VARIÁVEIS
  #telefone;
  #matricula;

  //-----------------------------------------------------------------------------------------//

  constructor(matr, cpf, nome, email, telefone) {
    this.setMatricula(matr);
    this.setCpf(cpf);
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

  getCpf() {
    return this.#cpf;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCpf(cpf) {
    if(!Cliente.validarCpf(cpf))   //Alterado de 'Aluno' para 'Cliente'
      throw new ModelError("CPF Inválido: " + cpf);
    this.#cpf = cpf;
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
               '"cpf" :  "'     + this.#cpf       + '",' +
               '"nome" : "'     + this.#nome      + '",' +
               '"email" : "'    + this.#email     + '",' +
               '"telefone" : "' + this.#telefone  + '" ' + 
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Cliente(obj.matricula, obj.cpf, obj.nome, obj.email, obj.telefone);  //Alterando nome do objeto de 'Aluno' para 'Cliente'
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

  static validarCpf(strCpf) {
     
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
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