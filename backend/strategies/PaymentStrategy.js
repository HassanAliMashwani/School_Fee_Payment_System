class PaymentStrategy {
    async processPayment(amount) {
      throw new Error("Method not implemented");
    }
  }
  
  class CreditCardStrategy extends PaymentStrategy {
    async processPayment(amount) {
      console.log(`Processing $${amount} via Credit Card`);
    }
  }
  
  class BankTransferStrategy extends PaymentStrategy {
    async processPayment(amount) {
      console.log(`Processing $${amount} via Bank Transfer`);
    }
  }
  
  module.exports = { CreditCardStrategy, BankTransferStrategy };