export interface AgentLogin {
  id?: string;
  email: string;
  name: string;
  code: string;
  itemClusterCode?: string;
  allItems?: boolean;
}

export function normalizeEmail(value: unknown): string {
  return String(value ?? '').trim().toLowerCase();
}

export function findAgentByEmails(
  agents: AgentLogin[],
  candidateEmails: string[],
): AgentLogin | undefined {
  const normalizedCandidates = new Set(candidateEmails.map(normalizeEmail).filter(Boolean));
  return agents.find((agent) => normalizedCandidates.has(normalizeEmail(agent.email)));
}
