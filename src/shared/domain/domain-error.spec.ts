import { DomainError } from './domain-error.js';

class SampleError extends DomainError {
  readonly code: string = 'SAMPLE_ERROR';
}

describe('DomainError', () => {
  test('should keep the message', () => {
    const error = new SampleError('Algo deu errado');
    expect(error.message).toBe('Algo deu errado');
  });
  test('should expose a stable code defined by the subclass', () => {
    const error = new SampleError('Algo deu errado');
    expect(error.code).toBe('SAMPLE_ERROR');
  });

  test('should use the subclass name as the error name', () => {
    const error = new SampleError('Algo deu errado');
    expect(error.name).toBe('SampleError');
  });

  test('should be an Error and a DomainError', () => {
    const error = new SampleError('SampleError');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DomainError);
  });
});
