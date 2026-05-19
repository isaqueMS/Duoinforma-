/**
 * BASE DE DADOS DE SIMULAÇÕES E TREINAMENTOS CIBERNÉTICOS (trainingData)
 * 
 * Este arquivo fornece o conjunto de dados estáticos para alimentar a esteira de posts da tela de treinamentos (TrainingScreen).
 * Cada objeto define um post de rede social simulado que pode ser real ou falso (Fake News), contendo as seguintes propriedades:
 * 
 * @property {string} id - Identificador de string única do post (ex: 't1', 't2').
 * @property {string} type - Tipo de layout do post ('social' | 'news' | 'image').
 * @property {string} title - Título curto contextual do local de publicação.
 * @property {string} content - Texto completo contido na publicação simulada.
 * @property {string} author - Nome de usuário fictício do autor do post.
 * @property {string} timestamp - Timestamp amigável ou tempo decorrido da publicação.
 * @property {string} [likes] - Quantidade aproximada de curtidas (opcional).
 * @property {string} [shares] - Quantidade aproximada de compartilhamentos (opcional).
 * @property {boolean} isReal - Booleano crucial definindo se a notícia/post é real (true) ou fake (false).
 * @property {string} category - Classificação temática da ameaça (ex: 'Saúde / Pseudo-ciência').
 * @property {string} explanation - Texto pedagógico completo detalhando por que o post é real ou falso.
 * @property {string[]} tips - Array contendo exatamente 3 dicas/diretrizes de segurança para ajudar o usuário.
 */
export const trainingData = [
  {
    id: 't1',
    type: 'social',
    title: 'Post urgente no X (antigo Twitter)',
    content: '🚨 ATENÇÃO! Cientistas confirmam que a água da chuva agora contém microchips ativados por antenas 5G para controlar batimentos cardíacos. NÃO BEBA ÁGUA DA CHUVA! Compartilhe antes que apaguem!',
    author: 'PatriotaLivre99',
    timestamp: 'Há 2 horas',
    likes: '12.4K',
    shares: '8.9K',
    isReal: false,
    category: 'Fake News Conspiracionista',
    explanation: 'Este post exibe vários sinais clássicos de desinformação: tom alarmista (🚨, caixa alta), pedido explícito de compartilhamento ("Compartilhe antes que apaguem!"), teorias de conspiração sem fontes científicas reais e uso de jargões técnicos misturados de forma incorreta (5G + microchips na água).',
    tips: [
      'Desconfie de alertas urgentes que usam muitos emojis e CAIXA ALTA.',
      'Procure por fontes científicas renomadas ou órgãos oficiais de saúde.',
      'Busque em sites de checagem (como Lupa, Aos Fatos ou G1 Fato ou Fake).'
    ]
  },
  {
    id: 't2',
    type: 'news',
    title: 'Portal de Notícias de Tecnologia',
    content: 'Cientistas desenvolvem bateria ecológica feita de silício e resíduos de madeira que carrega em 5 minutos e dura até 3 vezes mais que as de lítio tradicionais. O projeto foi publicado na revista Nature Energy.',
    author: 'TechFuture Digital',
    timestamp: '18 de Maio de 2026',
    isReal: true,
    category: 'Ciência e Inovação',
    explanation: 'A notícia é confiável: descreve um avanço científico específico, cita uma fonte científica renomada e revisada por pares ("revista Nature Energy") e mantém um tom informativo, objetivo e realista, sem apelos emocionais ou alarmistas.',
    tips: [
      'Verifique se a notícia menciona revistas científicas ou universidades de prestígio.',
      'Cheque se outros portais de notícias sérios também cobriram o assunto.',
      'Evite compartilhar apenas pelo título apelativo.'
    ]
  },
  {
    id: 't3',
    type: 'news',
    title: 'Manchete de Portal Desconhecido',
    content: '⚠️ URGENTE: Nova lei secreta aprovada na calada da noite confisca toda a poupança dos brasileiros a partir da próxima segunda-feira! O presidente assinou o decreto em sigilo absoluto.',
    author: 'FolhaDaNacao24h',
    timestamp: 'Há 12 minutos',
    isReal: false,
    category: 'Golpe Financeiro / Pânico',
    explanation: 'A ideia de uma "lei secreta" ou "decreto em sigilo absoluto" aprovado para confiscar poupança é um mito que visa gerar pânico financeiro. No Brasil, a Constituição de 1988 proíbe expressamente o confisco de poupança ou ativos financeiros por medida provisória.',
    tips: [
      'A legislação brasileira é pública; não existem "leis secretas" ou decretos secretos de confisco.',
      'Grandes mudanças econômicas são sempre amplamente divulgadas na mídia oficial e jornais financeiros sérios.',
      'Cuidado com links suspeitos que prometem "proteger seu dinheiro" com vírus ou golpes.'
    ]
  },
  {
    id: 't4',
    type: 'social',
    title: 'Mensagem encaminhada no WhatsApp',
    content: '⚠️ Repassando da diretoria do Hospital das Clínicas: Novo vírus modificado geneticamente está se espalhando pelo ar condicionado dos shoppings. Já são 1.500 internados em estado grave. Tomem chá de casca de limão morno com bicarbonato para neutralizar o vírus imediatamente!! repassando rápido!! ⚠️',
    author: 'Encaminhado com frequência',
    timestamp: 'Várias vezes',
    isReal: false,
    category: 'Saúde / Pseudo-ciência',
    explanation: 'Mensagens com a tag "Encaminhado com frequência", sem link, atribuídas a uma autoridade genérica ("diretoria do hospital") e que prescrevem curas milagrosas caseiras simples (chá com bicarbonato) para problemas gravíssimos são quase sempre falsas e perigosas.',
    tips: [
      'Organizações de saúde sérias nunca usam correntes de WhatsApp para fazer comunicados oficiais.',
      'Curas simples demais (chás, receitas caseiras) para doenças graves devem ser tratadas com extrema desconfiança.',
      'Pesquise as palavras-chave da mensagem no Google junto com a palavra "boato".'
    ]
  },
  {
    id: 't5',
    type: 'image',
    title: 'Post de Rede Social com Foto',
    content: 'Olha que absurdo! Foto mostra o céu de Paris completamente roxo brilhante após instalação de novos super transmissores de radiação cósmica controlados pelo governo local para monitoramento populacional.',
    author: 'CeuRevelado_Cyber',
    timestamp: 'Ontem',
    isReal: false,
    category: 'Imagem Manipulada / Teoria',
    explanation: 'Este é um caso de imagem editada digitalmente (ou gerada por IA) acompanhada de uma explicação conspiracionista. Mudanças extremas na cor do céu de cidades inteiras seriam registradas por milhares de moradores reais e veículos de imprensa locais de forma factual.',
    tips: [
      'Use a pesquisa reversa de imagens do Google ou TinEye para achar a foto original.',
      'Analise a iluminação e as sombras da imagem para ver se parecem artificiais.',
      'Considere se um evento dessa magnitude física passaria despercebido pelo jornalismo local.'
    ]
  },
  {
    id: 't6',
    type: 'news',
    title: 'Portal de Economia e Negócios',
    content: 'Banco Central do Brasil anuncia o lançamento oficial da sua nova moeda digital soberana, o Drex, focada em transações interbancárias e contratos inteligentes automáticos. Testes iniciam no segundo semestre.',
    author: 'Valor & Futuro',
    timestamp: 'Há 3 dias',
    isReal: true,
    category: 'Economia Real',
    explanation: 'Notícia verdadeira e confirmada. O Banco Central do Brasil realmente está desenvolvendo o Drex (Real Digital). A notícia traz dados concretos (segundo semestre, transações interbancárias) sem adjetivos sensacionalistas.',
    tips: [
      'Verifique o site oficial do Banco Central (bcb.gov.br) para confirmar anúncios institucionais.',
      'Compare com outros veículos especializados de economia e finanças.'
    ]
  }
];
