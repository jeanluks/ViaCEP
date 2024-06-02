describe('Teste de API - ViaCEP', () => {

  describe('Validação do CEP', ()=>{

    it('CEP Válido', () => {
      cy.request('GET', 'https://viacep.com.br/ws/50710500/json')
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });

    it('CEP Válido com "-"', () => {
      cy.request('GET', 'https://viacep.com.br/ws/50710-500/json')
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });

    it('CEP Inexistente', () => {
      cy.request('GET', 'https://viacep.com.br/ws/12345678/json')
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('erro', true)
        });
    });

    it('CEP Inválido', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/abcde123/json',
        failOnStatusCode:false})

        .then((response) => {
          expect(response.status).to.eq(400);
        });
    });

    it('CEP Caracteres Especiais', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/#07!050@/json',
        failOnStatusCode:false})

        .then((response) => {
          expect(response.status).to.eq(400);
        });
    });
   
    it('CEP Muito Curto', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/0100/json',
        failOnStatusCode:false})

        .then((response) => {
          expect(response.status).to.eq(400);
        });
    });

    it('CEP Muito Longo', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/010001000100/json',
        failOnStatusCode:false})

        .then((response) => {
          expect(response.status).to.eq(400);
        });
    });

      it('Teste de Resposta da API', () => {
        cy.request('GET', 'https://viacep.com.br/ws/01001000/json')
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('cep', '01001-000'),
            expect(response.body).to.have.property('logradouro', 'Praça da Sé'),
            expect(response.body).to.have.property('complemento', 'lado ímpar'),
            expect(response.body).to.have.property('bairro', 'Sé'),
            expect(response.body).to.have.property('localidade', 'São Paulo'),
            expect(response.body).to.have.property('uf', 'SP'),
            expect(response.body).to.have.property('ibge', '3550308'),
            expect(response.body).to.have.property('gia', '1004'),
            expect(response.body).to.have.property('ddd', '11'),
            expect(response.body).to.have.property('siafi', '7107')
          });
      });

      it('Parâmetro Incompleto (CEP)', () => {
        cy.request({
          method: 'GET', 
          url: 'https://viacep.com.br/ws//json',
          failOnStatusCode:false})
  
          .then((response) => {
            expect(response.status).to.eq(400);
          });
      }); 
  });

  describe('Pesquisa de CEP', ()=>{

    it('Procurar CEP Válido', () => {
      cy.request('GET', 'https://viacep.com.br/ws/pe/recife/conde/json')
        .then((response) => {
          expect(response.status).to.eq(200);
        });
    });

    it('Procurar CEP Estado Inexistente', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/XX/recife/conde/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que o estado é inválido.
        });
    });

    it('Procurar CEP Estado Menos de 2 Caracteres', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/X/recife/conde/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que o estado é inválido pois não pode ter MENOS de 2 caracteres.
        });
    });

    it('Procurar CEP Estado Mais de 2 Caracteres', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/pernambuco/recife/conde/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que o estado é inválido pois não pode ter MAIS de 2 caracteres.
        });
    });

    it('Procurar CEP Cidade Inexistente', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/pe/CidadeInexistente/conde/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que a CIDADE é inválida.
        });
    });

    it('Procurar CEP Cidade com 3 Caracteres', () => {
      cy.request('GET','https://viacep.com.br/ws/sp/itu/conde/json')

        .then((response) => {
          expect(response.status).to.eq(200); //Esperado retornar sucesso indicando que a CIDADE é válida e pode ter PELO MENOS 3 caracteres.
        });
    });

    it('Procurar CEP Cidade com Menos de 3 Caracteres', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/pe/re/conde/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que a CIDADE é inválido pois não pode ter MENOS de 3 caracteres.
        });
    });

    it('Procurar CEP Logradouro Inexistente', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/pe/recife/LogradouroInexistente/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que o Logradouro é inválido.
        });
    });

    it('Procurar CEP Logradouro com 3 Caracteres', () => {
      cy.request('GET','https://viacep.com.br/ws/pe/recife/rua/json')

        .then((response) => {
          expect(response.status).to.eq(200); //Esperado retornar sucesso indicando que o Logradouro é válido e pode ter PELO MENOS 3 caracteres.
        });
    });

    it('Procurar CEP Logradouro com Menos de 3 Caracteres', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/pe/recife/co/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que o Logradouro é inválido e não pode ter MENOS de 3 caracteres.
        });
    });

    it('Parâmetros Inclompletos (Logradouro)', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/pe/recife//json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que o Logradouro é obrigatorio
        });
    });

    it('Parâmetros Inclompletos (Cidade)', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws/pe//conde/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que a Cidade é obrigatorio
        });
    });

    it('Parâmetros Inclompletos (Estado)', () => {
      cy.request({
        method: 'GET', 
        url: 'https://viacep.com.br/ws//recife/conde/json',
        failOnStatusCode: false})

        .then((response) => {
          expect(response.status).to.eq(400); //Esperado retornar erro indicando que o Estado é obrigatorio
        });
    });

    it('Teste de Resposta da API', () => {
      cy.request('GET', 'https://viacep.com.br/ws/pe/recife/conde/json')
        .then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.at.most(50); //Esperado que seja retornado um array e que possua tamanho maximo de 50
        });
    });
  })
});
