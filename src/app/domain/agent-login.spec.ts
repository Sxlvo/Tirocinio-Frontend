import { describe, expect, it } from 'vitest';
import { findAgentByEmails, normalizeEmail } from './agent-login';

describe('agent-login', () => {
  const agents = [
    {
      email: 'stage01@bssrl.it',
      name: 'Albertino Mazzanti',
      code: 'AM',
      allItems: true,
    },
  ];

  it('normalizza spazi e maiuscole nell email', () => {
    expect(normalizeEmail(' Stage01@BSSRL.IT ')).toBe('stage01@bssrl.it');
  });

  it('associa l account Microsoft all agente senza distinguere maiuscole e minuscole', () => {
    expect(findAgentByEmails(agents, ['Stage01@bssrl.it'])?.code).toBe('AM');
  });

  it('non associa email differenti', () => {
    expect(findAgentByEmails(agents, ['altro@bssrl.it'])).toBeUndefined();
  });
});
