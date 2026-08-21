# Surgical Workflow Tracking System

Aplicação web desenvolvida para mapear gargalos operacionais e automatizar o fluxo burocrático de procedimentos cirúrgicos. 

O sistema atua na gestão lógica das etapas pré e pós-operatórias, garantindo que as solicitações sigam regras de transição estritas, eliminando falhas de comunicação e perda de documentos na passagem de plantão.

## 🏗 Arquitetura e Stack Tecnológica

* **Frontend/Framework:** SvelteKit (Reatividade focada em performance)
* **Backend-as-a-Service (BaaS):** Pocketbase (Bancos Relacionais via SQLite)
* **Mensageria e Notificações:** Amazon SES (Simple Email Service)
* **Hospedagem:** Vercel (Client-side)

## ⚙️ Principais Desafios e Decisões de Engenharia

### 1. Máquina de Estados e Auditoria de Transições
Para garantir a confiabilidade do processo médico, a aplicação foi arquitetada em torno de uma máquina de estados com regras condicionais rígidas (aprovação, pendência de documentos, cancelamentos, retrocessos). Cada transição gera um timestamp no banco de dados, criando uma trilha de auditoria (audit trail) que permite a extração de métricas precisas sobre onde os processos burocráticos estão travando.

### 2. Automação de Notificações e Anexos via AWS SES
Implementação de uma rotina automatizada de mensageria que, baseada nos gatilhos da máquina de estados, consolida os dados aprovados da cirurgia e dispara a documentação anexada diretamente aos médicos responsáveis, utilizando a infraestrutura da AWS.

### 3. Otimização de Recursos com Arquitetura BaaS
A escolha do Pocketbase como camada de backend permitiu delegar o controle de acesso (Auth) e as operações de I/O em banco relacional de forma pragmática e de baixo custo. Isso direcionou o tempo de engenharia para o desenvolvimento do core business: as regras condicionais de negócio e a interface reativa no SvelteKit.
