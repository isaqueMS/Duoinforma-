# 🛡️ Duoinforma - Central Cybernética de Capacitação e Verificação de Segurança

<p align="center">
  <img src="screenshots/capa.png" alt="Capa do Duoinforma" width="100%" />
</p>

O **Duoinforma** é um ecossistema mobile de alta fidelidade desenvolvido em **React Native com Expo (v54.0.0)** e **Firebase Auth/Firestore**. Inspirado em jogos cibernéticos e estéticas de ficção científica (Cyberpunk/Glassmorphism/Neon Dark Mode), o aplicativo tem o propósito de capacitar cidadãos comuns contra as maiores ameaças digitais do século XXI: engenharia social, phishing, desinformação (Fake News), deepfakes de voz/vídeo e golpes financeiros.

---

## 📸 Demonstração Visual (Screenshots)

Aqui estão as telas principais do aplicativo rodando em alta fidelidade:

| Tela Inicial (Emulador) | Perfil do Agente |
| :---: | :---: |
| ![Tela Inicial](screenshots/tela_inicio_emulador.png) | ![Perfil do Agente](screenshots/perfil_agente.png) |

---

## 🚀 Funcionalidades Principais

* **👾 Central de Treinamentos (Fake vs. Real)**: Esteira iterativa baseada em posts simulados de redes sociais e canais de comunicação com diagnósticos pedagógicos detalhados sobre as características de desinformação.
* **📋 Central de Exames e Certificações**: 3 níveis de exames integrados (Fácil, Médio e Difícil) com notas de corte restritas (70% de acerto mínimo) para desbloqueio hierárquico de novas credenciais e patentes de agente.
* **📡 Scanner de Links e Heurística NLP**: Validador inteligente de links e textos que calcula um índice percentual de confiança a partir de um motor de heurísticas locais (verificação de SSL/HTTPS, domínios clones suspeitos, termos alarmistas e grifos excessivos).
* **⚡ Perfil do Agente e Ladder de XP**: Sincronização persistente de pontos de experiência, idade, localização, medalhas de conquistas desbloqueadas e posicionamento em tempo real no Ranking Global de Defesa.
* **🔑 Sistema Híbrido de Google Sign-In**: Login integrado ao Google via Firebase Auth e suporte a uma janela simulada de alta fidelidade para testes instantâneos em emuladores sem necessidade de chaves configuradas.

---

## 🛠️ Especificação da Stack & Bibliotecas (`package.json`)

Para construir uma aplicação resiliente, leve e fluida, utilizamos as seguintes bibliotecas oficiais homologadas para o Expo SDK 54:

| Biblioteca | Versão | Função Principal no Ecossistema |
| :--- | :--- | :--- |
| **`expo`** | `~54.0.33` | Framework principal de desenvolvimento universal e compilação nativa. |
| **`react-native`** | `0.81.5` | Engine fundamental de renderização de componentes nativos para Android e iOS. |
| **`firebase`** | `^12.13.0` | Integração com o ecossistema Google Firebase para sincronizar dados em tempo real no Firestore e gerenciar credenciais. |
| **`@react-native-google-signin/google-signin`** | `^16.1.2` | Autenticação Single Sign-On (SSO) oficial e nativa com contas Google. |
| **`expo-blur`** | `~15.0.8` | Efeito premium de desfoque translúcido (`BlurView`) utilizado no design dos cards de vidro (**Glassmorphism**). |
| **`expo-linear-gradient`** | `~15.0.8` | Gradientes lineares de neon que criam o plano de fundo cibernético degradê característico. |
| **`@react-native-async-storage/async-storage`** | `2.2.0` | Banco de dados chave-valor offline que garante resiliência e persistência rápida de cache dos estados de jogo e logins simulados. |
| **`@react-navigation/native`** & **`native-stack`** | `^7.x` | Mecanismo de empilhamento de telas nativas para transições fluidas de fluxos (Login -> Home). |
| **`@react-navigation/bottom-tabs`** | `^7.x` | Menu de navegação inferior por abas cibernéticas (Home, Verificação, Treinamento, Exames, Perfil). |
| **`react-native-reanimated`** | `~4.1.1` | Motor de física e animações fluidas a 60fps para efeitos de transição e escalonamento neon. |

---

## 💻 Instruções para Instalação e Execução

Para rodar o projeto localmente em sua máquina, siga os passos detalhados abaixo.

### 1. Pré-requisitos
Certifique-se de possuir instalado em sua máquina de desenvolvimento:
* **Node.js** (versão LTS 20 ou superior recomendado).
* **Git** instalado no computador.
* **Expo Go** instalado no seu celular físico (Android ou iOS) se desejar rodar no celular físico.
* **Android Studio** (com emulador Android configurado) ou **Xcode** (para emuladores iOS em macOS) se preferir testar em ambiente simulado.

### 2. Clonagem e Instalação de Dependências
Abra seu terminal favorito (Prompt de Comando, PowerShell ou Terminal Bash) e execute a sequência abaixo:

```bash
# Clone o repositório oficial
git clone https://github.com/isaqueMS/Duoinforma-.git

# Navegue para o diretório raiz do projeto
cd Duoinforma

# Instale os pacotes e dependências oficiais configuradas
npm install
```

### 3. Executando o Projeto no Expo Go
Para iniciar o servidor bundler do Expo para desenvolvimento local:

```bash
# Inicializa o Expo CLI
npx expo start
```

* **Celular Físico**: Escaneie o **QR Code** impresso no terminal com a câmera do seu smartphone (iOS) ou com o aplicativo **Expo Go** (Android). Certifique-se de que o computador e o celular estão conectados exatamente à **mesma rede Wi-Fi**.
* **Emulador Android**: Pressione a tecla `a` no terminal para disparar a abertura automática no dispositivo virtual ativo.
* **Simulador iOS** (apenas macOS): Pressione a tecla `i` no terminal.
* **Navegador Web**: Pressione a tecla `w` para testar a responsividade do layout em aba do navegador.

---

## 📱 Compilando a Versão Nativa (Geração de APK / Android Studio)

O projeto está totalmente configurado para geração nativa com suporte ao **Expo Prebuild**. 

### Execução de Builds Locais pelo Android Studio
Caso queira gerar e testar as estruturas nativas locais compiladas via Android Studio no Windows:

```powershell
# Cria as pastas nativas 'android' e 'ios' baseando-se no app.json
npx expo prebuild

# Compila e roda a versão diretamente no emulador do Android Studio conectado
npm run android
```

---

## 🛡️ O Sistema Híbrido de Login (Google Sign-In)

Se o aplicativo rodar em um emulador comum de computador ou o Firebase estiver offline, o sistema detecta a ausência de chaves de serviço do Google e ativa o **Modo Simulador de Desenvolvedor**.

### Como funciona:
1. Ao clicar em **"Entrar com o Google"**, se o emulador nativo barrar a conexão pela falta de chaves SHA configuradas, o app exibe uma janela cibernética de alta fidelidade simulando a tela de contas Google.
2. Ao digitar seu e-mail real do Google (ex: `agente.cyber@gmail.com`), o sistema gera uma **senha criptografada determinística baseada no e-mail**.
3. O app realiza o login real ou cadastra uma conta real no console de usuários do Firebase sob o capô!
4. **Isso permite testar todo o ecossistema do Firestore na nuvem em tempo real de forma totalmente gratuita e offline imediata**!

---

## 🔒 Licença e Autor

Este projeto foi projetado como um produto de software de alto impacto e gamificação de segurança cibernética corporativa e pessoal.

**Desenvolvido por:** Isaque M. S. (isaqueMS)
**Repositorio Oficial:** [https://github.com/isaqueMS/Duoinforma-.git](https://github.com/isaqueMS/Duoinforma-.git)

*Proteger a integridade da sua identidade digital é o primeiro passo para garantir a resiliência ciberespacial!* 🛡️
