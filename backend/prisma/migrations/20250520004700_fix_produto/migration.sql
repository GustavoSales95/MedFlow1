/*
  Warnings:

  - You are about to drop the column `data_validade` on the `estoque_produto` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `estoque_produto` table. All the data in the column will be lost.
  - You are about to drop the column `fabricante` on the `estoque_produto` table. All the data in the column will be lost.
  - You are about to drop the column `lote` on the `estoque_produto` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `estoque_produto` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `estoque_produto` table. All the data in the column will be lost.
  - Added the required column `data_pedido` to the `Estoque_produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `embalagem` to the `Estoque_produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fornecedor` to the `Estoque_produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperatura` to the `Estoque_produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidade_medida` to the `Estoque_produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `validade` to the `Estoque_produto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `Estoque_produto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `estoque_produto` DROP COLUMN `data_validade`,
    DROP COLUMN `descricao`,
    DROP COLUMN `fabricante`,
    DROP COLUMN `lote`,
    DROP COLUMN `quantidade`,
    DROP COLUMN `tipo`,
    ADD COLUMN `data_pedido` DATETIME(3) NOT NULL,
    ADD COLUMN `embalagem` VARCHAR(191) NOT NULL,
    ADD COLUMN `fornecedor` VARCHAR(191) NOT NULL,
    ADD COLUMN `temperatura` ENUM('PERECIVEL', 'RESFRIADO', 'TERMOSSENSIVEL') NOT NULL,
    ADD COLUMN `unidade_medida` VARCHAR(191) NOT NULL,
    ADD COLUMN `validade` DATETIME(3) NOT NULL,
    ADD COLUMN `valor` DOUBLE NOT NULL;
