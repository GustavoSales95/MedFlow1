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



export { insertMaskCpf, insertMaskTel }