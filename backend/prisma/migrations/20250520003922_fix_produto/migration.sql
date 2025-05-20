-- CreateTable
CREATE TABLE `Perfis` (
    `id_perfis` INTEGER NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_perfis`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NOT NULL,
    `perfil_id` INTEGER NOT NULL,

    UNIQUE INDEX `Usuarios_email_key`(`email`),
    UNIQUE INDEX `Usuarios_cpf_key`(`cpf`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pacientes` (
    `id_paciente` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `data_nascimento` DATE NULL,
    `telefone` VARCHAR(191) NULL,
    `endereco` VARCHAR(191) NULL,

    UNIQUE INDEX `Pacientes_cpf_key`(`cpf`),
    PRIMARY KEY (`id_paciente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prontuario` (
    `paciente_id` INTEGER NOT NULL,
    `alergias` VARCHAR(191) NULL,
    `tipo_sanguineo` CHAR(3) NULL,
    `medicamentos` VARCHAR(191) NULL,
    `cirurgias` VARCHAR(191) NULL,
    `doencas_infecciosas` VARCHAR(191) NULL,

    UNIQUE INDEX `Prontuario_paciente_id_key`(`paciente_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Medicos` (
    `id_medico` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `crm` VARCHAR(191) NOT NULL,
    `especialidade` VARCHAR(191) NULL,

    UNIQUE INDEX `Medicos_usuario_id_key`(`usuario_id`),
    UNIQUE INDEX `Medicos_crm_key`(`crm`),
    PRIMARY KEY (`id_medico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agendamentos` (
    `id_agendamento` INTEGER NOT NULL AUTO_INCREMENT,
    `paciente_id` INTEGER NOT NULL,
    `medico_id` INTEGER NOT NULL,
    `data_hora` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'agendado',

    PRIMARY KEY (`id_agendamento`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Consultas` (
    `id_consulta` INTEGER NOT NULL AUTO_INCREMENT,
    `agendamento_id` INTEGER NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `receita` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,
    `data_consulta` DATETIME(3) NULL,

    UNIQUE INDEX `Consultas_agendamento_id_key`(`agendamento_id`),
    PRIMARY KEY (`id_consulta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fornecedor` (
    `id_fornecedor` INTEGER NOT NULL AUTO_INCREMENT,
    `cnpj` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NOT NULL,
    `endereco` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Fornecedor_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id_fornecedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estoque_produto` (
    `id_produto` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `data_validade` DATE NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `fabricante` VARCHAR(191) NOT NULL,
    `lote` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,

    PRIMARY KEY (`id_produto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nota_fiscal` (
    `id_nota_fiscal` INTEGER NOT NULL AUTO_INCREMENT,
    `id_fornecedor` INTEGER NOT NULL,
    `data_entrada` DATE NOT NULL,
    `numero_nota` VARCHAR(191) NOT NULL,
    `valor_nota` DECIMAL(10, 2) NOT NULL,
    `data_cadastro_nota` DATE NOT NULL,

    UNIQUE INDEX `Nota_fiscal_id_fornecedor_key`(`id_fornecedor`),
    PRIMARY KEY (`id_nota_fiscal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto_nota` (
    `id_produto_nota` INTEGER NOT NULL AUTO_INCREMENT,
    `id_nota_fiscal` INTEGER NOT NULL,
    `id_produto` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL,

    UNIQUE INDEX `Produto_nota_id_nota_fiscal_key`(`id_nota_fiscal`),
    UNIQUE INDEX `Produto_nota_id_produto_key`(`id_produto`),
    PRIMARY KEY (`id_produto_nota`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Usuarios` ADD CONSTRAINT `Usuarios_perfil_id_fkey` FOREIGN KEY (`perfil_id`) REFERENCES `Perfis`(`id_perfis`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Prontuario` ADD CONSTRAINT `Prontuario_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Pacientes`(`id_paciente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Medicos` ADD CONSTRAINT `Medicos_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamentos` ADD CONSTRAINT `Agendamentos_paciente_id_fkey` FOREIGN KEY (`paciente_id`) REFERENCES `Pacientes`(`id_paciente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agendamentos` ADD CONSTRAINT `Agendamentos_medico_id_fkey` FOREIGN KEY (`medico_id`) REFERENCES `Medicos`(`id_medico`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultas` ADD CONSTRAINT `Consultas_agendamento_id_fkey` FOREIGN KEY (`agendamento_id`) REFERENCES `Agendamentos`(`id_agendamento`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nota_fiscal` ADD CONSTRAINT `Nota_fiscal_id_fornecedor_fkey` FOREIGN KEY (`id_fornecedor`) REFERENCES `Fornecedor`(`id_fornecedor`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto_nota` ADD CONSTRAINT `Produto_nota_id_nota_fiscal_fkey` FOREIGN KEY (`id_nota_fiscal`) REFERENCES `Nota_fiscal`(`id_nota_fiscal`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Produto_nota` ADD CONSTRAINT `Produto_nota_id_produto_fkey` FOREIGN KEY (`id_produto`) REFERENCES `Estoque_produto`(`id_produto`) ON DELETE RESTRICT ON UPDATE CASCADE;
