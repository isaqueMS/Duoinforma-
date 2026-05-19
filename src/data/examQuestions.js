/**
 * BASE DE DADOS DE QUESTÕES DOS EXAMES DE CERTIFICAÇÃO (EXAM_QUESTIONS)
 * 
 * Este arquivo define o conjunto estático de perguntas estruturadas utilizadas pela tela de exames (ExamScreen).
 * Cada objeto dentro do array representa uma questão de cibersegurança e segue o seguinte schema de dados:
 * 
 * @property {number} id - Identificador numérico único sequencial da questão.
 * @property {string} difficulty - Nível do exame correspondente ('facil' | 'medio' | 'dificil').
 * @property {string} question - Enunciado detalhado descrevendo um cenário ou conceito de segurança.
 * @property {string[]} options - Array contendo exatamente 4 alternativas textuais de resposta.
 * @property {number} correctIndex - Índice numérico (0 a 3) correspondente à alternativa correta no array de opções.
 */
export const EXAM_QUESTIONS = [
  // ==========================================
  // NÍVEL FÁCIL (1 - 15)
  // ==========================================
  {
    id: 1,
    difficulty: 'facil',
    question: 'Você recebe um e-mail dizendo que sua conta bancária será bloqueada imediatamente caso não clique em um link. O que fazer?',
    options: [
      'Clicar rapidamente no link',
      'Ignorar sinais suspeitos',
      'Verificar o remetente e acessar o banco pelo site oficial',
      'Responder com sua senha'
    ],
    correctIndex: 2
  },
  {
    id: 2,
    difficulty: 'facil',
    question: 'Qual destes é um sinal comum de phishing?',
    options: [
      'Texto sem erros',
      'Link suspeito e urgente',
      'Site oficial HTTPS conhecido',
      'E-mail esperado'
    ],
    correctIndex: 1
  },
  {
    id: 3,
    difficulty: 'facil',
    question: 'Um site pede sua senha do Instagram para “ganhar seguidores grátis”. Isso é:',
    options: [
      'Seguro',
      'Promoção oficial',
      'Suspeito e perigoso',
      'Obrigatório'
    ],
    correctIndex: 2
  },
  {
    id: 4,
    difficulty: 'facil',
    question: 'O que significa HTTPS em um site?',
    options: [
      'Site hackeado',
      'Conexão segura',
      'Site lento',
      'Site antigo'
    ],
    correctIndex: 1
  },
  {
    id: 5,
    difficulty: 'facil',
    question: 'Você recebeu um arquivo “boleto.pdf.exe”. Isso indica:',
    options: [
      'Arquivo seguro',
      'Imagem',
      'Possível malware',
      'Documento oficial'
    ],
    correctIndex: 2
  },
  {
    id: 6,
    difficulty: 'facil',
    question: 'Qual senha é mais segura?',
    options: [
      '123456',
      'senha123',
      'joao2025',
      'T7@kL9#pQ2'
    ],
    correctIndex: 3
  },
  {
    id: 7,
    difficulty: 'facil',
    question: 'O que fazer ao receber mensagem de número desconhecido pedindo PIX urgente?',
    options: [
      'Enviar imediatamente',
      'Confirmar com a pessoa por outro meio',
      'Compartilhar com amigos',
      'Ignorar verificação'
    ],
    correctIndex: 1
  },
  {
    id: 8,
    difficulty: 'facil',
    question: 'Redes Wi-Fi públicas podem ser:',
    options: [
      'Sempre seguras',
      'Mais vulneráveis a ataques',
      'Impossíveis de invadir',
      'Mais rápidas e protegidas'
    ],
    correctIndex: 1
  },
  {
    id: 9,
    difficulty: 'facil',
    question: 'Qual destas práticas aumenta sua segurança online?',
    options: [
      'Reutilizar a mesma senha',
      'Compartilhar códigos',
      'Ativar autenticação em dois fatores',
      'Desativar atualizações'
    ],
    correctIndex: 2
  },
  {
    id: 10,
    difficulty: 'facil',
    question: 'Um pop-up dizendo “Seu celular foi infectado!” geralmente é:',
    options: [
      'Aviso oficial',
      'Tentativa de golpe',
      'Atualização do sistema',
      'Antivírus real'
    ],
    correctIndex: 1
  },
  {
    id: 11,
    difficulty: 'facil',
    question: 'O que é phishing?',
    options: [
      'Tipo de antivírus',
      'Tentativa de roubo de dados',
      'Rede social',
      'Atualização de software'
    ],
    correctIndex: 1
  },
  {
    id: 12,
    difficulty: 'facil',
    question: 'Qual destes links parece mais confiável?',
    options: [
      'banc0-seguro-login.xyz',
      'bancooficial.com.br',
      'login-banco-free.ru',
      'seguranca-premio.net'
    ],
    correctIndex: 1
  },
  {
    id: 13,
    difficulty: 'facil',
    question: 'Por que atualizar aplicativos é importante?',
    options: [
      'Apenas mudar visual',
      'Corrigir falhas de segurança',
      'Gastar internet',
      'Reduzir proteção'
    ],
    correctIndex: 1
  },
  {
    id: 14,
    difficulty: 'facil',
    question: 'Você deve compartilhar sua senha com amigos?',
    options: [
      'Sim',
      'Apenas uma vez',
      'Nunca',
      'Só em jogos'
    ],
    correctIndex: 2
  },
  {
    id: 15,
    difficulty: 'facil',
    question: 'O que fazer ao encontrar um pendrive desconhecido?',
    options: [
      'Conectar imediatamente',
      'Formatar sem verificar',
      'Evitar usar e reportar',
      'Compartilhar arquivos'
    ],
    correctIndex: 2
  },

  // ==========================================
  // NÍVEL MÉDIO (16 - 35)
  // ==========================================
  {
    id: 16,
    difficulty: 'medio',
    question: 'Um e-mail possui logotipo oficial, mas o endereço do remetente é estranho. O que isso pode indicar?',
    options: [
      'Segurança total',
      'Phishing sofisticado',
      'Atualização legítima',
      'Erro sem importância'
    ],
    correctIndex: 1
  },
  {
    id: 17,
    difficulty: 'medio',
    question: 'Qual prática reduz riscos em redes sociais?',
    options: [
      'Perfil totalmente público',
      'Compartilhar localização em tempo real',
      'Revisar configurações de privacidade',
      'Aceitar qualquer solicitação'
    ],
    correctIndex: 2
  },
  {
    id: 18,
    difficulty: 'medio',
    question: 'Você recebe QR Code para pagamento inesperado. O ideal é:',
    options: [
      'Pagar imediatamente',
      'Verificar origem e valor',
      'Compartilhar o código',
      'Escanear sem analisar'
    ],
    correctIndex: 1
  },
  {
    id: 19,
    difficulty: 'medio',
    question: 'O que é engenharia social?',
    options: [
      'Tipo de hardware',
      'Técnica de manipulação psicológica',
      'Programa antivírus',
      'Linguagem de programação'
    ],
    correctIndex: 1
  },
  {
    id: 20,
    difficulty: 'medio',
    question: 'Um site com muitos anúncios e downloads automáticos pode indicar:',
    options: [
      'Site seguro',
      'Site suspeito',
      'Site governamental',
      'Loja oficial'
    ],
    correctIndex: 1
  },
  {
    id: 21,
    difficulty: 'medio',
    question: 'Qual destas ações ajuda a proteger contas online?',
    options: [
      'Desativar verificação em duas etapas',
      'Usar senhas curtas',
      'Utilizar gerenciador de senhas',
      'Compartilhar códigos SMS'
    ],
    correctIndex: 2
  },
  {
    id: 22,
    difficulty: 'medio',
    question: 'O que é ransomware?',
    options: [
      'Rede social falsa',
      'Malware que sequestra arquivos',
      'Antivírus gratuito',
      'Sistema operacional'
    ],
    correctIndex: 1
  },
  {
    id: 23,
    difficulty: 'medio',
    question: 'Por que links encurtados podem ser perigosos?',
    options: [
      'Sempre são vírus',
      'Escondem o destino real',
      'Não funcionam',
      'São proibidos'
    ],
    correctIndex: 1
  },
  {
    id: 24,
    difficulty: 'medio',
    question: 'Você recebeu um “comprovante bancário” via WhatsApp. Qual atitude correta?',
    options: [
      'Confiar automaticamente',
      'Verificar diretamente no banco',
      'Encaminhar para todos',
      'Baixar qualquer arquivo'
    ],
    correctIndex: 1
  },
  {
    id: 25,
    difficulty: 'medio',
    question: 'O que significa autenticação em dois fatores?',
    options: [
      'Duas senhas iguais',
      'Login usando confirmação extra',
      'Compartilhar acesso',
      'Duas contas diferentes'
    ],
    correctIndex: 1
  },
  {
    id: 26,
    difficulty: 'medio',
    question: 'Qual comportamento indica possível golpe?',
    options: [
      'Promoção exageradamente vantajosa',
      'Site conhecido',
      'Empresa verificada',
      'Domínio oficial'
    ],
    correctIndex: 0
  },
  {
    id: 27,
    difficulty: 'medio',
    question: 'Um aplicativo pede acesso desnecessário à câmera e contatos. Isso é:',
    options: [
      'Normal sempre',
      'Possível risco à privacidade',
      'Atualização obrigatória',
      'Recurso visual'
    ],
    correctIndex: 1
  },
  {
    id: 28,
    difficulty: 'medio',
    question: 'O que fazer antes de baixar arquivos?',
    options: [
      'Ignorar origem',
      'Verificar fonte e reputação',
      'Desativar antivírus',
      'Compartilhar automaticamente'
    ],
    correctIndex: 1
  },
  {
    id: 29,
    difficulty: 'medio',
    question: 'O que é spoofing?',
    options: [
      'Atualização do navegador',
      'Falsificação de identidade digital',
      'Backup automático',
      'Criptografia oficial'
    ],
    correctIndex: 1
  },
  {
    id: 30,
    difficulty: 'medio',
    question: 'Qual é o risco de usar softwares piratas?',
    options: [
      'Melhor desempenho',
      'Mais segurança',
      'Possível presença de malware',
      'Atualizações garantidas'
    ],
    correctIndex: 2
  },
  {
    id: 31,
    difficulty: 'medio',
    question: 'O que deve levantar suspeita em um e-mail?',
    options: [
      'Domínio estranho',
      'Erros gramaticais',
      'Urgência exagerada',
      'Todas as anteriores'
    ],
    correctIndex: 3
  },
  {
    id: 32,
    difficulty: 'medio',
    question: 'Qual destas atitudes é mais segura?',
    options: [
      'Salvar senha no bloco de notas',
      'Usar autenticação biométrica',
      'Compartilhar login',
      'Desativar bloqueio de tela'
    ],
    correctIndex: 1
  },
  {
    id: 33,
    difficulty: 'medio',
    question: 'O que é malware?',
    options: [
      'Programa malicioso',
      'Rede social',
      'Aplicativo oficial',
      'Sistema de segurança'
    ],
    correctIndex: 0
  },
  {
    id: 34,
    difficulty: 'medio',
    question: 'Sites falsos geralmente tentam:',
    options: [
      'Informar usuários',
      'Roubar dados pessoais',
      'Melhorar segurança',
      'Atualizar dispositivos'
    ],
    correctIndex: 1
  },
  {
    id: 35,
    difficulty: 'medio',
    question: 'Qual destas opções é mais segura para downloads?',
    options: [
      'Sites desconhecidos',
      'Links enviados aleatoriamente',
      'Lojas oficiais',
      'Torrents suspeitos'
    ],
    correctIndex: 2
  },

  // ==========================================
  // NÍVEL DIFÍCIL (36 - 50)
  // ==========================================
  {
    id: 36,
    difficulty: 'dificil',
    question: 'Um atacante cria página idêntica à de um banco para capturar logins. Esse ataque é:',
    options: [
      'DDoS',
      'Phishing',
      'Criptografia',
      'Backup'
    ],
    correctIndex: 1
  },
  {
    id: 37,
    difficulty: 'dificil',
    question: 'Qual o principal objetivo da engenharia social?',
    options: [
      'Melhorar sistemas',
      'Manipular pessoas para obter acesso',
      'Corrigir falhas',
      'Aumentar velocidade da rede'
    ],
    correctIndex: 1
  },
  {
    id: 38,
    difficulty: 'dificil',
    question: 'O que caracteriza um ataque de spear phishing?',
    options: [
      'Ataque genérico',
      'Ataque direcionado e personalizado',
      'Ataque físico',
      'Atualização falsa simples'
    ],
    correctIndex: 1
  },
  {
    id: 39,
    difficulty: 'dificil',
    question: 'O que é um ataque Man-in-the-Middle?',
    options: [
      'Roubo físico',
      'Interceptação de comunicação',
      'Atualização de roteador',
      'Tipo de antivírus'
    ],
    correctIndex: 1
  },
  {
    id: 40,
    difficulty: 'dificil',
    question: 'Qual prática reduz riscos em Wi-Fi público?',
    options: [
      'Usar VPN',
      'Compartilhar arquivos',
      'Desativar senha',
      'Acessar banco sem proteção'
    ],
    correctIndex: 0
  },
  {
    id: 41,
    difficulty: 'dificil',
    question: 'O que pode indicar site clonado?',
    options: [
      'URL alterada levemente',
      'Certificado inválido',
      'Layout copiado',
      'Todas as anteriores'
    ],
    correctIndex: 3
  },
  {
    id: 42,
    difficulty: 'dificil',
    question: 'Por que ataques usando IA estão crescendo?',
    options: [
      'Mensagens falsas mais convincentes',
      'Menor capacidade tecnológica',
      'Menos automação',
      'Menos dados disponíveis'
    ],
    correctIndex: 0
  },
  {
    id: 43,
    difficulty: 'dificil',
    question: 'O que é vazamento de dados?',
    options: [
      'Atualização automática',
      'Exposição indevida de informações',
      'Criação de backup',
      'Compactação de arquivos'
    ],
    correctIndex: 1
  },
  {
    id: 44,
    difficulty: 'dificil',
    question: 'O que fazer após suspeita de invasão?',
    options: [
      'Ignorar',
      'Trocar senhas e revisar acessos',
      'Compartilhar login novamente',
      'Desativar proteção'
    ],
    correctIndex: 1
  },
  {
    id: 45,
    difficulty: 'dificil',
    question: 'Um arquivo .zip protegido por senha enviado inesperadamente pode indicar:',
    options: [
      'Documento comum',
      'Tentativa de ocultar malware',
      'Foto compactada segura',
      'Backup automático'
    ],
    correctIndex: 1
  },
  {
    id: 46,
    difficulty: 'dificil',
    question: 'O que é credential stuffing?',
    options: [
      'Roubo físico de computador',
      'Uso automático de senhas vazadas',
      'Atualização de navegador',
      'Backup em nuvem'
    ],
    correctIndex: 1
  },
  {
    id: 47,
    difficulty: 'dificil',
    question: 'Qual destas atitudes é mais segura em empresas?',
    options: [
      'Compartilhar credenciais',
      'Usar princípio do menor privilégio',
      'Desativar logs',
      'Ignorar políticas internas'
    ],
    correctIndex: 1
  },
  {
    id: 48,
    difficulty: 'dificil',
    question: 'O que é deepfake?',
    options: [
      'Tipo de firewall',
      'Conteúdo manipulado com IA',
      'Sistema operacional',
      'Rede criptografada'
    ],
    correctIndex: 1
  },
  {
    id: 49,
    difficulty: 'dificil',
    question: 'Por que verificar URLs é importante?',
    options: [
      'Identificar domínios falsos',
      'Melhor internet',
      'Reduzir bateria',
      'Aumentar velocidade'
    ],
    correctIndex: 0
  },
  {
    id: 50,
    difficulty: 'dificil',
    question: 'Qual é uma característica comum de golpes digitais modernos?',
    options: [
      'Falta de urgência',
      'Comunicação extremamente profissional e manipulativa',
      'Total transparência',
      'Ausência de links'
    ],
    correctIndex: 1
  }
];
