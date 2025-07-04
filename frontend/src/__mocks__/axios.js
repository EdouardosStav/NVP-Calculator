const mockAxios = {
  create: jest.fn(() => mockAxios),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  get: jest.fn(() => Promise.resolve({ data: {} })),
  isAxiosError: jest.fn(() => false),
};

export default mockAxios;