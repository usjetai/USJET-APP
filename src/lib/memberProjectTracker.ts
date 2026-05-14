import type { FleetUnit } from "../types/fleet";
import { readMemberSession } from "./memberSession";

export const MEMBER_PROJECTS_STORAGE_KEY = "usjet-member-projects";
export const MEMBER_ACTIVE_PROJECT_KEY = "usjet-member-active-project";

export type ProjectFleetAssignment = {
  unitId: string;
  callsign: string;
  name: string;
  jobDescription: string;
  /** Cockpit / browser launches for this unit on this project (one thread per launch). */
  sessionForks: number;
};

export type MemberProject = {
  id: string;
  name: string;
  createdAt: string;
  assignments: ProjectFleetAssignment[];
};

type MemberProjectsByCustomer = Record<string, MemberProject[]>;
type ActiveProjectByCustomer = Record<string, string>;

const PROJECTS_UPDATED_EVENT = "usjet-member-projects-updated";

function newId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeAssignment(raw: Record<string, unknown>): ProjectFleetAssignment {
  const sessionForks =
    typeof raw.sessionForks === "number"
      ? raw.sessionForks
      : typeof raw.usageCount === "number"
        ? raw.usageCount
        : 0;

  return {
    unitId: String(raw.unitId ?? ""),
    callsign: String(raw.callsign ?? ""),
    name: String(raw.name ?? ""),
    jobDescription: String(raw.jobDescription ?? ""),
    sessionForks,
  };
}

function normalizeProject(raw: Record<string, unknown>): MemberProject {
  const assignments = Array.isArray(raw.assignments)
    ? raw.assignments.map((entry) => normalizeAssignment(entry as Record<string, unknown>))
    : [];

  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    assignments,
  };
}

function readStore(): MemberProjectsByCustomer {
  try {
    const raw = localStorage.getItem(MEMBER_PROJECTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") {
      return {};
    }

    const store: MemberProjectsByCustomer = {};
    for (const [customerId, projects] of Object.entries(parsed)) {
      if (!Array.isArray(projects)) {
        continue;
      }
      store[customerId] = projects.map((project) =>
        normalizeProject(project as Record<string, unknown>),
      );
    }
    return store;
  } catch {
    return {};
  }
}

function writeStore(store: MemberProjectsByCustomer): void {
  localStorage.setItem(MEMBER_PROJECTS_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
}

function readActiveProjectStore(): ActiveProjectByCustomer {
  try {
    const raw = localStorage.getItem(MEMBER_ACTIVE_PROJECT_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as ActiveProjectByCustomer;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeActiveProjectStore(store: ActiveProjectByCustomer): void {
  localStorage.setItem(MEMBER_ACTIVE_PROJECT_KEY, JSON.stringify(store));
}

function projectsFor(customerId: string): MemberProject[] {
  return readStore()[customerId] ?? [];
}

function saveProjects(customerId: string, projects: MemberProject[]): void {
  const store = readStore();
  store[customerId] = projects;
  writeStore(store);
}

function updateProject(
  customerId: string,
  projectId: string,
  updater: (project: MemberProject) => MemberProject,
): MemberProject | null {
  const projects = projectsFor(customerId);
  const index = projects.findIndex((project) => project.id === projectId);
  if (index < 0) {
    return null;
  }
  const next = [...projects];
  next[index] = updater(projects[index]);
  saveProjects(customerId, next);
  return next[index];
}

function callsignKey(callsign: string): string {
  return callsign.trim().toUpperCase();
}

function resolveProjectForSessionFork(
  customerId: string,
  callsign: string,
): string | null {
  const key = callsignKey(callsign);
  const projects = projectsFor(customerId);
  const activeProjectId = readActiveProjectStore()[customerId];
  const activeProject = projects.find((project) => project.id === activeProjectId);

  if (
    activeProject?.assignments.some(
      (assignment) => callsignKey(assignment.callsign) === key,
    )
  ) {
    return activeProject.id;
  }

  const matches = projects.filter((project) =>
    project.assignments.some((assignment) => callsignKey(assignment.callsign) === key),
  );

  return matches.length === 1 ? matches[0].id : null;
}

export function setMemberActiveProject(customerId: string, projectId: string): void {
  const store = readActiveProjectStore();
  store[customerId] = projectId;
  writeActiveProjectStore(store);
}

export function readMemberProjects(customerId: string): MemberProject[] {
  return projectsFor(customerId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function createMemberProject(customerId: string, name: string): MemberProject | null {
  const trimmed = name.trim();
  if (!trimmed) {
    return null;
  }

  const project: MemberProject = {
    id: newId(),
    name: trimmed,
    createdAt: new Date().toISOString(),
    assignments: [],
  };

  saveProjects(customerId, [project, ...projectsFor(customerId)]);
  setMemberActiveProject(customerId, project.id);
  return project;
}

export function deleteMemberProject(customerId: string, projectId: string): void {
  saveProjects(
    customerId,
    projectsFor(customerId).filter((project) => project.id !== projectId),
  );
}

export function addFleetUnitToProject(
  customerId: string,
  projectId: string,
  unit: FleetUnit,
): ProjectFleetAssignment | null {
  let created: ProjectFleetAssignment | null = null;

  updateProject(customerId, projectId, (project) => {
    if (project.assignments.some((assignment) => assignment.unitId === unit.id)) {
      return project;
    }

    created = {
      unitId: unit.id,
      callsign: unit.callsign,
      name: unit.name,
      jobDescription: "",
      sessionForks: 0,
    };

    return {
      ...project,
      assignments: [...project.assignments, created],
    };
  });

  return created;
}

export function removeFleetUnitFromProject(
  customerId: string,
  projectId: string,
  unitId: string,
): void {
  updateProject(customerId, projectId, (project) => ({
    ...project,
    assignments: project.assignments.filter((assignment) => assignment.unitId !== unitId),
  }));
}

export function saveProjectAssignment(
  customerId: string,
  projectId: string,
  unitId: string,
  jobDescription: string,
): void {
  updateProject(customerId, projectId, (project) => ({
    ...project,
    assignments: project.assignments.map((assignment) =>
      assignment.unitId === unitId ? { ...assignment, jobDescription } : assignment,
    ),
  }));
}

/** Bump project-scoped session fork when an active member launches a fleet unit. */
export function logProjectSessionForkIfMember(customerId: string, callsign: string): void {
  const session = readMemberSession();
  if (!session?.active || session.customerId !== customerId) {
    return;
  }

  const projectId = resolveProjectForSessionFork(customerId, callsign);
  if (!projectId) {
    return;
  }

  const key = callsignKey(callsign);
  let changed = false;

  const next = projectsFor(customerId).map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    let projectChanged = false;
    const assignments = project.assignments.map((assignment) => {
      if (callsignKey(assignment.callsign) !== key) {
        return assignment;
      }
      projectChanged = true;
      return { ...assignment, sessionForks: assignment.sessionForks + 1 };
    });

    if (projectChanged) {
      changed = true;
      return { ...project, assignments };
    }
    return project;
  });

  if (changed) {
    saveProjects(customerId, next);
  }
}

export function subscribeMemberProjects(onChange: () => void): () => void {
  const handler = () => onChange();
  window.addEventListener(PROJECTS_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(PROJECTS_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}
