const insertMaskCpf = (cpf: string) => {
  // Remove qualquer caractere que não seja número
  cpf = cpf.replace(/\D/g, '');

  // Aplica a máscara conforme o usuário digita
  return cpf
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
};

const insertMaskTel = (telefone: string) => {
  telefone = telefone.replace(/\D/g, '');
  
  // Aplica a formatação do DDD
  telefone = telefone.replace(/^(\d{2})(\d)/, "($1) $2");
  
  // Insere o traço entre o quarto ou quinto e os quatro últimos dígitos
  telefone = telefone.replace(/(\d{4,5})(\d{4})/, "$1-$2");
  
  return telefone;
};

const insertMaskCep = (cep: string) => {
  cep = cep.replace(/\D/g, '');

  cep = cep.replace(/(\d{5})(\d)/, "$1-$2");

  return cep
};

const insertMaskSus = (cartaoSus: string) => {
  cartaoSus = cartaoSus.replace(/\D/g, '');

  return cartaoSus
    .replace(/^(\d{3})(\d)/, "$1 $2")
    .replace(/^(\d{3}) (\d{4})(\d)/, "$1 $2 $3")
    .replace(/^(\d{3}) (\d{4}) (\d{4})(\d)/, "$1 $2 $3 $4");
};

const insertMaskHora = (horario: string) => {
  horario = horario.replace(/\D/g, '');
  horario = horario.replace(/^(\d{2})(\d)/, "$1:$2");
  horario = horario.replace(/^(\d{2}:\d{2})(\d{1,4})/, "$1 - $2");
  horario = horario.replace(/( - \d{2})(\d)/, "$1:$2");
  
  return horario;
};




export { insertMaskCpf, insertMaskTel, insertMaskCep, insertMaskSus, insertMaskHora }