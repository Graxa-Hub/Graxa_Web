import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.subscribers = new Map();
  }

  connect(token) {
    if (this.isConnected) {
      console.log('WebSocket já está conectado');
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        // Criar socket com token
        const socket = new SockJS(`http://localhost:8080/ws/notificacoes?token=${token}`);
        
        this.client = new Client({
          webSocketFactory: () => socket,
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
          
          onConnect: (frame) => {
            console.log('✅ WebSocket conectado:', frame);
            this.isConnected = true;
            resolve();
          },
          
          onStompError: (frame) => {
            console.error('❌ Erro STOMP:', frame);
            this.isConnected = false;
            reject(new Error('Erro de conexão WebSocket'));
          },
          
          onWebSocketClose: () => {
            console.log('🔌 WebSocket desconectado');
            this.isConnected = false;
          },
          
          onDisconnect: () => {
            console.log('🔌 STOMP desconectado');
            this.isConnected = false;
          }
        });

        this.client.activate();
        
      } catch (error) {
        console.error('❌ Erro ao conectar WebSocket:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
      this.subscribers.clear();
      console.log('🔌 WebSocket desconectado manualmente');
    }
  }

  // Escutar notificações pessoais
  subscribeToNotifications(callback) {
    if (!this.isConnected || !this.client) {
      console.warn('WebSocket não está conectado');
      return;
    }

    const subscription = this.client.subscribe('/user/queue/notificacoes', (message) => {
      try {
        const notificacao = JSON.parse(message.body);
        console.log('🔔 Nova notificação recebida:', notificacao);
        callback(notificacao);
      } catch (error) {
        console.error('Erro ao processar notificação:', error);
      }
    });

    this.subscribers.set('notifications', subscription);
    return subscription;
  }

  // Escutar contador atualizado
  subscribeToCounter(callback) {
    if (!this.isConnected || !this.client) {
      console.warn('WebSocket não está conectado');
      return;
    }

    const subscription = this.client.subscribe('/user/queue/contador', (message) => {
      try {
        const dados = JSON.parse(message.body);
        console.log('📊 Contador atualizado:', dados);
        callback(dados.naoLidas);
      } catch (error) {
        console.error('Erro ao processar contador:', error);
      }
    });

    this.subscribers.set('counter', subscription);
    return subscription;
  }

  // Escutar broadcasts gerais
  subscribeToBroadcast(callback) {
    if (!this.isConnected || !this.client) {
      console.warn('WebSocket não está conectado');
      return;
    }

    const subscription = this.client.subscribe('/topic/broadcast', (message) => {
      try {
        const dados = JSON.parse(message.body);
        console.log('📢 Broadcast recebido:', dados);
        callback(dados);
      } catch (error) {
        console.error('Erro ao processar broadcast:', error);
      }
    });

    this.subscribers.set('broadcast', subscription);
    return subscription;
  }

  // Cancelar uma inscrição específica
  unsubscribe(type) {
    const subscription = this.subscribers.get(type);
    if (subscription) {
      subscription.unsubscribe();
      this.subscribers.delete(type);
    }
  }

  // Verificar se está conectado
  isWebSocketConnected() {
    return this.isConnected && this.client && this.client.connected;
  }
}

// Instância singleton
export const webSocketService = new WebSocketService();