import type { RepoSummary } from './types';

interface GraphQLRepo {
  name: string;
  description: string | null;
  url: string;
  isPrivate: boolean;
  stargazerCount: number;
  forkCount: number;
  updatedAt: string;
  primaryLanguage: { name: string; color: string } | null;
  parent?: { nameWithOwner: string };
}

const REPO_FIELDS = `
  name
  description
  url
  isPrivate
  stargazerCount
  forkCount
  updatedAt
  primaryLanguage {
    name
    color
  }
`;

async function graphql(query: string, token: string) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  if (!res.ok || !json.data) {
    const msg = json.message || JSON.stringify(json.errors ?? json);
    throw new Error(`GitHub API error: ${msg}`);
  }
  return json.data;
}

const summarize = (repo: GraphQLRepo): RepoSummary => ({
  name: repo.name,
  body: repo.description || "",
  url: repo.url,
  language: repo.primaryLanguage?.name,
  languageColor: repo.primaryLanguage?.color,
  starCount: repo.stargazerCount,
  forkCount: repo.forkCount,
  isPublic: !repo.isPrivate,
  updatedAt: repo.updatedAt,
});

/** Fetch all owned non-fork repos */
export async function getAllRepositories(token: string): Promise<RepoSummary[]> {
  const data = await graphql(`query {
    viewer {
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false, isArchived: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes { ${REPO_FIELDS} }
      }
    }
  }`, token);

  return data.viewer.repositories.nodes.map(summarize);
}

/** Fetch forked repos with merged PRs */
export async function getForkedRepositories(token: string): Promise<RepoSummary[]> {
  const data = await graphql(`query {
    viewer {
      login
      repositories(first: 100, ownerAffiliations: OWNER, isFork: true, isArchived: false, orderBy: {field: UPDATED_AT, direction: DESC}) {
        nodes {
          ${REPO_FIELDS}
          parent { nameWithOwner }
        }
      }
    }
  }`, token);

  const login = data.viewer.login;
  const repos = data.viewer.repositories.nodes;

  const reposWithContributions = await Promise.all(
    repos.map(async (repo: GraphQLRepo) => {
      const parent = repo.parent?.nameWithOwner;
      if (!parent) return null;
      try {
        const searchData = await graphql(
          `query { search(query: "is:pr author:${login} repo:${parent} is:merged", type: ISSUE, first: 1) { issueCount } }`,
          token
        );
        return (searchData.search?.issueCount ?? 0) > 0 ? repo : null;
      } catch {
        return null;
      }
    })
  );

  return reposWithContributions.filter(Boolean).map(summarize);
}