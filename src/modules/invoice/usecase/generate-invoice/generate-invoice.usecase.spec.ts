import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    };
};

describe("Generate Invoice UseCase unit test", () => {
    it("should generate a invoice", async () => {
        const repository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(repository);

        const input = {
            name: "Cliente 1",
            document: "00000000000",
            street: "Rua A",
            number: "1",
            complement: "Ap 2",
            city: "Tangamandapio",
            state: "TT",
            zipCode: "00000000",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 30,
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 20,
                },
            ],
        };

        const result = await usecase.execute(input);

        expect(repository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].id).toEqual(input.items[0].id);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].id).toEqual(input.items[1].id);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
        expect(result.total).toEqual(50);
    });
});
