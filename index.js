// Importação do utilitário de registro do componente raiz do Expo.
// Esse utilitário configura o framework React Native para inicializar o app corretamente no mobile e na web.
import { registerRootComponent } from 'expo';

// Importação do componente App que engloba nossos provedores globais e estruturas de navegação
import App from './App';

// registerRootComponent chama por baixo dos panos o AppRegistry.registerComponent('main', () => App);
// Ele também garante que, quer o app seja executado no Expo Go, em uma build nativa (APK/iOS) ou na Web,
// o ambiente de execução seja configurado e executado adequadamente.
registerRootComponent(App);
