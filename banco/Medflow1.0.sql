create database medflow;

use medflow;

CREATE TABLE perfis (
    id_perfis int PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL -- Comum, Admin, Medico
);

CREATE TABLE usuarios (
    id_usuario int auto_increment PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL, -- formato: 000.000.000-00
    data_nascimento date NOT NULL,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    perfil_id INT NOT NULL,
    FOREIGN KEY (perfil_id) REFERENCES perfis(id_perfis)
);

CREATE TABLE pacientes (
    id_paciente int auto_increment PRIMARY KEY,
    nome varchar(100) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL, -- redundante, mas pode ser útil se separar do usuário
    cartao_sus VARCHAR(15) UNIQUE,
    data_nascimento DATE,
    telefone VARCHAR(20),
    cep VARCHAR(8),
    endereco varchar(255),
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE medicos (
    id_medico int auto_increment PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    crm VARCHAR(20) UNIQUE NOT NULL,
    especialidade VARCHAR(50),
    telefone VARCHAR(20),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario)
);

CREATE TABLE escala (
	id_escala int auto_increment PRIMARY KEY,
	id_medico INT UNIQUE NOT NULL,
    segunda ENUM('Escalado', 'Folga'),
    segunda_horario VARCHAR(13) DEFAULT "09:00 - 17:00",
    terca ENUM('Escalado', 'Folga'),
    terca_horario VARCHAR(13) DEFAULT "09:00 - 17:00",
    quarta ENUM('Escalado', 'Folga'),
    quarta_horario VARCHAR(13) DEFAULT "09:00 - 17:00",
    quinta ENUM('Escalado', 'Folga'),
    quinta_horario VARCHAR(13) DEFAULT "09:00 - 17:00",
    sexta ENUM('Escalado', 'Folga'),
    sexta_horario VARCHAR(13) DEFAULT "09:00 - 17:00",
    sabado ENUM('Escalado', 'Folga'),
    sabado_horario VARCHAR(13) DEFAULT "09:00 - 17:00",
    domingo ENUM('Escalado', 'Folga'),
    domingo_horario VARCHAR(13) DEFAULT "09:00 - 17:00"
);

CREATE TABLE prontuario(
	paciente_id int unique not null,
	alergias varchar(50),
    tipo_sanguineo varchar(14),
    medicamentos varchar(255),
    cirurgias varchar(255),
    doencas_infecciosas varchar(50),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente)
);

CREATE TABLE agendamentos (
    id_agendamento int auto_increment PRIMARY KEY,
    paciente_id INT NOT NULL,
    medico_id INT NOT NULL,
    nome_paciente varchar(100),
    data_hora datetime NOT NULL,
    status ENUM("Agendado", "Cancelado", "Concluído") DEFAULT 'Agendado',
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
CREATE TABLE produtos (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    quantidade INT DEFAULT 0,
    embalagem VARCHAR(255),
    unidade_medida VARCHAR(100),
    temperatura ENUM('PERECIVEL', 'RESFRIADO', 'TERMOSSENSIVEL') NOT NULL
);

CREATE TABLE produto_estoque (
	id_produto_estoque INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT NOT NULL,
    quantidade INT NOT NULL,
    validade DATE NOT NULL,
    deletado ENUM('Sim', 'Nao') NOT NULL DEFAULT 'Nao',
    vencimento_proximo ENUM('Sim', 'Nao') NOT NULL DEFAULT 'Nao',
    FOREIGN KEY (id_produto) REFERENCES produtos(id_produto)
);

CREATE TABLE receitas (
	id_receita INT auto_increment PRIMARY KEY ,
    medico_id INT  NOT NULL,
    paciente_id INT NOT NULL,
    produto_id INT NOT NULL,
    data_emissao DATE NOT NULL,
    medicamentos varchar(255) NOT NULL,
    orientacoes varchar(255),
    FOREIGN KEY (produto_id) REFERENCES produtos(id_produto),
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id_paciente),
    FOREIGN KEY (medico_id) REFERENCES medicos(id_medico)
);


CREATE TABLE pedidos (
	id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_produto_estoque INT NOT NULL,
    quantidade INT NOT NULL,
    fornecedor VARCHAR(100) NOT NULL,
    data_pedido DATE NOT NULL,
    FOREIGN KEY (id_produto_estoque) REFERENCES produto_estoque(id_produto_estoque)
);

CREATE TABLE Entrada_saida (
    id_entrada_saida int PRIMARY KEY auto_increment,
	id_produto_estoque INT not null,
	quantidade INT NOT NULL,
	id_consulta int,
    id_medico INT,
    id_paciente INT,
    id_usuario INT,
    id_pedido INT,
    tipo_transacao VARCHAR(10) NOT NULL,
    data_transacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_consulta) REFERENCES consultas (id_consulta),
    FOREIGN KEY (id_medico) REFERENCES medicos (id_medico),
    FOREIGN KEY (id_paciente) REFERENCES pacientes (id_paciente),
    FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario),
    FOREIGN KEY (id_produto_estoque) REFERENCES produto_estoque (id_produto_estoque)
);

DELIMITER //
CREATE TRIGGER trg_produto_estoque_after_insert
AFTER INSERT ON produto_estoque
FOR EACH ROW
BEGIN
  UPDATE produtos
  SET quantidade = (
    SELECT IFNULL(SUM(CAST(quantidade AS UNSIGNED)), 0)
    FROM produto_estoque
    WHERE id_produto = NEW.id_produto
  )
  WHERE id_produto = NEW.id_produto;
END;
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER trg_produto_estoque_after_update
AFTER UPDATE ON produto_estoque
FOR EACH ROW
BEGIN
  UPDATE produtos
  SET quantidade = (
    SELECT IFNULL(SUM(CAST(quantidade AS UNSIGNED)), 0)
    FROM produto_estoque
    WHERE id_produto = NEW.id_produto
  )
  WHERE id_produto = NEW.id_produto;
END;
//
DELIMITER ;
DELIMITER //
CREATE TRIGGER trg_produto_estoque_after_delete
AFTER DELETE ON produto_estoque
FOR EACH ROW
BEGIN
  UPDATE produtos
  SET quantidade = (
    SELECT IFNULL(SUM(CAST(quantidade AS UNSIGNED)), 0)
    FROM produto_estoque
    WHERE id_produto = OLD.id_produto
  )
  WHERE id_produto = OLD.id_produto;
END;
//
DELIMITER ;

DELIMITER //
CREATE EVENT trg_validade_expirada
ON SCHEDULE
	EVERY 24 HOUR
    COMMENT 'Verificação de validade'
    DO UPDATE estoque_produto SET deletado = "Sim"
    WHERE validade < CURDATE();
//
DELIMITER ;


INSERT INTO perfis (id_perfis, tipo) VALUES (1, 'Admin'),(2, 'Comum'),(3, 'Medico');

INSERT INTO usuarios (nome, email, senha, cpf, data_nascimento, perfil_id) VALUES ("David Ramos", "david@gmail.com", "$2b$10$wzr/1Ia8QOKWyRKdw78Soels4kqQLkRM7rUdOuzQraiGzytaMlPMu", "41143676835", "2004-12-25", 1);

/* Inserts de usuários teste para o login. Senha: senha@123 */
INSERT INTO usuarios (nome, email, senha, cpf, data_nascimento, perfil_id) VALUES ("Admin Teste", "admin@gmail.com", "$2b$10$wzr/1Ia8QOKWyRKdw78Soels4kqQLkRM7rUdOuzQraiGzytaMlPMu", "41143676831", "2004-12-25", 1);

INSERT INTO usuarios (nome, email, senha, cpf, data_nascimento, perfil_id) VALUES ("Médico Teste", "medico@gmail.com", "$2b$10$wzr/1Ia8QOKWyRKdw78Soels4kqQLkRM7rUdOuzQraiGzytaMlPMu", "41143676832", "1990-02-22", 3);

INSERT INTO usuarios (nome, email, senha, cpf, data_nascimento, perfil_id) VALUES ("Comum Teste", "comum@gmail.com", "$2b$10$wzr/1Ia8QOKWyRKdw78Soels4kqQLkRM7rUdOuzQraiGzytaMlPMu", "41143676833", "1990-02-22", 2);

INSERT INTO medicos (usuario_id, crm, especialidade, telefone) Values (3, "123456", "Cardiologista", "11992382152");

INSERT INTO escala(id_medico, segunda, terca, quarta, quinta, sexta,sabado, domingo) VALUES (1, "Escalado", "Escalado", "Escalado", "Escalado", "Escalado", "Folga", "Folga");

INSERT INTO pacientes (nome, cpf, cartao_sus, data_nascimento, telefone, cep, endereco) VALUES ("Evandro de Almeida", "41143676830", "123456789012345", '1975-10-12', "11911007252", "06767230", "Mario Latorre 245");

INSERT INTO prontuario (paciente_id, alergias, tipo_sanguineo, medicamentos, cirurgias, doencas_infecciosas) VALUES (1, "Penicilina, intolerância a lactose ", "O-", "", "Transplante de rim", "Tuberculose");

INSERT INTO produtos (nome, valor, quantidade, embalagem, unidade_medida, temperatura)
VALUES 
  ('Paracetamol', 10.50, 100, 'Caixa com 20 comprimidos', 'mg', 'PERECIVEL'),
  ('Ibuprofeno', 15.75, 200, 'Frasco com gotas', 'ml', 'RESFRIADO'),
  ('Amoxicilina', 5.00, 150, 'Ampola', 'ml', 'TERMOSSENSIVEL');
INSERT INTO produto_estoque (id_produto, quantidade, validade)
VALUES 
(1, 50, '2025-07-10'),
(1, 30, '2026-01-15'),
(1, 20, '2026-02-01');
INSERT INTO produto_estoque (id_produto, quantidade, validade)
VALUES 
  (2, 70, '2025-11-30'),
  (2, 50, '2025-12-15'),
  (2, 80, '2026-03-01');
INSERT INTO produto_estoque (id_produto, quantidade, validade)
VALUES 
  (3, 40, '2026-05-01'),
  (3, 60, '2026-06-15'),
  (3, 30, '2026-07-01');


DELIMITER //
CREATE EVENT trg_validade_proxima
ON SCHEDULE
	EVERY 1 second
    COMMENT 'Verificação de validade'
    DO UPDATE estoque_produto SET vencimento_proximo = "Sim"
    WHERE validade <= DATE_ADD(CURDATE(), INTERVAL 60 DAY);
//
DELIMITER ;


select * from perfis;
select * from usuarios;
select * from pacientes;
select * from medicos;
select* from escala;
select * from agendamentos;
select * from consultas;
select * from prontuario;
select * from produto_estoque;

drop database medflow;