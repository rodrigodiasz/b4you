module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      "products",
      [
        {
          name: "Produto 1",
          price: 10.99,
          description: "Descrição do Produto 1",
          stock: 50,
          category: "Eletrônicos",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Produto 2",
          price: 20.99,
          description: "Descrição do Produto 2",
          stock: 30,
          category: "Vestuário",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Produto 3",
          price: 30.99,
          description: "Descrição do Produto 3",
          stock: 15,
          category: "Casa e Jardim",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Produto 4",
          price: 40.99,
          description: "Descrição do Produto 4",
          stock: 20,
          category: "Esportes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Produto 5",
          price: 50.99,
          description: "Descrição do Produto 5",
          stock: 100,
          category: "Livros",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("products", null, {});
  },
};
