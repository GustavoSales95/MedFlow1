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


const formatarDataHora = (dataHora: string | Date) => {
  const date = typeof dataHora === "string" ? new Date(dataHora) : dataHora;

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0"); // Os meses começam em 0
  const ano = date.getFullYear();

  const hora = String(date.getHours()).padStart(2, "0");
  const minuto = String(date.getMinutes()).padStart(2, "0");

  return {
    data: `${dia}/${mes}/${ano}`,  
    horario: `${hora}:${minuto}`  
  };
}

function nextWeekday(from: Date, targetDow: number): Date {
  const todayDow = from.getDay();
  // diferença até o target; se for 0, delta = 0
  const delta = (targetDow - todayDow + 7) % 7;
  const result = new Date(from);
  result.setDate(from.getDate() + delta);
  return result;
}

const WEEKDAYS = {
  segunda: 1,
  terca:   2,
  quarta:  3,
  quinta:  4,
  sexta:   5,
  sabado:  6,
  domingo: 0,
} as const;

function getNextWeekdays(from = new Date()) {
  const obj: Record<keyof typeof WEEKDAYS, Date> = {} as any;
  for (const [name, idx] of Object.entries(WEEKDAYS)) {
    obj[name as keyof typeof WEEKDAYS] = nextWeekday(from, idx);
  }
  return obj;
}


export { insertMaskCpf, insertMaskTel, insertMaskCep, insertMaskSus, insertMaskHora, formatarDataHora, getNextWeekdays }