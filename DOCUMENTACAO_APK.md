# 🛡️ Duoinforma — Manual de Documentação do APK (Versão de Produção)

Este documento contém a especificação técnica completa, arquitetura de tecnologias, resoluções de engenharia e o manual de instruções de uso para a versão de produção oficial do aplicativo **Duoinforma**.

---

## 🚀 1. Especificações Técnicas e Arquitetura

O **Duoinforma** é um simulador gamificado cyberpunk desenvolvido para treinar agentes na identificação e combate à desinformação digital. A arquitetura móvel nativa foi otimizada para máximo desempenho e segurança.

### Módulo Core e Frameworks
* **React Native (v0.76+) com Expo SDK 54 (Bare Workflow):** Permite a execução nativa de alto desempenho por meio do motor de renderização nativo e compiladores C++.
* **Motor Javascript Hermes:** Otimizado pela Meta/Facebook, o Hermes pré-compila o código Javascript em bytecode compacto durante o build, diminuindo drasticamente o tempo de inicialização (*Time to First Frame*) e reduzindo o consumo de memória RAM do celular.
* **Expo Linear Gradient:** Utilizado para criar gradientes dinâmicos e fluidos com renderização acelerada por GPU.
* **Ionicons (Vector Icons):** Fontes vetoriais integradas nativamente para garantir ícones cristalinos independente da resolução da tela.

### Serviços de Nuvem e Banco de Dados (Firebase Suite)
* **Firebase Auth (Google Sign-In):** Módulo de controle de acessos exclusivo em ambiente de produção.
  * **Google Sign-In Nativo:** Autenticação segura de nível empresarial via credenciais oficiais do Google, recuperando foto de perfil real e gerando tokens criptográficos protegidos contra interceptações.
* **Cloud Firestore Database:** Banco de dados NoSQL em tempo real.
  * Armazena o progresso de XP do agente, insígnias conquistadas, nível de treinamento e histórico de erros.
  * **Leaderboard Global:** Motor de consultas em tempo real que calcula e ordena o ranking global de agentes.
* **Módulo Offline Inteligente:** Se o celular estiver sem internet ou o Firebase estiver indisponível nas configurações, o aplicativo entra automaticamente no **Modo Offline Autônomo**, simulando todas as requisições via armazenamento seguro local (`AsyncStorage`) sem que o usuário perceba interrupções.

---

## 🎨 2. Engenharia e Correções Aplicadas

Durante o ciclo de desenvolvimento, aplicamos resoluções de engenharia de nível de produção para assegurar um produto de altíssimo padrão visual e estabilidade:

### 🛠️ Resolução do Logo Sumido no APK (Launcher Asset Collide)
* **Problema:** No Android nativo, a imagem `icon.png` é registrada nas pastas de recursos do sistema Gradle como ícone de launcher do aplicativo. Durante o build de release, o compilador AAPT2 do Android realiza compressões agressivas e cortes geométricos na imagem para adaptá-la às telas de início dos smartphones, quebrando as referências para a engine Javascript e gerando uma tela de login sem logo (em branco).
* **Solução:** Duplicamos o arquivo de imagem como `assets/logo.png`. Sendo um asset de usuário personalizado, ele passa intocado por todas as regras de crunching do Android Studio, sendo exibido de forma impecável no APK final.

### 📲 Correção de Invasão da Status Bar (Top Padding Fix)
* **Problema:** Em smartphones Android modernos (especificamente com notch ou câmeras frontais em formato de furo), o cabeçalho do app colidia ou ficava por trás do relógio, sinal de Wi-Fi e bateria do sistema operacional.
* **Solução:** Importamos a API nativa `StatusBar` no [Header.jsx](file:///c:/Users/035354135/Desktop/Duoinforma/src/components/Header.jsx) e calculamos a altura do cabeçalho de forma adaptativa no Android:
  ```javascript
  height: Platform.OS === 'android' ? 64 + (StatusBar.currentHeight || 24) : 64,
  paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0,
  ```
  Isso empurra o cabeçalho perfeitamente para baixo da barra de status, mantendo o design limpo e sem invasões.

---

## 📲 3. Manual de Uso e Instruções de Instalação (Para o Cliente)

Siga os passos abaixo para instalar, configurar e acessar o aplicativo:

### Passo 1: Download e Instalação
1. Transfira o arquivo de instalação **[app-release.apk](file:///c:/Users/035354135/Desktop/Duoinforma/android/app/build/outputs/apk/release/app-release.apk)** para o celular Android.
2. Abra o gerenciador de arquivos do celular, localize o arquivo e clique nele.
3. Se o celular exibir um aviso de "Instalar de fontes desconhecidas", clique em **Configurações** e ative a permissão para o seu navegador ou gerenciador de arquivos.
4. Conclua a instalação clicando em **Instalar**.

### Passo 2: Acesso ao Sistema (Portal Google)
Ao abrir o app, você será recebido por uma linda tela holográfica ciano de inicialização do sistema. 
1. Clique em **INICIAR SISTEMA** para abrir a central de login.
2. Você verá o portal premium de acesso em estilo cyberpunk focado exclusivamente no **Google Sign-In**.
3. Clique em **CONECTAR COM GOOGLE** para se autenticar com a sua conta Google com total segurança.
4. O aplicativo carregará seu codinome de agente e foto de perfil oficiais em tempo real para sincronização com o banco de dados.

### Passo 3: Exploração do Treinamento Definitivo
Por se tratar da versão de produção definitiva, o seu progresso não expira e não há limite de tempo! Você poderá:
* Verificar notícias reais ou falsas no **Scanner Digital** utilizando análise heurística automatizada.
* Responder perguntas e acumular XP na aba **Treinamento**.
* Ler dicas conceituais de segurança digital na **Enciclopédia**.
* Realizar exames oficiais para subir de nível e conseguir novas insígnias de prestígio no menu **Perfil**.
* Sincronizar dados instantaneamente com o **Leaderboard Global** e competir pela melhor pontuação do sistema contra outros agentes conectados.

---

## 🛠️ 4. Requisitos de Build e Desenvolvimento (Para Administradores)

Caso seja necessário compilar uma nova APK ou atualizar configurações de release do Android:

* **Comando para Compilar um Novo APK:**
  Abra o terminal do PowerShell na pasta `/android` do projeto e execute:
  ```powershell
  .\gradlew.bat assembleRelease
  ```
  A nova APK otimizada e de produção definitiva será gerada em `android/app/build/outputs/apk/release/app-release.apk`.
