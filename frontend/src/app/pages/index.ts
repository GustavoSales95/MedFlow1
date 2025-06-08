export { Login } from "./login/Login";


// Rotas para usuários comuns
export { Dashboard } from "./Comum/dashboard/Dashboard";
export { Marcacao } from "./Comum/marcacao/Marcacao";
export { Cadastros } from "./Comum/cadastros/Cadastros";
export { ConsultarPessoas } from "./Comum/cadastros/ConsultarPessoas";
export { MedicosDisponiveis } from "./Comum/marcacao/MedicosDisponiveis";


//Rotas Administrador
export { CadastrosUsuarios } from "./admin/cadastros/CadastrosUsuarios";
export { DashboardAdmin } from "./admin/dashboardAdmin/DashboardAdmin";
export { ConsultarUsuarios } from "./admin/cadastros/ConsultarUsuarios";
export { EditarEscala } from "./admin/cadastros/EditarEscala";


//Rotas Estoque
export { DashboardEstoque } from "./Estoque/dashboardEstoque/DashboardEst";
export { Entrada } from "./Estoque/Entrada/Entrada_sai";
export { Editar } from "./Estoque/editar/editar";
export { CadastroEstoque } from "./Estoque/CadastroEstoque";
export { ProdutoEstoque } from "./Estoque/Entrada/ProdutoEstoque";

// Imports medicos
export { DashboardMedico } from "./medico/dashboardMedico/Dashboard";
export { ConsultarProntuario } from "./medico/Cadastros/ProntuarioPessoa";
export { AgendaDia } from "./medico/agenda/agendaDiaria";
export { Agendamentos } from "./medico/agenda/Agendamentos";
export { FinalizarConsulta } from "./medico/agenda/FinalizarConsulta";
export { ConsultarEscala } from "./medico/agenda/ConsultarEscala";
