export { Login } from "./login/Login";


// Rotas para usuários comuns
export { Dashboard } from "./Comum/dashboard/Dashboard";
export { Marcacao } from "./Comum/marcacao/Marcacao";
export { Cadastros } from "./Comum/cadastros/Cadastros";
export { ConsultarPessoas } from "./Comum/cadastros/ConsultarPessoas";

//Rotas Administrador
export { CadastrosUsuarios } from "./admin/cadastros/CadastrosUsuarios";
export { DashboardAdmin } from "./admin/dashboardAdmin/DashboardAdmin";
export { ConsultarUsuarios } from "./admin/cadastros/ConsultarUsuarios";
export { EditarEscala } from "./admin/cadastros/EditarEscala";


//Rotas Estoque
export { Entrada } from "./Estoque/Entrada/Entrada_sai";
export { Editar } from "./Estoque/editar/editar";
export { Estoque } from "./Estoque/Estoque";

// Imports medicos
export { DashboardMedico } from "./medico/dashboardMedico/Dashboard";
export { ConsultarProntuario } from "./medico/Cadastros/ProntuarioPessoa";
export { AgendaDia } from "./medico/agenda/agendaDiaria";
