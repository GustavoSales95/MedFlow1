CREATE DATABASE dbMedflow;

USE dbMedflow;

/* Cria e define os tipos de usuário para serem usados como foreign key */
CREATE TABLE Tipo_usuario(
	id_tipo int primary key auto_increment,
    tipo varchar(30)
    );
    
INSERT INTO Tipo_usuario(id, tipo) VALUES ("Admin");
INSERT INTO Tipo_usuario(id, tipo) VALUES ("Medico");
INSERT INTO Tipo_usuario(id, tipo) VALUES ("Comum");

/* Tabelas de pessoas e usuários */
CREATE TABLE Pessoa (
    id_pessoa int primary key auto_increment,
    cpf CHAR(11) NOT NULL unique,
	nome VARCHAR(30) NOT NULL,
	telefone VARCHAR(11) NOT NULL,
    data_nascimento DATE NOT NULL,
    sexo enum('F','M') NOT NULL,
    data_cadastro DATETIME NOT NULL
);

CREATE TABLE Usuario (
    id_usuario int PRIMARY KEY auto_increment,
    id_pessoa INT NOT NULL,
    id_tipo int not null,
    login VARCHAR(50) NOT NULL unique,
	senha VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES tipo_usuario (id_tipo),
    FOREIGN KEY (id_pessoa) REFERENCES Pessoa (id_pessoa)
);

CREATE TABLE Medico (
    id_medico int PRIMARY KEY auto_increment,
    id_usuario INT NOT NULL,
    crm CHAR(6) NOT NULL unique,
    email varchar(30)  default('') unique,
    especialidade varchar(100),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario)
);

CREATE TABLE Paciente (
    id_paciente int PRIMARY KEY auto_increment,
    id_pessoa INT NOT NULL,
    cartao_sus VARCHAR(15),
    convenio_medico VARCHAR(50),
    nivel_emg varchar(15),
    FOREIGN KEY (id_pessoa) REFERENCES Pessoa (id_pessoa)
);

/* Tabelas de exame e consulta */
CREATE TABLE Exame (
    id_exame SERIAL PRIMARY KEY auto_increment,
	id_medico int not null,
    tipo VARCHAR(30),
    resultado TEXT,
    data_solicitada DATE,
    data_realizada DATE,
    veredito VARCHAR(15) CHECK(veredito IN('pendente' , 'realizado', 'cancelado')),
    FOREIGN KEY (id_medico) REFERENCES Medico (id_medico)
);


create table Consulta(
id_consulta int primary key auto_increment,
nome varchar(40) not null,
horario time not null,
cpf varchar(11) not null,
cartao_sus VARCHAR(15)
);


/* Tabelas de controle de estoque */
CREATE TABLE Fornecedor (
    id_fornecedor int PRIMARY KEY auto_increment,
	cnpj VARCHAR(14) NOT NULL unique,
    nome VARCHAR(30) NOT NULL,
    telefone VARCHAR(11),
    endereco VARCHAR(100) NOT NULL
);

CREATE TABLE Estoque_produto (
    id_produto int PRIMARY KEY auto_increment,
    nome VARCHAR(30),
    data_validade DATE,
    tipo VARCHAR(12),
    descricao VARCHAR(150) NOT NULL,
    fabricante VARCHAR(15),
    lote INT,
    quantidade INT NOT NULL
);

CREATE TABLE Nota_fiscal (
    id_nota_fiscal int PRIMARY KEY auto_increment,
    data_entrada DATE NOT NULL,
    numero_nota VARCHAR(44) NOT NULL,
    id_fornecedor INT NOT NULL,
    valor_nota DECIMAL (10.2) NOT NULL,
    data_cadastro_nota DATE NOT NULL,
    FOREIGN KEY (id_fornecedor) REFERENCES Fornecedor (id_fornecedor)
);

CREATE TABLE Produto_nota (
    id_produto_nota int PRIMARY KEY auto_increment,
    id_nota_fiscal INT NOT NULL,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    FOREIGN KEY (id_nota_fiscal) REFERENCES Nota_fiscal (id_nota_fiscal),
    FOREIGN KEY (id_produto) REFERENCES Estoque_produto (id_produto)
);

CREATE TABLE Entrada_saida (
    id_entrada_saida int PRIMARY KEY auto_increment,
	id_produto INT not null,
    id_produto_nota int not null,
	quantidade INT NOT NULL,
	id_exame int,
    id_medico INT,
    id_paciente INT,
    id_usuario INT,
    id_pessoa int,
    tipo_transacao VARCHAR(7) NOT NULL,
    data_transacao DATETIME NOT NULL,
    FOREIGN KEY (id_exame) REFERENCES Exames (id_exame),
    FOREIGN KEY (id_pessoa) REFERENCES pessoa (id_pessoa),
    FOREIGN KEY (id_medico) REFERENCES Medico (id_medico),
    FOREIGN KEY (id_produto_nota) REFERENCES produto_nota (id_produto_nota),
    FOREIGN KEY (id_paciente) REFERENCES Paciente (id_paciente),
    FOREIGN KEY (id_usuario) REFERENCES Usuario (id_usuario),
    FOREIGN KEY (id_produto) REFERENCES Estoque_produto (id_produto)
);
