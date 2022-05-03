import ModelError from "/ModelError.js";

export default class Hotel {  //ALTERADO NOME DA CLASSE
    
  //
  // DECLARAÇÃO DE ATRIBUTOS PRIVADOS: Em JavaScript, se o nome do atributo tem # no início, isso 
  // indica que ele é privado. Também deve-se colocar a presença dele destacada, como está abaixo.
  //
  #nome;
  #cnpj;
  #email;  //ALTERADA ORDEM DA DECLARAÇÃO DE VARIÁVEIS
  #telefone;
  #matricula;
  #cep   ///ALTERADO CEP

  //-----------------------------------------------------------------------------------------//

  constructor(matr, cnpj, nome, email, telefone, cep) {  ///ALTERADO CEP
    this.setMatricula(matr);
    this.setCnpj(cnpj);
    this.setNome(nome);
    this.setEmail(email);
    this.setTelefone(telefone); 
    this.setCep(cep);  ///ALTERADO CEP
  }
  
  //-----------------------------------------------------------------------------------------//

  getMatricula() {
    return this.#matricula;
  }
  
  //-----------------------------------------------------------------------------------------//

  setMatricula(matr) {
    if(!Hotel.validarMatricula(matr))  //Alterado de 'Aluno' para 'Hotel'
      throw new ModelError("Matrícula Inválida: " + matr);
    this.#matricula = matr;
  }
  
  //-----------------------------------------------------------------------------------------//

  getCnpj() {
    return this.#cnpj;
  }
  
  //-----------------------------------------------------------------------------------------//

  setCnpj(cnpj) {
    if(!Hotel.validarCnpj(cnpj))   //Alterado de 'Aluno' para 'Hotel'
      throw new ModelError("CNPJ Inválido: " + cnpj);
    this.#cnpj = cnpj;
  }
  
  //-----------------------------------------------------------------------------------------//

  getNome() {
    return this.#nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  setNome(nome) {
    if(!Hotel.validarNome(nome))   //Alterado de 'Aluno' para 'Hotel'
      throw new ModelError("Nome Inválido: " + nome);
    this.#nome = nome;
  }
  
  //-----------------------------------------------------------------------------------------//

  getEmail() {
    return this.#email;
  }
  
  //-----------------------------------------------------------------------------------------//

  setEmail(email) {
    if(!Hotel.validarEmail(email))  //Alterado de 'Aluno' para 'Hotel'
      throw new ModelError("Email inválido: " + email);
    this.#email = email;
  }
  
  //-----------------------------------------------------------------------------------------//

  getTelefone() {
    return this.#telefone;
  }
  
  //-----------------------------------------------------------------------------------------//

  setTelefone(telefone) {
    if(!Hotel.validarTelefone(telefone))   //Alterado de 'Aluno' para 'Hotel'
      throw new ModelError("Telefone inválido: " + telefone);
    this.#telefone = telefone;
  }
  
  //-----------------------------------------------------------------------------------------//

  getCep() {
    return this.#cep;  ///ALTERADO CEP
  }
  
  //-----------------------------------------------------------------------------------------//

  setCep(cep) {
    if(!Hotel.validarCep(cep))   //Alterado de 'Aluno' para 'Hotel'
      throw new ModelError("Cep Inválido: " + cep);
    this.#cep = cep;    ///ALTERADO CEP
  }
  
  //-----------------------------------------------------------------------------------------//

  toJSON() {
    return '{' +
               '"matricula" : "'+ this.#matricula + '",' +
               '"cnpj" :  "'    + this.#cnpj      + '",' +
               '"nome" : "'     + this.#nome      + '",' +
               '"email" : "'    + this.#email     + '",' +
               '"telefone" : "' + this.#telefone  + '",' +
               '"cep" : "'      + this.#cep       + '" ' +  //ALTERADO CEP
           '}';  
  }
  
  //-----------------------------------------------------------------------------------------//

  static assign(obj) {
    return new Hotel(obj.matricula, obj.cnpj, obj.nome, obj.email, obj.telefone, obj.cep);  //Alterando nome do objeto de 'Aluno' para 'Hotel'  ///ALTERADO CEP
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
    
  if (!cnpj) return false

  // Aceita receber o valor como string, número ou array com todos os dígitos
  const isString = typeof cnpj === 'string'
  const validTypes = isString || Number.isInteger(cnpj) || Array.isArray(cnpj)

  // Elimina valor em formato inválido
  if (!validTypes) return false

  // Filtro inicial para entradas do tipo string
  if (isString) {
    // Limita ao máximo de 18 caracteres, para CNPJ formatado
    if (cnpj.length > 18) return false

    // Teste Regex para veificar se é uma string apenas dígitos válida
    const digitsOnly = /^\d{14}$/.test(cnpj)
    // Teste Regex para verificar se é uma string formatada válida
    const validFormat = /^\d{2}.\d{3}.\d{3}\/\d{4}-\d{2}$/.test(cnpj)

    // Se o formato é válido, usa um truque para seguir o fluxo da validação
    if (digitsOnly || validFormat) true
    // Se não, retorna inválido
    else return false
  }

  // Guarda um array com todos os dígitos do valor
  const match = cnpj.toString().match(/\d/g)
  const numbers = Array.isArray(match) ? match.map(Number) : []

  // Valida a quantidade de dígitos
  if (numbers.length !== 14) return false
  
  // Elimina inválidos com todos os dígitos iguais
  const items = [...new Set(numbers)]
  if (items.length === 1) return false

  // Cálculo validador
  const calc = (x) => {
    const slice = numbers.slice(0, x)
    let factor = x - 7
    let sum = 0

    for (let i = x; i >= 1; i--) {
      const n = slice[x - i]
      sum += n * factor--
      if (factor < 2) factor = 9
    }

    const result = 11 - (sum % 11)

    return result > 9 ? 0 : result
  }

  // Separa os 2 últimos dígitos de verificadores
  const digits = numbers.slice(12)
  
  // Valida 1o. dígito verificador
  const digit0 = calc(12)
  if (digit0 !== digits[0]) return false

  // Valida 2o. dígito verificador
  const digit1 = calc(13)
  return digit1 === digits[1]
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
  
  static validarCep(cep) {
    if(telefone == null || telefone == "" || telefone == undefined)
      return false;
    
    const regex = /[0-9]{5}-[\d]{3}/g;
    const cep_ = cep;
    if (!regex.test(cep_)) {
      return false;
    }
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