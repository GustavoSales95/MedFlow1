create database medflow;

use medflow;

CREATE TABLE perfis (
    id_perfis int PRIMARY KEY,
    nome VARCHAR(50) NOT NULL -- Comum, Admin, Medico
);

CREATE TABLE usuarios (
    id_usuario int auto_increment PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL, -- formato: 000.000.000-00
    perfil_id INT NOT NULL,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id_perfis)
);

CREATE TABLE pacientes (
    id_paciente int auto_increment PRIMARY KEY,
    cpf VARCHAR(14) UNIQUE, -- redundante, mas pode ser útil se separar do usuário
    data_nascimento DATE,
    telefone VARCHAR(13),
    endereco varchar(255)
);

CREATE TABLE prontuario(
	paciente_id int unique not null,
	alergias varchar(50),
    tipo_sanguineo Char(3),
    medicamentos varchar(255),
    cirurgias varchar(255),
    doencas_infecciosas varchar(50),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente)
);

CREATE TABLE medicos (
    id_medico int auto_increment PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    crm VARCHAR(20) UNIQUE NOT NULL,
    especialidade VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario)
);

CREATE TABLE agendamentos (
    id_agendamento int auto_increment PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    data_hora datetime NOT NULL,
    status VARCHAR(30) DEFAULT 'agendado', -- agendado, cancelado, concluído
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (medico_id) REFERENCES medicos(id_medico)
);

CREATE TABLE consultas (
    id_consulta int auto_increment PRIMARY KEY,
    agendamento_id INT UNIQUE NOT NULL,
    descricao varchar(255),
    receita varchar(255),
    observacoes varchar(255),
    data_consulta datetime,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id_agendamento)
);

INSERT INTO perfis (id_perfis, nome) VALUES (1, 'Comum'),(2, 'Admin'),(3, 'Medico');

INSERT INTO usuarios (nome, email, senha, cpf, perfil_id) VALUES ("David Ramos Mendes Cardoso", "daviddivad25.12@gmail.com", "Senha@123", "41143676831", 2);

INSERT INTO medicos (usuario_id, crm, especialidade) Values (1, "12345678", "Cardiologista");

INSERT INTO pacientes (cpf, data_nascimento, telefone, endereco) VALUES ("12345678907", '2005-05-05', "119911007252", "Mario Latorre 245");

INSERT INTO prontuario (paciente_id, alergias, tipo_sanguineo, medicamentos, cirurgias, doencas_infecciosas) VALUES (1, "Pelo de gato", "O-", "", "Transplante de rim", "Tuberculose");

select * from usuarios;
select * from pacientes;
select * from medicos;
select * from agendamentos;
select * from prontuario;